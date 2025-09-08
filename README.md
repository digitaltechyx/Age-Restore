# AgeRestore - 30-Day Photo Journey App

A beautiful photo journaling application built with Next.js 15, Firebase, and modern UI components. Users can document their life journey by uploading one picture per day for 30 days, with admin approval and management features.

![AgeRestore Banner](https://placehold.co/800x300/A0D2EB/FFFFFF?text=AgeRestore+📸)

## ✨ Features

### 🔐 Authentication & User Management
- **Email/Password Authentication** via Firebase Auth
- **User Registration** with approval workflow
- **Admin Dashboard** for user management
- **Role-based Access Control** (Admin vs User)

### 📸 Photo Journey
- **Daily Photo Upload** (one per day, 30-day limit)
- **Real-time Image Upload** with progress tracking
- **Beautiful Gallery View** with hover effects
- **Date-based Organization** and validation

### 👥 Admin Features
- **User Approval System** (pending/approved/disapproved)
- **User Management Dashboard** with detailed views
- **Data Export** (CSV/JSON format)
- **Gallery Oversight** for all users

### 🎨 Design System
- **Custom Color Palette**: Soft blue primary (#A0D2EB), muted purple accent (#B39DDB)
- **PT Sans Typography** for clean, modern appearance
- **Responsive Design** with mobile-first approach
- **Dark/Light Mode** support
- **Accessibility Features** with proper ARIA labels

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router and Turbo bundling
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Hook Form** with Zod validation
- **Lucide Icons** for consistent iconography

### Backend & Services
- **Firebase Authentication** for user management
- **Firestore** for data storage
- **Firebase Storage** for image hosting
- **Google Genkit** for AI integration (optional)
- **Firebase App Hosting** for deployment

### Development Tools
- **ESLint & TypeScript** for code quality
- **Responsive Design** utilities
- **Modern React Patterns** (hooks, context)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Firebase CLI (`npm install -g firebase-tools`)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd picturethis
npm install
```

### 2. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Storage
5. Copy your Firebase config

### 3. Environment Configuration
```bash
cp env.example .env.local
```

Fill in your Firebase configuration in `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
ADMIN_EMAIL=admin@picturethis.com
```

### 4. Security Rules
Deploy the security rules from the repo:
- Upload `firestore.rules` to Firestore > Rules
- Upload `storage.rules` to Storage > Rules

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:9002` to see your app!

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication routes
│   ├── (user)/            # User dashboard routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── ui/                # Radix UI components
│   └── user-nav.tsx       # Navigation component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── hooks/                 # Custom hooks
├── lib/                   # Utilities and configurations
│   ├── firebase.ts        # Firebase configuration
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
```

## 🎯 User Journey

### For Users
1. **Sign Up** → Create account (pending approval)
2. **Wait for Approval** → Admin approves account
3. **Start Journey** → Upload first photo
4. **Daily Uploads** → Continue for 30 days
5. **View Gallery** → See completed journey

### For Admins
1. **Login** → Access admin dashboard
2. **Review Users** → See pending registrations
3. **Approve/Deny** → Manage user access
4. **Monitor Activity** → View user galleries
5. **Export Data** → Download user information

## 🔒 Security Features

- **Firestore Security Rules** for data protection
- **Storage Access Control** for image security
- **Role-based Authentication** with admin privileges
- **Input Validation** with Zod schemas
- **File Type Validation** (images only)
- **Upload Size Limits** (5MB max)

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet optimization** with sidebar layouts
- **Desktop experience** with full feature access
- **Touch-friendly** interactions
- **Adaptive navigation** patterns

## 🎨 Design Philosophy

AgeRestore follows a **calm and trustworthy** design approach:

- **Soft Blue (#A0D2EB)**: Primary color evoking trust and reliability
- **Light Gray (#F5F5F5)**: Clean background keeping focus on content
- **Muted Purple (#B39DDB)**: Creative accent without overwhelming
- **PT Sans Font**: Modern, accessible typography
- **Subtle Animations**: Smooth transitions enhance user experience

## 📊 Database Structure

### Users Collection
```typescript
{
  id: string;              // Auth UID
  name: string;            // Display name
  email: string;           // Email address
  status: 'pending' | 'approved' | 'disapproved';
  registrationDate: string; // YYYY-MM-DD
  avatarUrl?: string;      // Profile picture
}
```

### Images Collection
```typescript
{
  id: string;              // Auto-generated
  userId: string;          // User reference
  imageUrl: string;        // Storage URL
  uploadDate: string;      // YYYY-MM-DD
  fileName: string;        // Original name
  createdAt: Timestamp;    // Upload time
}
```

## 🚀 Deployment

Detailed deployment instructions are available in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

Quick deploy to Firebase Hosting:
```bash
npm run build
npm run export
firebase deploy --only hosting
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## 🆘 Support

- **Documentation**: Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Database**: See [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions

## 🌟 Acknowledgments

- **Firebase** for backend services
- **Next.js** for the React framework
- **Radix UI** for accessible components
- **Tailwind CSS** for styling utilities
- **Lucide** for beautiful icons

---

Built with ❤️ for documenting life's beautiful moments, one picture at a time.

**Live Demo**: [https://your-app.web.app](https://your-app.web.app)
**Version**: 1.0.0
