#!/bin/bash

# 🚀 AgeRestore Deployment Script
# This script helps prepare your project for hosting

echo "🚀 Starting AgeRestore deployment preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for environment variables
echo "🔍 Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Please create it with your Firebase credentials."
    echo "📝 Copy env.example to .env.local and fill in your values:"
    echo "   cp env.example .env.local"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Check build output
if [ -d ".next" ]; then
    echo "✅ Build output created successfully"
    echo "📁 Build size:"
    du -sh .next
else
    echo "❌ Build output not found"
    exit 1
fi

# Create production environment file
echo "📝 Creating production environment template..."
cat > .env.production << EOF
# Production Environment Variables
# Copy these to your hosting platform

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_BASE_URL=https://your-domain.com
EOF

echo "✅ Production environment template created: .env.production"

# Create deployment summary
echo "📊 Creating deployment summary..."
cat > DEPLOYMENT_SUMMARY.md << EOF
# 🚀 Deployment Summary

## Project: AgeRestore - 30-Day Photo Journey App

### Build Information
- **Build Date:** $(date)
- **Node Version:** $(node --version)
- **NPM Version:** $(npm --version)
- **Build Status:** ✅ Successful

### Next Steps
1. **Choose hosting platform:**
   - Vercel (Recommended - Free)
   - Netlify (Alternative - Free)
   - Namecheap VPS (Advanced)

2. **Set up environment variables:**
   - Copy values from .env.local
   - Add to hosting platform settings

3. **Configure domain:**
   - Point Namecheap domain to hosting platform
   - Update Firebase authorized domains

4. **Test deployment:**
   - Visit your domain
   - Test all features
   - Check mobile responsiveness

### Files Ready for Deployment
- ✅ .next/ (Build output)
- ✅ public/ (Static assets)
- ✅ package.json (Dependencies)
- ✅ .env.production (Environment template)

### Security Checklist
- [ ] Environment variables secured
- [ ] Firebase rules updated
- [ ] Domain verified in Firebase
- [ ] HTTPS enabled
- [ ] Admin email configured

### Support
- Check HOSTING_GUIDE.md for detailed instructions
- Verify all environment variables are set
- Test Firebase connection in production
EOF

echo "✅ Deployment summary created: DEPLOYMENT_SUMMARY.md"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Choose your hosting platform (Vercel recommended)"
echo "2. Push code to GitHub: git push origin master"
echo "3. Connect repository to hosting platform"
echo "4. Add environment variables from .env.local"
echo "5. Configure your Namecheap domain"
echo ""
echo "📖 See HOSTING_GUIDE.md for detailed instructions"
echo "📊 See DEPLOYMENT_SUMMARY.md for build information"
