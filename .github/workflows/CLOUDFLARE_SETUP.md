# Cloudflare Pages Configuration for Optimized Workflows

This document outlines the Cloudflare Pages settings needed to support the optimized GitHub Actions workflows, particularly feature branch preview deployments.

## Required Settings

### 1. Production Branch Configuration

**Location:** Cloudflare Pages Dashboard → Your Project (`zhaoyu-io`) → **Settings** → **Builds & deployments**

**Action Required:**

- Ensure **Production branch** is set to `main`
- This ensures `main` branch deployments go to production
- All other branches will automatically be treated as preview deployments

**Default Behavior:**

- If you haven't changed this, the first branch you deployed is likely already set as production
- Verify it's set to `main`

### 2. Preview Branch Control (Recommended)

**Location:** Cloudflare Pages Dashboard → Your Project → **Settings** → **Builds & deployments** → **Preview branch control**

**Recommended Setting:**

- **Option:** "All non-production branches" (default)
- This allows all feature branches to get preview deployments automatically

**Alternative Options:**

- **"None"**: Disables automatic preview deployments (not recommended for your workflow)
- **"Custom"**: Use wildcard patterns to include/exclude specific branches
  - Example: Include `feature/*`, `fix/*` but exclude `dependabot/*`

**Why This Matters:**

- Your GitHub Actions workflow deploys feature branches automatically
- Cloudflare Pages needs to accept these deployments and create preview URLs
- With "All non-production branches" enabled, every deployment from a non-main branch gets a preview URL

### 3. Access Policy for Previews (Optional)

**Location:** Cloudflare Pages Dashboard → Your Project → **Settings** → **General** → **Access Policy**

**Current Status:**

- Preview deployments are **public by default**
- If you previously enabled Cloudflare Access for previews, you may need to adjust it

**If You Have Cloudflare Access Enabled:**

- **Option 1:** Disable Access Policy for previews (make them public)
  - Recommended if you want easy sharing of preview URLs
- **Option 2:** Keep Access Policy enabled
  - Ensure your team members have access
  - Preview URLs will require authentication

**Recommendation:**

- For development workflows, keeping previews public is usually easier
- You can always enable Access later if needed for sensitive features

### 4. Project Name Verification

**Location:** Cloudflare Pages Dashboard → Your Project

**Action Required:**

- Verify your project name is exactly: `zhaoyu-io`
- This must match the `projectName` in `.github/workflows/cloudflare-pages.yml`
- If it doesn't match, either:
  - Rename the project in Cloudflare, OR
  - Update the workflow file

### 5. Custom Domain Configuration (Already Set Up)

**Location:** Cloudflare Pages Dashboard → Your Project → **Custom domains**

**Current Setup:**

- Production domain: `zhaoyu.io` (should be configured)
- Preview deployments use: `{branch-name}.zhaoyu-io.pages.dev`

**No Changes Needed:**

- Custom domains only affect production deployments
- Preview URLs automatically use the `.pages.dev` subdomain`

## Quick Verification Checklist

Before pushing feature branches, verify:

- [ ] Production branch is set to `main`
- [ ] Preview branch control allows "All non-production branches" (or your custom pattern)
- [ ] Project name matches `zhaoyu-io` in workflow file
- [ ] Access Policy is configured as desired (public or restricted)
- [ ] Custom domain `zhaoyu.io` is configured for production

## Testing Feature Branch Deployments

1. Create a test feature branch:

   ```bash
   git checkout -b test/preview-deployment
   git commit --allow-empty -m "Test preview deployment"
   git push origin test/preview-deployment
   ```

2. Wait for CI to complete (check GitHub Actions)

3. Wait for deployment to complete (check GitHub Actions)

4. Verify preview URL:
   - Should be: `https://test-preview-deployment.zhaoyu-io.pages.dev`
   - Also check Cloudflare Pages dashboard → Deployments tab
   - Look for the branch name in the deployment list

5. If preview URL doesn't work:
   - Check Cloudflare Pages dashboard for deployment status
   - Verify preview branch control settings
   - Check deployment logs in GitHub Actions

## Common Issues

### Issue: Preview URLs return 404 or "Nothing is here yet"

**Possible Causes:**

1. Preview branch control is set to "None"
   - **Fix:** Change to "All non-production branches"
