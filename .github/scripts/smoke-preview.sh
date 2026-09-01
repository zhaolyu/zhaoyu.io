#!/usr/bin/env bash
#
# Smoke-test a deployed preview through Cloudflare Access.
#
# The preview sits behind Access, so an unauthenticated fetch returns the login
# page with HTTP 200. A naive "did it return 200?" check therefore passes
# against a page that contains none of the site. That is the fail-open shape
# this repo's own flagship note is about, so this script treats an Access
# challenge as COULD-NOT-RUN, never as a pass.
#
# Three outcomes, never two:
#   0  every assertion passed
#   1  an assertion failed (the deploy is wrong)
#   2  could not run (no URL, no credentials, or Access blocked us)
#
# Credentials come from an Access service token (Zero Trust -> Access ->
# Service Auth), passed as the CF-Access-Client-Id / CF-Access-Client-Secret
# headers. The gate stays up for humans; CI and agents carry the token.
#
# Usage: smoke-preview.sh <preview-url>
set -uo pipefail

BASE="${1:-}"
REDIRECTS_FILE="${REDIRECTS_FILE:-frontend/static/_redirects}"

die_cannot_run() { echo "COULD-NOT-RUN: $1" >&2; exit 2; }
fail()           { echo "FAIL: $1" >&2; FAILED=1; }
FAILED=0

[ -n "$BASE" ] || die_cannot_run "no preview URL argument"
BASE="${BASE%/}"
case "$BASE" in https://*) ;; *) die_cannot_run "preview URL is not https: $BASE" ;; esac
[ -f "$REDIRECTS_FILE" ] || die_cannot_run "missing $REDIRECTS_FILE"

if [ -z "${CF_ACCESS_CLIENT_ID:-}" ] || [ -z "${CF_ACCESS_CLIENT_SECRET:-}" ]; then
  die_cannot_run "CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET are not set. \
Create an Access service token and add both as repository secrets, or remove \
the Access policy from the Pages project. Reporting could-not-run rather than \
skipping: a check that goes quiet when its credentials are missing is \
indistinguishable from one that passed."
fi

AUTH=(-H "CF-Access-Client-Id: ${CF_ACCESS_CLIENT_ID}"
      -H "CF-Access-Client-Secret: ${CF_ACCESS_CLIENT_SECRET}")

# --- Assert the token actually got us past Access before testing anything -----
# Without this the whole run is theatre: every later assertion would be made
# against a login page. Access answers an unauthenticated request with a 302 to
# its login page rather than a 401, so status alone does not say what went
# wrong. The redirect carries a signed `meta` JWT whose `service_token_status`
# distinguishes the two failures that need different fixes, and reporting
# "Access challenged" without it sends the reader to re-check the credential
# when the credential may be fine.
headers="$(curl -sS "${AUTH[@]}" -D- -o /dev/null --max-time 30 "$BASE/models" 2>/dev/null || true)"
[ -n "$headers" ] || die_cannot_run "no response from $BASE/models"

location="$(printf '%s' "$headers" | tr -d '\r' | sed -n 's/^[Ll]ocation: //p' | tail -1)"
case "$location" in
  *cloudflareaccess.com*)
    evaluated="$(printf '%s' "$location" | python3 -c '
import sys, base64, json, re
loc = sys.stdin.read()
m = re.search(r"[?&]meta=([^&]+)", loc)
if not m:
    print("unknown"); raise SystemExit
try:
    payload = m.group(1).split(".")[1]
    payload += "=" * (-len(payload) % 4)
    print(str(json.loads(base64.urlsafe_b64decode(payload)).get("service_token_status")).lower())
except Exception:
    print("unknown")
' 2>/dev/null || echo unknown)"
    case "$evaluated" in
      false)
        die_cannot_run "Cloudflare Access did not evaluate the service token at all (service_token_status=false in its own challenge, with the headers present). The token value is not the problem: the Access application covering this hostname has no Service Auth policy naming it. Zero Trust > Access > Applications > the app for this hostname > Policies > add a policy with action Service Auth and an include rule naming the token." ;;
      true)
        die_cannot_run "Cloudflare Access evaluated the service token and rejected it (service_token_status=true). The Client ID or Secret is wrong, or the token has expired or been revoked. Reissue under Zero Trust > Access > Service Auth and update both repository secrets." ;;
      *)
        die_cannot_run "Access challenged the request and its reason could not be decoded. Check the Service Auth policy on the application covering this hostname." ;;
    esac ;;
esac
echo "ok: authenticated past Cloudflare Access"

# --- /models renders its content as static HTML ------------------------------
models_body="$(curl -sS "${AUTH[@]}" -L --max-time 30 "$BASE/models" || true)"
for probe in "Where it came from" "Mental Models"; do
  case "$models_body" in
    *"$probe"*) echo "ok: /models contains \"$probe\"" ;;
    *)          fail "/models is missing \"$probe\"" ;;
  esac
done

# --- Every rule in _redirects actually redirects ------------------------------
# Parsed from the file rather than hardcoded, so this cannot drift from it.
rules=0
while read -r from to status _rest; do
  case "$from" in ''|'#'*) continue ;; esac
  [ -n "$to" ] && [ -n "$status" ] || { fail "unparseable rule: $from"; continue; }
  rules=$((rules + 1))
  observed="$(curl -sS "${AUTH[@]}" -o /dev/null --max-time 30 -w '%{http_code} %{redirect_url}' "$BASE$from" || true)"
  code="${observed%% *}"
  location="${observed#* }"
  if [ "$code" != "$status" ]; then
    fail "$from returned $code, expected $status (location: ${location:-none})"
  elif [ "${location%$to}" = "$location" ]; then
    fail "$from redirected to ${location:-nothing}, expected a URL ending $to"
  else
    echo "ok: $from -> $to ($code)"
  fi
done < "$REDIRECTS_FILE"

[ "$rules" -gt 0 ] || die_cannot_run "no redirect rules parsed from $REDIRECTS_FILE; \
an empty rule set would otherwise report a clean run having tested nothing"

if [ "$FAILED" -ne 0 ]; then
  echo "FAIL: preview smoke test found problems above" >&2
  exit 1
fi
echo "PASS: preview smoke test, $rules redirect rule(s) verified"
