# GitHub Actions Release Pipeline Setup

## Overview
This pipeline automatically:
1. Detects when `package.json` version changes on main branch
2. Builds the package
3. Publishes to npm
4. Creates a git tag and GitHub release

No deployment happens if the version hasn't changed.

## Prerequisites

### 1. Set up NPM_TOKEN secret
You need an npm access token to publish to the registry:

1. Go to npm: https://www.npmjs.com/settings/[your-username]/tokens
2. Create a new token with "Automation" or "Publish" permissions
3. In your GitHub repository:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Create a new secret named `NPM_TOKEN`
   - Paste your npm token value

### 2. Configure npm package access
Ensure your `package.json` has:
- `"name": "flagmint-js-sdk"` (or your org/package name)
- `"private": false` (if using a private npm registry scope, adjust accordingly)

## How it Works

**Trigger:** Push to `main` branch that modifies:
- `package.json`
- SDK source files (`sdk/**`)
- Build files (`index.ts`, `vite.config.ts`, `tsconfig.json`)

**Process:**
1. Extract version from `package.json`
2. Check if git tag `v{version}` exists
   - If YES → Skip (already deployed)
   - If NO → Continue
3. Install dependencies
4. Build package (`npm run build`)
5. Publish to npm (`npm publish`)
6. Create git tag `v{version}`
7. Create GitHub Release

## Manual Trigger (if needed)

To manually trigger a release, you can:
1. Update `package.json` version
2. Commit and push to main
3. The workflow will automatically run

Or use GitHub CLI:
```bash
gh workflow run release.yml -r main
```

## Workflow File Location

The workflow is defined at `.github/workflows/release.yml`

## Troubleshooting

### npm publish fails with 403/401
- Check NPM_TOKEN is correctly set in GitHub Secrets
- Verify token has "publish" permissions
- Ensure package name is correct in `package.json`

### Tag already exists
- Remove the tag locally and remote: `git tag -d v1.2.3 && git push origin :refs/tags/v1.2.3`
- Or just update the version in `package.json` to skip re-creating the same tag

### Workflow not triggering
- Verify the push includes changes to `package.json` or source files
- Check branch is `main` (not `master`)
- Verify workflow file syntax (`.github/workflows/release.yml`)

## Example Usage

To release a new version:

1. Update version in `package.json`:
   ```json
   {
     "version": "1.2.22"
   }
   ```

2. Commit and push to main:
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.2.22"
   git push origin main
   ```

3. GitHub Actions will:
   - Build the package
   - Publish to npm
   - Create tag `v1.2.22`
   - Create GitHub Release