2. Deployment failed but workflow shows success
   - **Fix:** Check Cloudflare Pages dashboard → Deployments for error details
3. Branch name contains special characters
   - **Fix:** Workflow already handles this (replaces `/` with `-`)

### Issue: Preview deployments are blocked by Access Policy

**Symptom:** Preview URLs require authentication

**Fix Options:**

1. Disable Access Policy for previews (Settings → General → Access Policy)
2. Add team members to the Access Policy
3. Use hash-based URLs from Cloudflare dashboard (these may also require auth)

### Issue: Wrong branch deployed to production

**Symptom:** Feature branch appears on production domain

**Fix:**

- Verify Production branch is set to `main` in Settings → Builds & deployments
- Check that workflow correctly identifies `main` vs feature branches

## No Changes Needed If...

You don't need to make changes if:

- ✅ Your project already has preview deployments working
- ✅ Production branch is correctly set to `main`
- ✅ Preview branch control allows your feature branches
- ✅ You're okay with public preview URLs (or Access is already configured)

## Summary

**Most Likely Scenario:** No changes needed! Cloudflare Pages defaults support feature branch previews.

**If Preview Deployments Aren't Working:**

1. Check Preview branch control (should allow all non-production branches)
2. Verify Production branch is set to `main`
3. Check Access Policy if previews require authentication unexpectedly

The optimized workflows work with Cloudflare Pages' default settings, so you likely don't need any changes unless you've previously customized these settings.

---

## Preview deployments and Cloudflare Access

Preview deployments sit behind Cloudflare Access. That is deliberate: `static/robots.txt`
is `Allow: /` with no host condition and ships identically to preview and production, so a
public preview would be a crawlable near-duplicate of zhaoyu.io on a `.pages.dev` domain,
with unshipped drafts indexable before anyone decided to ship them.

The cost is that CI cannot see its own deployment. An unauthenticated fetch of a preview
URL returns the Access login page **with HTTP 200**, so a naive check passes against a page
containing none of the site. `.github/scripts/smoke-preview.sh` treats that as
could-not-run rather than a pass, which is why it needs a credential.

### Issue the service token

This is dashboard work; nothing in this repo can do it.

1. Cloudflare **Zero Trust** dashboard → **Access** → **Service Auth** → **Create Service Token**.
   Name it for what it is (e.g. `zhaoyu-io-ci-preview`) and copy the Client ID and Client
   Secret. **The secret is shown once.**
2. Zero Trust → **Access** → **Applications** → the application covering
   `*.zhaoyu-io.pages.dev` → **Policies** → add a policy with action **Service Auth** and a
   single include rule: **Service Token** → the token you just created.
   A Service Auth policy is required. A token alone does not grant access; the application
   has to name it.
3. GitHub → repo **Settings** → **Secrets and variables** → **Actions** → add
   `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`.

Tokens expire (1 year by default). Renewal is the same three steps.

### The check is blocking

It shipped advisory (`continue-on-error: true`) while the token did not exist, because a
step that fails every run gets ignored, which is worse than no step. The first `PASS`
landed 2026-09-01 and `continue-on-error` was removed in the same change, so the step now
fails the job on exit 1 **and** on exit 2. Could-not-run fails deliberately: once the
token exists, absent or rejected credentials mean something broke rather than something
is pending, and a check that goes quiet at exactly that moment is the failure it was
built to catch.

If the token is ever revoked or expires, this step is the thing that will tell you, by
failing the build with the reason in its own output.

### Running it by hand

```bash
CF_ACCESS_CLIENT_ID=... CF_ACCESS_CLIENT_SECRET=... \
  bash .github/scripts/smoke-preview.sh https://<branch>.zhaoyu-io.pages.dev
```

Exit codes are three-valued on purpose: `0` passed, `1` an assertion failed, `2` could not
run. A caller that cannot tell `2` from `0` has the defect the script exists to catch.

### If you would rather drop the gate entirely

Workers & Pages → `zhaoyu-io` → **Settings** → **General** → **Access Policy** → disable;
or delete the Zero Trust application above. Previews become world-readable. If you do this,
serve a `noindex` on preview hostnames first, or the duplicate-content problem at the top
of this section becomes real.
