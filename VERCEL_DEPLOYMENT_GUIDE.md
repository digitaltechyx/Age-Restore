# 🚀 Vercel Deployment Guide for AgeRestore

## ✅ **Step 1: GitHub Upload Complete**
Your project is now live on GitHub: [https://github.com/ZainSheikh0308/Age_Restore.git](https://github.com/ZainSheikh0308/Age_Restore.git)

## 🎯 **Step 2: Deploy to Vercel**

### **2.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### **2.2 Import Your Project**
1. In Vercel dashboard, click **"New Project"**
2. Find **"Age_Restore"** in your repositories
3. Click **"Import"** next to your repository
4. Vercel will automatically detect it's a Next.js project

### **2.3 Configure Environment Variables**
In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_BASE_URL=https://age-restore.vercel.app
```

**To get these values:**
1. Copy from your `.env.local` file
2. Or get them from Firebase Console → Project Settings → General

### **2.4 Deploy**
1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://age-restore-xxx.vercel.app`

## 🌐 **Step 3: Connect Namecheap Domain**

### **3.1 Add Custom Domain in Vercel**
1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your Namecheap domain (e.g., `yourdomain.com`)
4. Vercel will provide DNS records to configure

### **3.2 Configure Namecheap DNS**
In your Namecheap domain management:

**Add these DNS records:**
```
Type: CNAME
Host: @
Value: cname.vercel-dns.com
TTL: Automatic

Type: CNAME  
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### **3.3 Verify Domain**
1. Wait 5-10 minutes for DNS propagation
2. Vercel will automatically issue SSL certificate
3. Your site will be live at your custom domain

## 🔧 **Step 4: Update Firebase Configuration**

### **4.1 Add Production Domain to Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `age-restore.vercel.app`
5. Add your custom domain: `yourdomain.com`

### **4.2 Update Storage Rules (if needed)**
Your current rules should work, but verify in Firebase Console → Storage → Rules

## 📱 **Step 5: Test Your Live Application**

### **Test Checklist:**
- [ ] **Homepage loads** correctly
- [ ] **User registration** works
- [ ] **User login** works (email + Google)
- [ ] **Admin login** redirects to admin dashboard
- [ ] **Photo upload** with emoji picker works
- [ ] **Image compression** works
- [ ] **Mobile responsiveness** works
- [ ] **Admin dashboard** functions properly

## 🎉 **Success!**

Your AgeRestore application is now live at:
- **Vercel URL**: `https://age-restore-xxx.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (after DNS setup)

## 🔄 **Future Updates**

To update your live application:
1. Make changes to your local code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Vercel will automatically redeploy

## 🆘 **Troubleshooting**

### **Common Issues:**

**1. Environment Variables Not Working**
- Check all variables are added in Vercel dashboard
- Ensure no extra spaces or quotes
- Redeploy after adding variables

**2. Firebase Authentication Errors**
- Verify domain is added to Firebase authorized domains
- Check Firebase project ID matches

**3. Build Failures**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify TypeScript configuration

**4. Domain Not Working**
- Wait for DNS propagation (up to 24 hours)
- Check DNS records are correct
- Verify domain is added in Vercel

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify Firebase configuration
3. Test locally first
4. Check this guide for solutions

---

**Your AgeRestore app is ready for the world! 🌍**
