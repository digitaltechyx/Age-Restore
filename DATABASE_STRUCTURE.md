# PictureThis Database Structure

## Firestore Collections

### `/users/{userId}`
User profile documents with the following structure:

```typescript
{
  id: string;                    // Document ID (matches Auth UID)
  name: string;                  // User's display name
  email: string;                 // User's email address
  avatarUrl: string;             // Profile picture URL (optional)
  status: 'pending' | 'approved' | 'disapproved';  // Account status
  registrationDate: string;      // YYYY-MM-DD format
  createdAt: Timestamp;          // Document creation timestamp
  updatedAt: Timestamp;          // Last update timestamp
}
```

### `/images/{imageId}`
Image metadata documents with the following structure:

```typescript
{
  id: string;                    // Document ID (auto-generated)
  userId: string;                // Reference to user who uploaded
  imageUrl: string;              // Firebase Storage download URL
  uploadDate: string;            // YYYY-MM-DD format (for daily limit)
  createdAt: Timestamp;          // Upload timestamp
  fileName: string;              // Original file name
  filePath: string;              // Storage path for management
}
```

## Firebase Storage Structure

### `/images/{userId}/{filename}`
- `{userId}`: User's Firebase Auth UID
- `{filename}`: Format: `YYYY-MM-DD_timestamp_originalname.ext`

## Security Rules

### Firestore Rules
- Users can read/write their own profile
- Admins can read all profiles and update user status
- Users can create/read their own images
- Admins can read all images
- Daily upload limit enforced at application level

### Storage Rules
- Users can upload to their own folder only
- 5MB file size limit
- Images only (MIME type validation)
- Users can read their own images
- Admins can read all images

## Indexes Needed

Create composite indexes in Firestore:

1. **images collection**:
   - `userId` (Ascending) + `uploadDate` (Descending)
   - `userId` (Ascending) + `createdAt` (Descending)

2. **users collection**:
   - `status` (Ascending) + `registrationDate` (Descending)

## Admin Configuration

Set the admin email in your environment variables:
```
ADMIN_EMAIL=admin@picturethis.com
```

The admin user must be manually created in Firebase Auth and then sign up through the app to create their user profile document.


