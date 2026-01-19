# GitHub Authentication Setup Guide

This guide documents how to set up multiple GitHub Personal Access Tokens (PATs) for different accounts (e.g., personal and work) on macOS using git credential helper and macOS Keychain.

## Overview

When working with multiple GitHub accounts (e.g., personal and work), you need to:
1. Create separate Personal Access Tokens for each account
2. Store them securely in macOS Keychain
3. Configure git to use the correct token based on the repository

## Prerequisites

- macOS (for Keychain integration)
- Git installed
- GitHub accounts with Personal Access Tokens created

## Step 1: Configure Git Credential Helper

Configure git to use macOS Keychain for credential storage:

```bash
git config --global credential.helper osxkeychain
```

This stores credentials securely in your macOS Keychain and makes them available for all git operations.

## Step 2: Store Personal Access Tokens

### For Work Account

Store your work token with your work username:

```bash
echo "protocol=https
host=github.com
username=zhao-yu
password=YOUR_WORK_TOKEN" | git credential approve
```

**Note:** For GitHub PATs, you can also use `x-access-token` as the username instead of your actual username.

### For Personal Account

Store your personal token with your personal username:

```bash
echo "protocol=https
host=github.com
username=zhaolyu
password=YOUR_PERSONAL_TOKEN" | git credential approve
```

### Verify Stored Credentials

Check what credentials are stored:

```bash
echo "protocol=https
host=github.com" | git credential fill
```

To check a specific username:

```bash
echo "protocol=https
host=github.com
username=zhaolyu" | git credential fill
```

## Step 3: Handle SAML SSO Authorization

If your organization (e.g., CNBC) requires SAML SSO, you'll need to authorize your token:

1. When you first try to access a protected repository, git will return an error with an authorization URL
2. Visit the provided URL in your browser
3. Sign in with your work GitHub account
4. Authorize the token for the organization
5. After authorization, git operations will work automatically

**Example error message:**
```
remote: The 'cnbc' organization has enabled or enforced SAML SSO.
remote: To access this repository, visit https://github.com/enterprises/...
```

## Step 4: Configure Repository Remote URLs

### For Work Repositories

Work repositories typically use standard HTTPS URLs:

```bash
git remote set-url origin https://github.com/cnbc/WEB.Phoenix.git
```

Git will automatically use the work token stored in Keychain.

### For Personal Repositories

Personal repositories should include your username in the URL to ensure git uses the correct token:

```bash
git remote set-url origin https://zhaolyu@github.com/zhaolyu/repo-name.git
```

This explicitly tells git to use the credential associated with `zhaolyu` username.

## How Git Selects Credentials

Git credential helper selects credentials based on:
1. **Explicit username in URL**: If the remote URL includes a username (e.g., `https://zhaolyu@github.com/...`), git will use the credential stored for that username
2. **Host matching**: For URLs without a username, git will try stored credentials for that host
3. **First match**: If multiple credentials exist, git may use the first one that works

## Troubleshooting

### "Repository not found" Error

**Possible causes:**
1. Token doesn't have access to the repository
2. Token needs SAML SSO authorization
3. Wrong token is being used

**Solutions:**
- Verify token has access: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/OWNER/REPO`
- Check if SAML SSO authorization is needed
- Ensure remote URL includes the correct username for personal repos

### Wrong Token Being Used

If git is using the wrong token:

1. Check what credential is being returned:
   ```bash
   echo "protocol=https
   host=github.com" | git credential fill
   ```

2. Remove incorrect credential:
   ```bash
   printf "protocol=https\nhost=github.com\nusername=WRONG_USERNAME\n" | git credential reject
   ```

3. Store correct credential:
   ```bash
   echo "protocol=https
   host=github.com
   username=CORRECT_USERNAME
   password=CORRECT_TOKEN" | git credential approve
   ```

### Token Not Working After SAML SSO

If you get 403 errors after SAML SSO authorization:
- The authorization URL is one-time use
- Re-run the git command to get a new authorization URL if needed
- Ensure you're signed into the correct GitHub account when authorizing

## Managing Multiple Credentials

### View All Stored Credentials

Check macOS Keychain for stored credentials:

```bash
security find-internet-password -s github.com
```

### Remove a Specific Credential

Remove a credential by username:

```bash
printf "protocol=https\nhost=github.com\nusername=USERNAME\n" | git credential reject
```

### Update a Credential

To update an existing credential:
1. Reject the old one
2. Approve the new one with the same username

## Best Practices

1. **Use separate tokens** for personal and work accounts
2. **Include username in remote URLs** for personal repositories to avoid confusion
3. **Authorize tokens for SAML SSO** immediately when prompted
4. **Verify token access** using GitHub API if you encounter issues
5. **Store tokens securely** - never commit tokens to repositories

## Creating Personal Access Tokens

If you need to create new tokens:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with appropriate scopes:
   - For repositories: `repo` scope
   - For organizations with SAML: Ensure token is authorized for the organization
3. Copy the token immediately (it won't be shown again)
4. Store it using the credential helper as shown above

## Example Workflow

### Setting up a new work repository:

```bash
# Clone repository
git clone https://github.com/cnbc/repo-name.git
cd repo-name

# If SAML SSO is required, authorize when prompted
git pull  # Will prompt for SAML SSO authorization if needed

# Token is now stored and will work automatically
```

### Setting up a new personal repository:

```bash
# Clone with username in URL
git clone https://zhaolyu@github.com/zhaolyu/repo-name.git
cd repo-name

# Or update existing remote
git remote set-url origin https://zhaolyu@github.com/zhaolyu/repo-name.git

# Pull should work automatically
git pull
```

## Security Notes

- Tokens stored in macOS Keychain are encrypted and secure
- Never share your tokens or commit them to repositories
- Rotate tokens periodically for security
- Use fine-grained tokens when possible (GitHub's newer token system)
- Revoke tokens immediately if compromised

## Additional Resources

- [Git Credential Storage](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub SAML SSO](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on)
