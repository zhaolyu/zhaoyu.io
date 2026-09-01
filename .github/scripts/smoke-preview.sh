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
# against a login page.
home_body="$(curl -sS "${AUTH[@]}" -L --max-time 30 "$BASE/" || true)"
[ -n "$home_body" ] || die_cannot_run "empty response from $BASE/"
case "$home_body" in
  *cloudflareaccess*|*"<title>Sign in"*)
    die_cannot_run "Access challenged the request; the service token is missing, wrong, or not authorised for this application" ;;
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
