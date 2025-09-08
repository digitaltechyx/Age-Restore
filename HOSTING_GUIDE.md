# 🚀 Hosting Guide for AgeRestore Project

## 📋 **Pre-Deployment Checklist**

### ✅ **Project Status**
- [x] Code committed to git
- [x] All features working locally
- [x] Environment variables configured
- [x] Firebase project set up
- [x] No build errors

## 🎯 **Recommended Hosting Options**

### **Option 1: Vercel (Recommended - FREE)**
**Best for: Easy deployment, automatic builds, free hosting**

#### **Steps:**
1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/age-restore.git
   git push -u origin master
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import your repository
   - Add environment variables
   - Deploy automatically

3. **Connect Namecheap Domain:**
   - In Vercel dashboard, go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records in Namecheap

#### **Environment Variables for Vercel:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

### **Option 2: Netlify (Alternative - FREE)**
**Best for: Static sites, easy deployment**

#### **Steps:**
1. **Build the project:**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder
   - Configure environment variables

---

### **Option 3: Namecheap VPS (Advanced)**
**Best for: Full control, custom server setup**

#### **Requirements:**
- Namecheap VPS hosting plan
- Ubuntu/CentOS server
- Node.js installed
- PM2 for process management
- Nginx for reverse proxy

#### **Steps:**
1. **Set up server:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2

   # Install Nginx
   sudo apt update
   sudo apt install nginx
   ```

2. **Deploy application:**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/age-restore.git
   cd age-restore

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "age-restore" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔧 **Pre-Deployment Setup**

### **1. Update Firebase Configuration**
Make sure your Firebase project allows your production domain:

1. **Go to Firebase Console**
2. **Authentication → Settings → Authorized domains**
3. **Add your production domain**

### **2. Update Storage Rules**
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **3. Update Firestore Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🌐 **Domain Configuration**

### **Namecheap DNS Settings:**
```
Type: A Record
Host: @
Value: [Your hosting IP or CNAME]
TTL: Automatic

Type: CNAME
Host: www
Value: your-domain.com
TTL: Automatic
```

### **For Vercel:**
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

---

## 📱 **Mobile Testing**

After deployment, test on mobile:
1. **Visit your domain** on mobile browser
2. **Test all features:**
   - User registration/login
   - Photo upload
   - Camera functionality
   - Admin dashboard
   - Mobile navigation

---

## 🔒 **Security Checklist**

- [ ] Environment variables secured
- [ ] Firebase rules updated
- [ ] HTTPS enabled
- [ ] Domain verified in Firebase
- [ ] Admin email configured
- [ ] Error handling in place

---

## 📞 **Support**

If you encounter issues:
1. **Check Vercel/Netlify logs**
2. **Verify environment variables**
3. **Test Firebase connection**
4. **Check domain DNS propagation**

---

## 🎉 **Success!**

Once deployed, your AgeRestore app will be live at:
- **Production URL:** https://your-domain.com
- **Admin Dashboard:** https://your-domain.com/admin
- **User Dashboard:** https://your-domain.com/dashboard

**Next Steps:**
1. Test all functionality
2. Set up monitoring
3. Configure backups
4. Plan for scaling
