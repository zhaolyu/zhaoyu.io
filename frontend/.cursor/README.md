# Cursor Configuration - Local Only

This `.cursor` folder contains Cursor AI documentation, rules, and configuration that is **kept locally** and not committed to git.

## Backup & Restore

### Backup Script
To backup your `.cursor` folder to a local location:

```bash
./.cursor/backup-cursor.sh
```

This saves to: `~/.zhaoyu-cursor-backup/zhaoyu.io/.cursor`

### Restore Script
After cloning the repo, restore your `.cursor` folder:

```bash
./.cursor/restore-cursor.sh
```

## What's Included

- **`docs/`** - Comprehensive documentation (patterns, utilities, testing, etc.)
- **`rules/`** - Cursor coding rules and patterns
- **`commands/`** - Custom Cursor commands
- **`.gitignore`** - Local ignore rules for cache/temp files

## Why Local Only?

- Keeps repository clean
- Allows personal customization
- Prevents merge conflicts
- Easy to backup/restore when needed

## Manual Backup

You can also manually backup/restore:

```bash
# Backup
cp -r .cursor ~/backups/zhaoyu-cursor/

# Restore
cp -r ~/backups/zhaoyu-cursor/.cursor .
```

## Running the Scripts

The backup and restore scripts are located in the `.cursor` folder:

```bash
# From project root
./.cursor/backup-cursor.sh
./.cursor/restore-cursor.sh
```
