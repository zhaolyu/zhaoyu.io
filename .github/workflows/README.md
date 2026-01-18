# CI/CD Workflows Documentation

This document describes the GitHub Actions workflows configured for this project, including CI checks, build processes, and automated deployment to Cloudflare Pages.

## Overview

The project uses two main workflows:

1. **CI - Quality Checks and Build** (`ci.yml`) - Runs quality checks and builds the project
2. **Deploy to Cloudflare Pages** (`cloudflare-pages.yml`) - Deploys the built application

## Workflow Architecture

```
┌─────────────────────────────────────────────────┐
│  Push to main/develop or Open PR                │
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
│  │ Build (uploads artifacts)                │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ (if all checks pass)
                  ▼
┌─────────────────────────────────────────────────┐
│  Deploy to Cloudflare Pages                     │
│  ┌──────────────────────────────────────────┐  │
│  │ Download build artifacts from CI         │  │
│  │ (or build locally if artifacts missing)  │  │
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
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`
- Manual workflow dispatch

**Jobs:**

#### Parallel Quality Checks

All quality checks run in parallel for faster feedback:

1. **Type Check** (`type-check`)
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
   - Runs `npm run build`
   - Creates production build in `frontend/build/`
   - Verifies build output exists and contains required files
   - **Uploads build artifacts** for use by deployment workflow
   - Displays build statistics (size, file count, etc.)

#### Summary Job

5. **CI Success** (`ci-success`)
   - Depends on all previous jobs
   - Verifies all checks passed
   - Provides final status confirmation

**Artifacts:**
- Build output is uploaded as `build-output` artifact
- Retention: 1 day
- Compression level: 6 (balanced size/speed)

**Performance:**
- Parallel execution reduces total CI time
- Typical duration: ~2-3 minutes (longest job determines total time)

### 2. Deploy to Cloudflare Pages

**File:** `.github/workflows/cloudflare-pages.yml`

**Triggers:**
- **Automatic:** After CI workflow completes successfully on `main` or `develop`
- **Manual:** Workflow dispatch (with optional CI check skip)

**Job: Deploy**

#### Workflow Dependency

- Uses `workflow_run` trigger to wait for CI completion
- Only deploys if CI workflow concluded successfully
- Prevents deploying broken builds

#### Concurrency Control

- Prevents concurrent deployments for the same branch
- Cancels in-progress deployments when a new one starts
- Ensures only the latest commit is deployed

#### Build Artifact Reuse

1. **Download Artifacts** (preferred)
   - Downloads build artifacts from CI workflow
   - Saves ~2-3 minutes by avoiding rebuild
   - Uses `actions/download-artifact@v4`

2. **Fallback Build** (if artifacts unavailable)
   - Builds locally if artifacts can't be downloaded
   - Useful for manual deployments
   - Ensures deployment always works

#### Deployment

- **Production:** Deploys to `main` branch → Production environment
- **Preview:** Deploys to `develop` or other branches → Preview environment
- Uses Cloudflare Pages action with proper authentication
- Includes build verification before deployment

**Environment Variables Required:**
- `CLOUDFLARE_API_TOKEN` - API token with Pages edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

## Optimizations Implemented

### 1. Parallel Job Execution
- **Before:** Sequential execution (~4-5 minutes)
- **After:** Parallel execution (~2-3 minutes)
- **Benefit:** Faster feedback, especially for PRs

### 2. Build Artifact Reuse
- **Before:** Rebuilt in deploy workflow (~2-3 minutes)
- **After:** Reuses CI build artifacts (~30 seconds download)
- **Benefit:** Faster deployments, consistent builds

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

### 6. Branch Optimization
- **Before:** Deployed on every `feature/**` and `dev/**` push
- **After:** Only deploys `main` and `develop` automatically
- **Benefit:** Reduces unnecessary deployments and costs

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

**Artifact Download Fails:**
- Workflow will automatically fall back to local build
- Check that CI workflow completed successfully
- Verify artifact retention hasn't expired (1 day)

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
   - CI runs on PRs, but deployment only on `main`/`develop`

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

## Support

For issues or questions about CI/CD:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check Cloudflare Pages dashboard for deployment issues
4. Verify GitHub secrets are configured correctly
