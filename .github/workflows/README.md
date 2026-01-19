# CI/CD Workflows Documentation

This document describes the GitHub Actions workflows configured for this project, including CI checks, build processes, and automated deployment to Cloudflare Pages.

## Overview

The project uses two main workflows:

1. **CI - Quality Checks and Build** (`ci.yml`) - Runs quality checks and builds the project
2. **Deploy to Cloudflare Pages** (`cloudflare-pages.yml`) - Deploys the built application

## Workflow Architecture

```
┌─────────────────────────────────────────────────┐
│  Push to any branch or Open PR                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  CI - Quality Checks and Build                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Type     │  │ Lint     │  │ Test     │     │
│  │ Check    │  │          │  │          │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│  ┌──────────────────────────────────────────┐  │
│  │ Build (verifies output)                   │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ (if all checks pass)
                  ▼
┌─────────────────────────────────────────────────┐
│  Deploy to Cloudflare Pages                     │
│  ┌──────────────────────────────────────────┐  │
│  │ Check for duplicate deployments          │  │
│  │ Poll CI status (if push-triggered)       │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │ Build directly (no artifacts needed)     │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │ Deploy to Cloudflare Pages               │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Workflow Details

### 1. CI - Quality Checks and Build

**File:** `.github/workflows/ci.yml`

**Triggers:**
- Push to **all branches** (enables feature branch deployments)
- Pull requests targeting `main` or `develop`
- Manual workflow dispatch

**Jobs:**

#### Parallel Quality Checks

All quality checks run in parallel for faster feedback:

1. **Type Check** (`type-check`)
   - Runs `npm run sync` to generate SvelteKit config
   - Runs `npm run check`
   - Validates TypeScript types and Svelte component syntax
   - Fails the workflow if type errors are found

2. **Lint** (`lint`)
   - Runs `npm run lint`
   - Checks code style and catches potential issues
   - Uses ESLint configuration

3. **Test** (`test`)
   - Runs `npm run test`
   - Executes unit and integration tests via Vitest
   - Ensures code functionality is correct

#### Build Job

4. **Build** (`build`)
   - Runs `npm run sync` to generate SvelteKit config
   - Runs `npm run build`
   - Creates production build in `frontend/build/`
   - Verifies build output exists and contains required files
   - Displays build statistics (size, file count, etc.)
   - **Note:** Artifacts are no longer uploaded (deployment builds directly)

#### Summary Job

5. **CI Success** (`ci-success`)
   - Depends on all previous jobs
   - Verifies all checks passed
   - Provides final status confirmation

**Performance:**
- Parallel execution reduces total CI time
- Typical duration: ~2-3 minutes (longest job determines total time)
- No artifact upload (saves ~10-15 seconds per run)

### 2. Deploy to Cloudflare Pages

**File:** `.github/workflows/cloudflare-pages.yml`

**Triggers:**
- **Primary:** `workflow_run` - After CI workflow completes successfully (all branches)
- **Fallback:** `push` - Direct push to feature branches (with CI status check)
- **Manual:** `workflow_dispatch` - Manual trigger (with optional CI check skip)

**Job: Deploy**

#### Workflow Dependency

- Uses `workflow_run` trigger to wait for CI completion
- Only deploys if CI workflow concluded successfully
- Prevents deploying broken builds

#### Concurrency Control

- Prevents concurrent deployments for the same branch
- Cancels in-progress deployments when a new one starts
- Ensures only the latest commit is deployed

#### Build Process

- **Builds directly** in the deployment workflow
- No artifact download needed (avoids permission issues)
- Ensures fresh build for each deployment
- Includes SvelteKit sync step before building

#### Deployment

- **Production:** Deploys to `main` branch → Production environment
- **Preview:** Deploys to feature branches → Preview environment with branch-based URLs
- Uses Cloudflare Pages action with proper authentication
- Includes build verification before deployment
- **Duplicate Prevention:** Checks for existing `workflow_run` deployments before push-triggered deployments
- **CI Status Polling:** For push events, polls CI status (waits up to 5 minutes) instead of failing immediately

**Environment Variables Required:**
- `CLOUDFLARE_API_TOKEN` - API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

## Optimizations Implemented

### 1. Parallel Job Execution
- **Before:** Sequential execution (~4-5 minutes)
- **After:** Parallel execution (~2-3 minutes)
- **Benefit:** Faster feedback, especially for PRs

### 2. Direct Build in Deployment
- **Before:** Downloaded artifacts from CI (permission issues, complexity)
- **After:** Builds directly in deployment workflow
- **Benefit:** Simpler workflow, avoids permission issues, ensures fresh builds

### 3. Quality Checks
- **Before:** Only type check and build
- **After:** Type check, lint, test, and build
- **Benefit:** Catches issues earlier, better code quality

### 4. Workflow Dependency
- **Before:** Deploy could run even if CI failed
- **After:** Deploy only runs after CI succeeds
- **Benefit:** Prevents deploying broken code

### 5. Concurrency Control
- **Before:** Multiple deployments could run simultaneously
- **After:** One deployment per branch at a time
- **Benefit:** Prevents conflicts, ensures latest code deploys

### 6. Duplicate Deployment Prevention
- **Before:** Both `workflow_run` and `push` triggers could deploy simultaneously
- **After:** Checks for existing `workflow_run` deployments before push-triggered deployments
- **Benefit:** Prevents duplicate deployments, saves compute resources

### 7. CI Status Polling
- **Before:** Push-triggered deployments failed immediately if CI was still running
- **After:** Polls CI status for up to 5 minutes, waits for completion
- **Benefit:** More reliable deployments, handles CI timing variations

### 8. SvelteKit Sync Consistency
- **Before:** Only test and build jobs ran `npm run sync`
- **After:** All jobs that need it (type-check, test, build) run sync step
- **Benefit:** Consistent setup, prevents missing config errors

## Workflow Status Badges

You can add status badges to your README:

```markdown
![CI](https://github.com/your-username/your-repo/workflows/CI%20-%20Quality%20Checks%20and%20Build/badge.svg)
![Deploy](https://github.com/your-username/your-repo/workflows/Deploy%20to%20Cloudflare%20Pages/badge.svg)
```

## Manual Deployment

### Via GitHub UI

1. Go to **Actions** tab
2. Select **Deploy to Cloudflare Pages**** workflow
3. Click **Run workflow**
4. Choose branch and click **Run workflow**

### Skip CI Check (Use with Caution)

When manually dispatching, you can skip the CI check:
- Enable the `skip_ci_check` input
- ⚠️ **Warning:** Only use this if you're certain the code is ready

## Troubleshooting

### CI Fails

**Type Check Fails:**
- Fix TypeScript errors
- Run `npm run check` locally to verify

**Lint Fails:**
- Fix ESLint errors
- Run `npm run lint` locally
- Use `npm run lint:fix` for auto-fixes

**Test Fails:**
- Fix failing tests
- Run `npm run test` locally to debug

**Build Fails:**
- Check build errors in logs
- Verify all dependencies are installed
- Run `npm run build` locally

### Deployment Fails

**CI Status Check Fails:**
- For push events, workflow polls CI status for up to 5 minutes
- If CI is still running after 5 minutes, deployment fails
- Check CI workflow logs to see why it's taking so long
- Ensure CI workflow is configured correctly

**Cloudflare Deployment Fails:**
- Verify `CLOUDFLARE_API_TOKEN` secret is set correctly
- Verify `CLOUDFLARE_ACCOUNT_ID` secret is set correctly
- Check Cloudflare Pages project name matches (`zhaoyu-io`)
- Review Cloudflare dashboard for error details

**Concurrent Deployment:**
- Wait for current deployment to complete
- Or cancel the in-progress deployment manually

## Workflow Configuration

### Node.js Version

Both workflows use Node.js `24.13.0`:
- Defined in `.nvmrc` file
- Ensures consistent builds across environments

### Caching

Both workflows use npm cache:
- Cache key based on `package-lock.json`
- Speeds up dependency installation
- Automatically invalidated when dependencies change

### Build Output

- **Directory:** `frontend/build/`
- **Adapter:** `@sveltejs/adapter-static`
- **Mode:** SPA (Single Page Application)
- **Fallback:** `index.html` for client-side routing

## Best Practices

1. **Always run CI locally before pushing:**
   ```bash
   npm run check
   npm run lint
   npm run test
   npm run build
   ```

2. **Fix CI failures before requesting review:**
   - PRs with failing CI should not be merged
   - Reviewers can see CI status on PR page

3. **Use feature branches:**
   - Create branches for new features
   - CI runs on all branches automatically
   - Feature branches get preview deployments with branch-based URLs

4. **Monitor deployment status:**
   - Check GitHub Actions tab for workflow status
   - Check Cloudflare Pages dashboard for deployment logs

5. **Review build statistics:**
   - CI workflow shows build size and file counts
   - Monitor for unexpected size increases

## Related Documentation

- [Deployment Guide](../frontend/docs/DEPLOYMENT.md) - Detailed Cloudflare Pages setup
- [Development Workflow](../frontend/.cursor/docs/DEVELOPMENT_WORKFLOW.md) - Local development practices
- [Testing Guide](../frontend/.cursor/docs/TESTING.md) - Testing strategies

## Workflow Files

- `.github/workflows/ci.yml` - CI quality checks and build
- `.github/workflows/cloudflare-pages.yml` - Deployment workflow
- `.github/workflows/CLOUDFLARE_SETUP.md` - Cloudflare Pages configuration guide

## Cloudflare Pages Configuration

For feature branch preview deployments to work correctly, verify your Cloudflare Pages settings:

**Quick Check:**
1. **Production branch:** Set to `main` (Settings → Builds & deployments)
2. **Preview branch control:** Should allow "All non-production branches" (default)
3. **Access Policy:** Configure as desired (public or restricted)

**Detailed Guide:** See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for complete configuration instructions.

## Support

For issues or questions about CI/CD:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check Cloudflare Pages dashboard for deployment issues
4. Verify GitHub secrets are configured correctly
