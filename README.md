# zhaoyu.io

Personal website repository built with SvelteKit, deployed to Cloudflare Pages.

## Git Configuration

### Using Personal Access Token (PAT) for Authentication

This repository is configured to use a Personal Access Token (PAT) from your personal GitHub account for push/pull operations.

#### Option 1: Store PAT in Credential Helper (Recommended)

This method stores your PAT securely in macOS Keychain, keeping the remote URL clean.

**Steps:**
1. Generate a Personal Access Token from your personal GitHub account (`zhaolyu`):
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name (e.g., "zhaoyu.io repo")
   - Select the `repo` scope
   - Generate and copy the token

2. Configure credential helper and store your PAT:
   ```bash
   # Set credential helper to use macOS Keychain
   git config --local credential.helper osxkeychain
   
   # Store your personal account credentials
   git credential-osxkeychain store <<EOF
   protocol=https
   host=github.com
   username=zhaolyu
   password=YOUR_PERSONAL_PAT
   EOF
   ```

3. Ensure remote URL is clean (no token embedded):
   ```bash
   git remote set-url origin https://github.com/zhaolyu/zhaoyu.io.git
   ```

4. Verify it works:
   ```bash
   git ls-remote origin
   ```

**Note:** If you previously had work account credentials cached, clear them first:
   ```bash
   git credential-osxkeychain erase <<EOF
   protocol=https
   host=github.com
   EOF
   ```

**Benefits:**
- PAT stored securely in macOS Keychain
- Clean remote URL (no credentials visible)
- Automatic authentication for push/pull operations
- More secure than embedding token in URL

#### Option 2: Use PAT Directly in Remote URL

To configure the remote URL with your personal GitHub PAT:

```bash
git remote set-url origin https://zhaolyu:YOUR_PERSONAL_PAT@github.com/zhaolyu/zhaoyu.io.git
```

**Steps:**
1. Generate a Personal Access Token from your personal GitHub account (`zhaolyu`):
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name (e.g., "zhaoyu.io repo")
   - Select the `repo` scope
   - Generate and copy the token

2. Replace `YOUR_PERSONAL_PAT` in the command above with your actual token

3. Verify the remote is configured:
   ```bash
   git remote -v
   ```

**Note:** This method embeds the PAT in the remote URL. For better security, use Option 1 (credential storage) instead, which stores the PAT securely in macOS Keychain.

## Documentation

Project documentation is available in the [`docs/`](docs/) directory:

- [GitHub Authentication](docs/GITHUB_AUTHENTICATION.md) - Multi-account setup, SAML SSO, troubleshooting
- [Deployment Recommendation](docs/DEPLOYMENT_RECOMMENDATION.md) - Cloudflare Pages deployment guide
- [Project Summary](docs/PROJECT_SUMMARY.md) - Project overview and status
- [MCP Browser Diagnostic](docs/MCP_BROWSER_DIAGNOSTIC.md) - Cursor IDE browser integration troubleshooting

For frontend-specific documentation, see [`frontend/docs/`](frontend/docs/).
