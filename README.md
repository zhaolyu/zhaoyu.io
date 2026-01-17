# zhaoyu.io
My Personal Website Repo

## Git Configuration

### Using Personal Access Token (PAT) for Authentication

This repository is configured to use a Personal Access Token (PAT) from your personal GitHub account for push/pull operations.

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

**Note:** This method embeds the PAT in the remote URL. For better security, consider using credential storage (Option 1) instead.
