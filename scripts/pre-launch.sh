#!/bin/bash

echo "🚀 Pre-Launch Checklist"
echo "======================="
echo ""

# 1. Run tests
echo "1. Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed!"
  exit 1
fi

# 2. Run security checks
echo ""
echo "2. Running security checks..."
node scripts/security-test.js
if [ $? -ne 0 ]; then
  echo "❌ Security checks failed!"
  exit 1
fi

# 3. Check for TODO/FIXME comments
echo ""
echo "3. Checking for TODO/FIXME..."
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
  echo "⚠️  Found $TODO_COUNT TODO/FIXME comments"
  echo "   Consider resolving these before launch"
fi

# 4. Build the project
echo ""
echo "4. Building project..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

# 5. Check build size
echo ""
echo "5. Checking build size..."
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "   Build size: $BUILD_SIZE"

# 6. Run Lighthouse (if lighthouse-ci installed)
echo ""
echo "6. Running Lighthouse audit..."
if command -v lhci &> /dev/null; then
  lhci autorun
else
  echo "   ⚠️  lighthouse-ci not installed, skipping..."
fi

echo ""
echo "✅ Pre-launch checks complete!"
echo ""
echo "Next steps:"
echo "1. Review LAUNCH-CHECKLIST.md"
echo "2. Deploy to production"
echo "3. Monitor for 24 hours"
echo "4. Celebrate! 🎉"
