# **App Name**: PictureThis

## Core Features:

- User Authentication: User Registration/Login with email/password via Firebase Authentication.
- User Dashboard: Dashboard for users with Profile, Home, and Upload buttons.
- Image Upload: Image upload functionality for users with date-based storage in Firebase Storage and Firestore indexing.  A limit of one picture per day for 30 days.
- Refund Request: Refund request button triggering email notification to admin via Firebase Cloud Function.
- Admin Login: Admin Login: Check user role (admin) from Firestore and redirect to admin dashboard.
- Admin Dashboard: Admin Dashboard to view all registered users with personal details and status.
- Admin Account Management: Admin can approve/disapprove user accounts (update status in Firestore).  Admin can view each user’s 30-day gallery.  Admin can download any user’s data as CSV or JSON. Admin receives notifications for new user registration and refund requests (email alerts via Firebase Cloud Functions).

## Style Guidelines:

- Primary color: Soft blue (#A0D2EB) to evoke a sense of calm and trust, reflecting the reliable image storage.
- Background color: Light gray (#F5F5F5), a desaturated near-white to ensure content and images are the focus.
- Accent color: Muted purple (#B39DDB), adding a touch of creativity and uniqueness without being overwhelming.
- Body and headline font: 'PT Sans', a modern sans-serif providing a clean, accessible reading experience appropriate to both headlines and body text.
- Simple, outlined icons for navigation and actions.
- Clean and responsive design for both user and admin dashboards.
- Subtle transitions and animations on button presses and content loading to enhance user experience.