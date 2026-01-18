# Deployment Guide - Cloudflare Pages

This guide covers deploying the SvelteKit frontend to Cloudflare Pages using GitHub Actions CI/CD.

## Overview

This project is configured for automated deployment to Cloudflare Pages via GitHub Actions with support for both **production** and **dev/preview** environments:

- **Production**: Deploys on push to `main` branch → `zhaoyu.io`
- **Dev/Preview**: Deploys on push to other branches → `{branch-name}.zhaoyu-io.pages.dev`

Every push to configured branches automatically triggers a build and deployment.

## Prerequisites

Before deploying, ensure you have:

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository** - Your code pushed to GitHub
3. **Cloudflare API Token** - With Pages permissions
4. **Cloudflare Account ID** - Found in your Cloudflare dashboard

## Step 1: Get Cloudflare API Token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Workers** template or create a custom token with:
   - **Permissions**: 
     - `Account` → `Cloudflare Pages` → `Edit`
   - **Account Resources**: Include your account
5. Click **Continue to summary** → **Create Token**
6. **Copy the token immediately** - you won't be able to see it again!

## Step 2: Get Cloudflare Account ID

1. In Cloudflare Dashboard, select any domain
2. Scroll down to the **API** section in the right sidebar
3. Copy your **Account ID**

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   **Secret 1: `CLOUDFLARE_API_TOKEN`**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Paste your Cloudflare API token from Step 1

   **Secret 2: `CLOUDFLARE_ACCOUNT_ID`**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Paste your Cloudflare Account ID from Step 2

5. Click **Add secret** for each

## Step 4: Create Cloudflare Pages Project

**Important**: You need a **Pages** project, not a Workers project. Make sure you're creating it under "Pages", not "Workers".

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Pages** (not Workers!)
3. Click **Create a project**
4. Select **Upload assets** (we're using GitHub Actions, not Cloudflare's Git integration)
5. Enter project name: `zhaoyu-io`
6. You can skip the upload for now - GitHub Actions will handle deployments
7. Click **Create project**

**Note**: 
- Make sure you're creating a **Pages** project, not a Workers project
- The project name must match exactly: `zhaoyu-io`
- After creating, the first deployment will happen when you push to `main` branch via GitHub Actions

## Step 5: Trigger First Deployment

1. Ensure the GitHub Actions workflow file exists: `.github/workflows/cloudflare-pages.yml`
2. Push to the `main` branch:
   ```bash
   git add .
   git commit -m "Add Cloudflare Pages deployment"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub to watch the deployment
4. Once complete, check Cloudflare Pages dashboard for your deployment

## Step 6: Configure Custom Domain

1. In Cloudflare Pages dashboard, select your project (`zhaoyu-io`)
2. Go to **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain: `zhaoyu.io`
5. Cloudflare will automatically configure DNS records
6. Wait for DNS propagation (usually a few minutes)

### DNS Configuration

If you need to configure DNS manually:

1. In Cloudflare Dashboard, go to your domain's DNS settings
2. Add a CNAME record:
   - **Name**: `@` (or leave blank for root domain)
   - **Target**: `zhaoyu-io.pages.dev`
   - **Proxy status**: Proxied (orange cloud)

For `www` subdomain:
- **Name**: `www`
- **Target**: `zhaoyu-io.pages.dev`
- **Proxy status**: Proxied

## How the CI/CD Pipeline Works

> 📖 **For detailed CI/CD documentation, see:** [`.github/workflows/README.md`](../../.github/workflows/README.md)

The project uses a two-stage CI/CD pipeline:

### Stage 1: CI - Quality Checks and Build

The CI workflow (`.github/workflows/ci.yml`) runs automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

**Quality Checks (run in parallel):**
1. **Type Check** - Validates TypeScript types
2. **Lint** - Checks code style with ESLint
3. **Test** - Runs unit/integration tests
4. **Build** - Creates production build and uploads artifacts

### Stage 2: Deploy to Cloudflare Pages

The deploy workflow (`.github/workflows/cloudflare-pages.yml`) automatically:
1. **Waits** for CI workflow to complete successfully
2. **Downloads** build artifacts from CI (or builds locally if unavailable)
3. **Verifies** build output exists
4. **Deploys** to Cloudflare Pages using the `cloudflare/pages-action`

**Triggers:**
- Automatically after successful CI on `main` or `develop`
- Manual workflow dispatch (with optional CI check skip)

### Workflow Details

```yaml
- Builds from: frontend/ directory
- Build output: frontend/build/
- Node version: 24.13.0 (from .nvmrc)
- Deployment: Automatic via cloudflare/pages-action
- Triggers: main, develop branches (automatic)
- Artifact reuse: Build artifacts from CI are reused for faster deployment
```

## Deployment Environments

This project is configured with **two deployment environments**:

### Production Environment

**Trigger:** Push to `main` branch

**Deployment:**
- Deploys to **Production** environment
- Available at: `https://zhaoyu-io.pages.dev`
- Custom domain: `https://zhaoyu.io` (when configured)
- Used for live, production-ready code

