#!/bin/bash
# Backup .cursor folder to a local backup location

BACKUP_DIR="$HOME/.zhaoyu-cursor-backup"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")

echo "Backing up .cursor folder..."
mkdir -p "$BACKUP_DIR/$REPO_NAME"
cp -r .cursor "$BACKUP_DIR/$REPO_NAME/"
echo "✅ Backup complete: $BACKUP_DIR/$REPO_NAME/.cursor"
