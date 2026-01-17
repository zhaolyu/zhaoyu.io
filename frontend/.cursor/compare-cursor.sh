#!/bin/bash
# Compare and consolidate .cursor folders from two zhaoyu.io clones

CURRENT_DIR="$(pwd)"
CURRENT_CURSOR="$CURRENT_DIR/.cursor"

if [ -z "$1" ]; then
    echo "Usage: $0 <path-to-other-zhaoyu-clone>"
    echo "Example: $0 ~/Projects/zhaoyu.io-backup"
    exit 1
fi

OTHER_CLONE="$1"
OTHER_CURSOR="$OTHER_CLONE/.cursor"

if [ ! -d "$OTHER_CLONE" ] || [ ! -d "$OTHER_CURSOR" ] || [ ! -d "$CURRENT_CURSOR" ]; then
    echo "❌ Error: Invalid paths"
    exit 1
fi

echo "🔍 Comparing .cursor folders..."
echo "Current:  $CURRENT_CURSOR"
echo "Other:    $OTHER_CURSOR"
echo ""

REPORT_FILE="$CURRENT_DIR/.cursor-comparison-report.txt"
echo "=== Cursor Configuration Comparison ===" > "$REPORT_FILE"
echo "Generated: $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "📊 Files only in CURRENT:" | tee -a "$REPORT_FILE"
comm -23 <(find "$CURRENT_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.sh" \) | sed "s|$CURRENT_CURSOR/||" | sort) \
         <(find "$OTHER_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.sh" \) | sed "s|$OTHER_CURSOR/||" | sort) | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

echo "📊 Files only in OTHER:" | tee -a "$REPORT_FILE"
comm -13 <(find "$CURRENT_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.sh" \) | sed "s|$CURRENT_CURSOR/||" | sort) \
         <(find "$OTHER_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" -o -name "*.sh" \) | sed "s|$OTHER_CURSOR/||" | sort) | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

echo "⚠️  Files that differ:" | tee -a "$REPORT_FILE"
DIFF_COUNT=0
for file in $(comm -12 <(find "$CURRENT_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" \) | sed "s|$CURRENT_CURSOR/||" | sort) \
                        <(find "$OTHER_CURSOR" -type f \( -name "*.md" -o -name "*.mdc" \) | sed "s|$OTHER_CURSOR/||" | sort)); do
    if ! diff -q "$CURRENT_CURSOR/$file" "$OTHER_CURSOR/$file" > /dev/null 2>&1; then
        DIFF_COUNT=$((DIFF_COUNT + 1))
        echo "   $file" | tee -a "$REPORT_FILE"
    fi
done

echo "" | tee -a "$REPORT_FILE"
echo "📄 Full report: $REPORT_FILE"