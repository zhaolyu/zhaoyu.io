#!/bin/bash
# Restore .cursor folder from backup

BACKUP_DIR="$HOME/.zhaoyu-cursor-backup"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")

if [ -d "$BACKUP_DIR/$REPO_NAME/.cursor" ]; then
    echo "Restoring .cursor folder..."
    cp -r "$BACKUP_DIR/$REPO_NAME/.cursor" .
    echo "✅ Restore complete"
else
    echo "❌ No backup found at $BACKUP_DIR/$REPO_NAME/.cursor"
    echo "Run ./.cursor/backup-cursor.sh first"
fi
