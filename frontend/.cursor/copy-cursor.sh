#!/bin/bash
# Copy current .cursor folder to another zhaoyu.io clone

CURRENT_DIR="$(pwd)"
CURRENT_CURSOR="$CURRENT_DIR/.cursor"

if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-other-zhaoyu-clone>"
    echo ""
    echo "Example:"
    echo "  $0 ~/Projects/zhaoyu.io-backup"
    exit 1
fi

OTHER_CLONE="$1"
OTHER_CURSOR="$OTHER_CLONE/.cursor"

if [ ! -d "$OTHER_CLONE" ]; then
    echo "❌ Error: Other clone path does not exist: $OTHER_CLONE"
    exit 1
fi

if [ ! -d "$CURRENT_CURSOR" ]; then
    echo "❌ Error: .cursor folder not found in current directory"
    exit 1
fi

echo "📋 Copying .cursor folder..."
echo "From: $CURRENT_CURSOR"
echo "To:   $OTHER_CURSOR"
echo ""

# Backup existing .cursor in other clone if it exists
if [ -d "$OTHER_CURSOR" ]; then
    BACKUP_DIR="$OTHER_CLONE/.cursor-backup-$(date +%Y%m%d-%H%M%S)"
    echo "📦 Backing up existing .cursor..."
    cp -r "$OTHER_CURSOR" "$BACKUP_DIR"o "✅ Backup: $BACKUP_DIR"
    echo ""
fi

# Copy the .cursor folder (excluding cache/temp files)
rsync -av --exclude='.dccache' --exclude='*.cache' --exclude='*.tmp' --exclude='temp' \
    "$CURRENT_CURSOR/" "$OTHER_CURSOR/"

echo ""
echo "✅ Copy complete!"
if [ -d "$BACKUP_DIR" ]; then
    echo "Previous version backed up to: $BACKUP_DIR"
fi
