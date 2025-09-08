# 🔥 Firebase Setup Guide for PictureThis

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit [https://console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with your Google account
3. Click **"Add project"**

### 1.2 Create Project
1. **Project name**: Enter `picturethis-app` (or any name you prefer)
2. **Google Analytics**: You can enable or disable (optional)
3. Click **"Create project"**
4. Wait for project creation to complete
5. Click **"Continue"**

## Step 2: Enable Required Services

### 2.1 Enable Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first option (Email/Password)
6. Click **"Save"**

### 2.2 Enable Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. **Security rules**: Choose **"Start in production mode"** (we'll update rules later)
4. **Location**: Choose location closest to your users (e.g., us-central1)
5. Click **"Done"**

### 2.3 Enable Storage
1. In the left sidebar, click **"Storage"**
2. Click **"Get started"**
3. **Security rules**: Choose **"Start in production mode"** (we'll update rules later)
4. **Location**: Use the same location as Firestore
5. Click **"Done"**

## Step 3: Get Firebase Configuration

### 3.1 Add Web App
1. In the project overview, click the **Web icon** `</>`
2. **App nickname**: Enter `PictureThis Web`
3. **Firebase Hosting**: Check this box (optional but recommended)
4. Click **"Register app"**

### 3.2 Copy Configuration
You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

**COPY THIS ENTIRE CONFIGURATION** - you'll need it in the next step!

## Step 4: Configure Your Local Project

### 4.1 Create Environment File
1. In your project folder, copy the example file:
```bash
cp env.example .env.local
```

### 4.2 Add Firebase Configuration
Open `.env.local` and replace the placeholder values with your Firebase config:

```bash
# Replace these with YOUR Firebase configuration values:
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Admin Configuration
ADMIN_EMAIL=admin@picturethis.com

# Google AI (optional - can leave empty for now)
GOOGLE_GENAI_API_KEY=
```

## Step 5: Update Security Rules

### 5.1 Update Firestore Rules
1. Go to **Firestore Database** → **Rules**
2. **Replace** the default rules with this content:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection rules
    match /users/{userId} {
      // Users can read and write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read and update user status
      allow read, update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email == 'admin@picturethis.com';
      
      // Anyone authenticated can create a user profile (for registration)
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Images collection rules
    match /images/{imageId} {
      // Users can read and create their own images
      allow read, create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      // Users can only create images if they own them
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      
      // Admins can read all images
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email == 'admin@picturethis.com';
    }
  }
}
```

3. Click **"Publish"**

### 5.2 Update Storage Rules
1. Go to **Storage** → **Rules**
2. **Replace** the default rules with this content:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Images storage rules
    match /images/{userId}/{fileName} {
      // Users can upload to their own folder
      allow create: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024  // 5MB max file size
        && request.resource.contentType.matches('image/.*');  // Only images
      
      // Users can read their own images
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read all images
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Create Admin User

### 6.1 Create Admin in Firebase Console
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. **Email**: `admin@picturethis.com` (or change this in your .env.local)
4. **Password**: Create a strong password (remember this!)
5. Click **"Add user"**

## Step 7: Test Your Setup

### 7.1 Start Development Server
```bash
npm run dev
```

### 7.2 Open Your App
Go to `http://localhost:9002`

### 7.3 Test Registration
1. Click **"Sign Up"**
2. Create a test user account
3. You should see "Account Created Successfully" message

### 7.4 Test Admin Login
1. Go to login page
2. Use your admin credentials (`admin@picturethis.com`)
3. You should be redirected to the admin dashboard

### 7.5 Test User Approval
1. As admin, approve the test user you created
2. Log out and log in as the test user
3. Try uploading a photo

## 🚨 Common Issues & Solutions

### Issue 1: "Firebase project not found"
**Solution**: Double-check your `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env.local`

### Issue 2: "Permission denied" errors
**Solution**: Make sure you published the security rules correctly

### Issue 3: "Auth domain not authorized"
**Solution**: 
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add `localhost` if testing locally

### Issue 4: Environment variables not loading
**Solution**: 
1. Make sure file is named exactly `.env.local` (not `.env.local.txt`)
2. Restart your development server: `npm run dev`

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Storage enabled
- [ ] Web app registered and config copied
- [ ] `.env.local` file created with correct values
- [ ] Security rules updated for both Firestore and Storage
- [ ] Admin user created
- [ ] Development server starts without errors
- [ ] Can create new user accounts
- [ ] Admin can log in and see dashboard

## 🎉 Success!

If all steps are completed, your PictureThis app should now be fully connected to Firebase and working! 

**Test the complete flow:**
1. Sign up as a user → Should work
2. Login as admin → Should see admin dashboard
3. Approve the user → Should work
4. Login as user → Should see approved status
5. Upload a photo → Should work with progress bar

**Need help?** Check the troubleshooting section above or let me know what specific error you're seeing!


