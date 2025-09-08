# Social Authentication Setup Guide

This guide will help you configure Google and Facebook authentication for your AgeRestore application.

## Prerequisites

- Firebase project set up
- Google Cloud Console access
- Facebook Developer account

## Google Authentication Setup

### 1. Enable Google Sign-In in Firebase

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable**
6. Add your project support email
7. Click **Save**

### 2. Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** user type (unless you have Google Workspace)
5. Fill in the required information:
   - **App name**: AgeRestore
   - **User support email**: Your email
   - **Developer contact information**: Your email
6. Add scopes (optional):
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
7. Add test users (for development)
8. Save and continue

### 3. Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:9002` (for development)
   - `https://your-domain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:9002/__/auth/handler` (for development)
   - `https://your-domain.com/__/auth/handler` (for production)
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### 4. Update Firebase Configuration

1. In Firebase Console, go to **Project Settings** > **General**
2. Scroll down to **Your apps** section
3. Click on your web app
4. Copy the Firebase configuration
5. Update your `.env.local` file with the configuration

## Facebook Authentication Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** app type
4. Fill in app details:
   - **App Name**: AgeRestore
   - **App Contact Email**: Your email
   - **App Purpose**: Authentication
5. Click **Create App**

### 2. Add Facebook Login Product

1. In your Facebook App dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Enter your site URL:
   - Development: `http://localhost:9002`
   - Production: `https://your-domain.com`

### 3. Configure Facebook Login Settings

1. In Facebook Login settings, go to **Settings**
2. Add Valid OAuth Redirect URIs:
   - `https://your-project-id.firebaseapp.com/__/auth/handler`
3. Save changes

### 4. Get Facebook App Credentials

1. Go to **Settings** > **Basic**
2. Copy your **App ID** and **App Secret**
3. Note: You'll need to add these to Firebase

### 5. Enable Facebook in Firebase

1. Go to Firebase Console > **Authentication** > **Sign-in method**
2. Click on **Facebook** provider
3. Toggle **Enable**
4. Enter your Facebook **App ID** and **App Secret**
5. Click **Save**

## Environment Variables

Update your `.env.local` file with the following variables:

```env
# Firebase Configuration (already exists)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: If you need additional configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

## Testing

### Development Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Click on Google or Facebook buttons
4. Complete the OAuth flow
5. Verify user is created in Firebase Authentication
6. Check Firestore for user profile creation

### Production Deployment

1. Update authorized domains in both Google and Facebook consoles
2. Add your production domain to Firebase authorized domains
3. Update environment variables for production
4. Test the authentication flow in production

## Troubleshooting

### Common Issues

1. **"This app is not verified"**
   - This is normal for development
   - Click "Advanced" > "Go to [App Name] (unsafe)" to proceed

2. **"Invalid redirect URI"**
   - Check that your redirect URIs match exactly in both Firebase and provider consoles
   - Ensure no trailing slashes

3. **"App not found"**
   - Verify your App ID/Client ID is correct
   - Check that the app is published (for Facebook)

4. **"Access blocked"**
   - Add your domain to authorized domains
   - Check OAuth consent screen configuration

### Debug Steps

1. Check browser console for errors
2. Verify Firebase configuration
3. Test with different browsers
4. Check Firebase Authentication logs
5. Verify provider app settings

## Security Considerations

1. **Never expose App Secrets** in client-side code
2. **Use HTTPS** in production
3. **Configure proper CORS** settings
4. **Regularly rotate** credentials
5. **Monitor authentication** logs for suspicious activity

## Support

If you encounter issues:

1. Check Firebase documentation
2. Review provider-specific guides
3. Check browser console for errors
4. Verify all configuration steps were completed

## Features Included

✅ Google Sign-In integration
✅ Facebook Login integration
✅ Automatic user profile creation
✅ Admin user support
✅ Error handling with user-friendly messages
✅ Responsive design
✅ Loading states
✅ Toast notifications
✅ Seamless integration with existing auth system

The social authentication is now fully integrated into your login and signup forms!