**Configuration:**
- Branch: `main`
- Environment: Production
- Custom domain: `zhaoyu.io`

### Dev/Preview Environment

**Trigger:** Push to `develop` branch (or manual deployment)

**Deployment:**
- Deploys as **Preview** deployment
- Available at: `develop.zhaoyu-io.pages.dev`
- Hash-based URLs: `{hash}.zhaoyu-io.pages.dev`
- Isolated from production
- Perfect for testing before merging to `main`

**Note:** Feature branches no longer trigger automatic deployments. Use pull requests to test changes, which will run CI checks. Deploy manually if needed.

### How Branch Detection Works

The workflow automatically determines the deployment type:

```yaml
- main branch → Production deployment
- All other branches → Preview/Dev deployment
```

## Custom Domain Configuration

### Production Domain

1. Go to Cloudflare Pages → Your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `zhaoyu.io`
4. Cloudflare will automatically configure DNS

**Result:**
- Production deployments accessible at `https://zhaoyu.io`
- Also available at `https://zhaoyu-io.pages.dev`

### Dev Domain (Optional)

If you want a dedicated dev domain (e.g., `dev.zhaoyu.io`):

1. Go to Cloudflare Pages → Your project → **Custom domains**
2. Add custom domain: `dev.zhaoyu.io`
3. Configure branch alias to point to `develop` branch (or your preferred dev branch)

**Note:** Dev domains are optional. Preview URLs work fine for testing.

## SPA Routing Configuration

The project includes a `_redirects` file in `frontend/static/` that ensures proper SPA routing:

```
/*    /index.html   200
```

This file is automatically copied to the build output and tells Cloudflare Pages to serve `index.html` for all routes, enabling client-side routing.

## Manual Deployment (Alternative)

If you prefer to deploy manually without CI/CD:

1. Build the project locally:
   ```bash
   cd frontend
   npm run build
   ```

2. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

3. Authenticate:
   ```bash
   wrangler login
   ```

4. Deploy:
   ```bash
   wrangler pages deploy frontend/build --project-name=zhaoyu-io
   ```

## Environment Variables

### Setting Environment Variables in Cloudflare Pages

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to **Settings** → **Environment variables**
4. Add variables:
   - **Variable name**: `PUBLIC_API_URL`
   - **Value**: Your API URL
   - **Environment**: Production (or Preview)

**Important**: Only variables prefixed with `PUBLIC_` are exposed to the client-side code.

### Using Environment Variables in Code

```typescript
// Access in your SvelteKit code
const apiUrl = import.meta.env.PUBLIC_API_URL;
```

## Troubleshooting

### Deployment Fails: "API Token Invalid"

- Verify `CLOUDFLARE_API_TOKEN` secret in GitHub
- Ensure token has Pages permissions
- Regenerate token if needed

### Deployment Fails: "Account ID Invalid"

- Verify `CLOUDFLARE_ACCOUNT_ID` secret in GitHub
- Double-check Account ID from Cloudflare dashboard

### Build Fails: "Node version mismatch"

