# PictureThis Deployment Guide

## Prerequisites

1. **Firebase Account**: Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. **Node.js**: Version 18 or higher
3. **Firebase CLI**: `npm install -g firebase-tools`

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `picturethis-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Firebase Services

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Click "Save"

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in "production mode" (we'll update rules later)
4. Choose location closest to your users
5. Click "Done"

#### Storage
1. Go to Storage
2. Click "Get started"
3. Start in "production mode" (we'll update rules later)
4. Choose same location as Firestore
5. Click "Done"

### 1.3 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" > Web app icon
4. Enter app nickname: "PictureThis Web"
5. Check "Set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the configuration object

## Step 2: Local Development Setup

### 2.1 Environment Configuration
1. Copy `env.example` to `.env.local`
2. Fill in your Firebase configuration:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
ADMIN_EMAIL=admin@picturethis.com

# Google AI (for Genkit - optional)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Update Security Rules

#### Firestore Rules
1. Go to Firestore > Rules
2. Replace default rules with content from `firestore.rules`
3. Click "Publish"

#### Storage Rules
1. Go to Storage > Rules
2. Replace default rules with content from `storage.rules`
3. Click "Publish"

### 2.4 Create Firestore Indexes
Go to Firestore > Indexes and create these composite indexes:

1. **Collection**: `images`
   - Fields: `userId` (Ascending), `uploadDate` (Descending)
   - Query scope: Collection

2. **Collection**: `images`
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   - Query scope: Collection

## Step 3: Admin User Setup

### 3.1 Create Admin User in Firebase Auth
1. Go to Authentication > Users
2. Click "Add user"
3. Email: `admin@picturethis.com` (or your preferred admin email)
4. Password: Create a strong password
5. Click "Add user"

### 3.2 Update Admin Email (if different)
If you used a different email, update the `ADMIN_EMAIL` in your `.env.local` file and the Firestore rules.

## Step 4: Test Locally

### 4.1 Start Development Server
```bash
npm run dev
```

### 4.2 Test User Flow
1. Go to `http://localhost:9002`
2. Sign up with a test user account
3. Login with admin account
4. Approve the test user
5. Test image upload functionality

## Step 5: Deploy to Firebase Hosting

### 5.1 Initialize Firebase
```bash
firebase login
firebase init hosting
```

Choose:
- Use existing project
- Public directory: `out`
- Single-page app: Yes
- Set up automatic builds: No

### 5.2 Build for Production
```bash
npm run build
```

### 5.3 Export Static Files
Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "export": "next export"
  }
}
```

Then run:
```bash
npm run export
```

### 5.4 Deploy
```bash
firebase deploy --only hosting
```

## Step 6: Production Environment Variables

For Firebase Hosting, environment variables are built into the app during build time. Make sure all `NEXT_PUBLIC_*` variables are set correctly before building.

## Step 7: Post-Deployment Setup

### 7.1 Update Firestore Rules for Production
Review and tighten security rules based on your domain:

```javascript
// Add domain validation if needed
allow read, write: if request.auth != null 
  && request.auth.token.firebase.sign_in_provider != null;
```

### 7.2 Configure Custom Domain (Optional)
1. Go to Hosting > Add custom domain
2. Follow Firebase's instructions to verify domain ownership
3. Update DNS records as instructed

## Step 8: Monitoring and Analytics

### 8.1 Enable Firebase Analytics
1. Go to Project Settings
2. Integrations tab > Google Analytics
3. Link to existing account or create new one

### 8.2 Set up Performance Monitoring
1. Go to Performance
2. Follow setup instructions for web apps

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check API keys are correct
   - Verify domain is authorized in Firebase Auth settings

2. **Storage Upload Failures**
   - Check storage rules
   - Verify bucket name in configuration

3. **Firestore Permission Denied**
   - Review Firestore rules
   - Check user authentication state

4. **Build Errors**
   - Ensure all environment variables are set
   - Check for TypeScript errors: `npm run typecheck`

### Debug Mode
Add this to your `.env.local` for debugging:
```bash
NEXT_PUBLIC_DEBUG=true
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Admin Access**: Regularly review admin user access
3. **Security Rules**: Test rules thoroughly with Firebase Rules Playground
4. **File Uploads**: Consider adding virus scanning for production
5. **Rate Limiting**: Implement rate limiting for uploads

## Backup Strategy

1. **Firestore**: Set up automated backups in Firebase Console
2. **Storage**: Consider periodic exports to Cloud Storage
3. **User Data**: Implement data export functionality

Your PictureThis app is now ready for production! 🎉


