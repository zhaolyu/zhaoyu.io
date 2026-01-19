#!/bin/bash
# Check if localhost dev server is accessible for browser testing
# Usage: ./check-browser-access.sh [port]

PORT=${1:-5173}
URL="http://localhost:${PORT}"

echo "🔍 Checking browser access to ${URL}..."
echo ""

# Check if server is running
if lsof -ti:${PORT} > /dev/null 2>&1; then
  echo "✅ Dev server is running on port ${PORT}"
  
  # Try to fetch HTML
  if curl -s "${URL}" > /dev/null 2>&1; then
    echo "✅ Can access ${URL}"
    echo "✅ HTML is being served"
    echo ""
    echo "📋 Agent can use:"
    echo "   - MCP browser tools: Navigate to ${URL} for visual inspection"
    echo "   - Terminal: curl ${URL} to inspect HTML structure"
    echo ""
    
    # Quick component check
    echo "🔎 Quick component check:"
    COMPONENTS=$(curl -s "${URL}" | grep -o "experience-ticker\|work-section\|project-card" | sort -u)
    if [ -n "$COMPONENTS" ]; then
      echo "   Found components: $(echo $COMPONENTS | tr '\n' ' ')"
    else
      echo "   No known components found in HTML"
    fi
  else
    echo "❌ Cannot access ${URL}"
    echo "   Check firewall or server configuration"
  fi
else
  echo "❌ Dev server is NOT running on port ${PORT}"
  echo ""
  echo "📝 To start the server:"
  echo "   cd frontend && npm run dev"
  echo ""
  echo "   Or check if it's running on a different port:"
  echo "   lsof -i :3000  # Check port 3000"
  echo "   lsof -i :5174  # Check port 5174"
fi