- Ensure `.nvmrc` contains `24.13.0`
- Workflow uses Node 24.13.0 automatically

### SPA Routing Not Working

- Verify `_redirects` file exists in `frontend/static/`
- Check that file contains: `/*    /index.html   200`
- Ensure file is copied to build output (it should be automatic)

### Custom Domain Not Working

- Check DNS records in Cloudflare
- Verify CNAME record points to `zhaoyu-io.pages.dev`
- Wait for DNS propagation (can take up to 24 hours)

### Build Output Not Found

- Verify build completes successfully in GitHub Actions
- Check that `frontend/build/` directory exists after build
- Ensure workflow specifies correct directory: `frontend/build`

## Verification

After deployment, verify:

1. **Deployment Status**: Check Cloudflare Pages dashboard for successful deployment
2. **Site Access**: Visit your Cloudflare Pages URL: `https://zhaoyu-io.pages.dev`
3. **Custom Domain**: Visit `https://zhaoyu.io` (if configured)
4. **SPA Routing**: Navigate to different routes (e.g., `/about`, `/api-demo`) - should work without page reload
5. **Build Logs**: Review GitHub Actions logs for any warnings

## Monitoring

### View Deployment History

1. Cloudflare Pages dashboard → Your project → **Deployments** tab
2. See all deployments with status, commit hash, and timestamp

### View Build Logs

1. GitHub → **Actions** tab
2. Click on a workflow run
3. Expand build steps to see detailed logs

### Preview Deployments

**Automatic Preview Deployments:**
- Every push to non-`main` branches creates a preview deployment
- Each branch gets a unique preview URL
- Preview URLs are automatically generated based on branch name

**Accessing Preview Deployments:**
1. Cloudflare Pages dashboard → Your project → **Deployments** tab
2. Find your branch deployment
3. Click the preview URL to view the deployment

**Preview URL Format:**
- Branch alias: `{branch-name}.zhaoyu-io.pages.dev`
- Hash-based: `{commit-hash}.zhaoyu-io.pages.dev`

**Example:**
- Push to `develop` branch → `develop.zhaoyu-io.pages.dev`
- Push to `feature/new-feature` → `feature-new-feature.zhaoyu-io.pages.dev`

## Branch Deployment Strategy

### Production Branch (`main`)

- **Purpose**: Live production site
- **URL**: `https://zhaoyu.io` (custom domain)
- **When**: Merged, tested code ready for production
- **Deployment**: Automatic on push to `main`

### Development Branches

- **Purpose**: Testing and development
- **URLs**: Branch-specific preview URLs
- **When**: Feature development, testing, staging
- **Deployment**: Automatic on push to any non-`main` branch

**Workflow:**
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and push: `git push origin feature/new-feature`
3. Automatic preview deployment created
4. Test at preview URL
5. Merge to `main` when ready → Deploys to production

## Environment Variables by Environment

You can set different environment variables for production and preview:

1. Cloudflare Pages dashboard → Your project → **Settings** → **Environment variables**
2. Add variables for:
   - **Production**: Used for `main` branch deployments
   - **Preview**: Used for all other branch deployments

**Example:**
- Production: `PUBLIC_API_URL=https://api.zhaoyu.io`
- Preview: `PUBLIC_API_URL=https://api-dev.zhaoyu.io`

## Next Steps

- Set up environment variables for production and preview
- Configure custom domain for production (`zhaoyu.io`)
- Test preview deployments on `develop` branch
- Test all routes to ensure SPA routing works
- Set up monitoring and analytics
- Review [Architecture Guide](ARCHITECTURE.md) for project structure
- Check [Setup Guide](SETUP.md) for development setup
- Read [CI/CD Workflows Documentation](../../.github/workflows/README.md) for detailed workflow information

## Additional Resources

- [CI/CD Workflows Documentation](../../.github/workflows/README.md) - Comprehensive guide to CI/CD setup and optimizations
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SvelteKit Deployment Guide](https://kit.svelte.dev/docs/adapter-static)
- [Cloudflare Pages Action](https://github.com/cloudflare/pages-action)
