#!/bin/bash
# Interactively merge .cursor folders from two zhaoyu.io clones

CURRENT_DIR="$(pwd)"
CURRENT_CURSOR="$CURRENT_DIR/.cursor"

if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-other-phoenix-clone>"
    exit 1
fi

OTHER_CLONE="$1"
OTHER_CURSOR="$OTHER_CLONE/.cursor"

if [ ! -d "$OTHER_CLONE" ] || [ ! -d "$OTHER_CURSOR" ] || [ ! -d "$CURRENT_CURSOR" ]; then
    echo "❌ Error: Invalid paths"
    exit 1
fi

echo "🔄 Interactive Merger"
echo "Current:  $CURRENT_CURSOR"
echo "Other:    $OTHER_CURSOR"
echo ""

# Backup
BACKUP_DIR="$CURRENT_DIR/.cursor-merge-backup-$(date +%Y%m%d-%H%M%S)"
cp -r "$CURRENT_CURSOR" "$BACKUP_DIR"
echo "✅ Backup: $BACKUP_DIR"
echo ""

# Copy files only in OTHER
FILES_ONLY_IN_OTHER=$(comm -13 <(find "$CURRENT_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.sh" \) | sed "s|$CURRENT_CURSOR/||" | sort) \
                                 <(find "$OTHER_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.sh" \) | sed "s|$OTHER_CURSOR/||" | sort))

if [ -n "$FILES_ONLY_IN_OTHER" ]; then
    echo "📥 Files only in OTHER (will copy):"
    echo "$FILES_ONLY_IN_OTHER"
    read -p "Copy? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$FILES_ONLY_IN_OTHER" | while read -r file; do
            mkdir -p "$(dirname "$CURRENT_CURSOR/$file")"
            cp "$OTHER_CURSOR/$file" "$CURRENT_CURSOR/$file"
            echo "   ✅ $file"
        done
    fi
fi

echo ""

# Handle differing files
for file in $(comm -12 <(find "$CURRENT_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" \) | sed "s|$CURRENT_CURSOR/||" | sort) \
                        <(find "$OTHER_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" \) | sed "s|$OTHER_CURSOR/||" | sort)); do
    if ! diff -q "$CURRENT_CURSOR/$file" "$OTHER_CURSOR/$file" > /dev/null 2>&1; then
        echo "📄 $file"
        echo "   1) Keep current  2) Use other  3) Show diff  4) Skip"
        read -p "   Choice: " -n 1 -r choice
        echo
        case $choice in
            2) cp "$OTHER_CURSOR/$file" "$CURRENT_CURSOR/$file"; echo "   ✅ Updated";;
            3) diff -u "$CURRENT_CURSOR/$file" "$OTHER_CURSOR/$file" | less
               read -p "   Use other? (y/n): " -n 1 -r
               echo
               [[ $REPLY =~ ^[Yy]$ ]] && cp "$OTHER_CURSOR/$file" "$CURRENT_CURSOR/$file" && echo "   ✅ Updated";;
        esac
    fi
done

echo "✅ Merge complete!"