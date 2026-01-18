# Deployment Guide - Cloudflare Pages

This guide covers deploying the SvelteKit frontend to Cloudflare Pages using GitHub Actions CI/CD.

## Overview

This project is configured for automated deployment to Cloudflare Pages via GitHub Actions. Every push to the `main` branch triggers a build and deployment.

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

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project**
4. Select **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select your repository (`zhaoyu.io`)
7. Configure project settings:
   - **Project name**: `zhaoyu-io`
   - **Production branch**: `main`
   - **Build command**: Leave empty (handled by GitHub Actions)
   - **Build output directory**: Leave empty (handled by GitHub Actions)
   - **Root directory**: Leave empty (handled by GitHub Actions)
8. Click **Save and Deploy**

**Note**: The first deployment might fail because GitHub Actions hasn't run yet. This is normal. Once you push the workflow file, it will deploy automatically.

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

The GitHub Actions workflow (`.github/workflows/cloudflare-pages.yml`) automatically:

1. **Triggers** on push to `main` branch
2. **Checks out** your code
3. **Sets up** Node.js 24.13.0
4. **Installs** dependencies with `npm ci`
5. **Builds** the project with `npm run build`
6. **Deploys** to Cloudflare Pages using the `cloudflare/pages-action`

### Workflow Details

```yaml
- Builds from: frontend-svelte/ directory
- Build output: frontend-svelte/build/
- Node version: 24.13.0 (from .nvmrc)
- Deployment: Automatic via cloudflare/pages-action
```

## SPA Routing Configuration

The project includes a `_redirects` file in `frontend-svelte/static/` that ensures proper SPA routing:

```
/*    /index.html   200
```

This file is automatically copied to the build output and tells Cloudflare Pages to serve `index.html` for all routes, enabling client-side routing.

## Manual Deployment (Alternative)

If you prefer to deploy manually without CI/CD:

1. Build the project locally:
   ```bash
   cd frontend-svelte
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
   wrangler pages deploy frontend-svelte/build --project-name=zhaoyu-io
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

- Verify `_redirects` file exists in `frontend-svelte/static/`
- Check that file contains: `/*    /index.html   200`
- Ensure file is copied to build output (it should be automatic)

### Custom Domain Not Working

- Check DNS records in Cloudflare
- Verify CNAME record points to `zhaoyu-io.pages.dev`
- Wait for DNS propagation (can take up to 24 hours)

### Build Output Not Found

- Verify build completes successfully in GitHub Actions
- Check that `frontend-svelte/build/` directory exists after build
- Ensure workflow specifies correct directory: `frontend-svelte/build`

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

Cloudflare Pages creates preview deployments for pull requests automatically if configured. Check the **Deployments** tab for preview URLs.

## Next Steps

- Set up environment variables for production
- Configure custom domain if not already done
- Test all routes to ensure SPA routing works
- Set up monitoring and analytics
- Review [Architecture Guide](ARCHITECTURE.md) for project structure
- Check [Setup Guide](SETUP.md) for development setup

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SvelteKit Deployment Guide](https://kit.svelte.dev/docs/adapter-static)
- [Cloudflare Pages Action](https://github.com/cloudflare/pages-action)
