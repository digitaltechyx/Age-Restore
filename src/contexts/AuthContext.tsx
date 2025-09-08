"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '@/lib/firebase';
import { User } from '@/lib/types';
import { getAuthErrorMessage } from '@/lib/authErrors';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: FirebaseUser }>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUserProfile(userData);
            // Check if user is admin by email
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'digitaltechyx@gmail.com';
            const isAdminUser = userData.email === adminEmail || userData.email === 'digitaltechyx@gmail.com';
            console.log('Admin check from Firestore:', { userEmail: userData.email, adminEmail, isAdminUser });
            console.log('Setting isAdmin to:', isAdminUser);
            setIsAdmin(isAdminUser);
          } else {
            // If no user profile exists, check by email directly
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'digitaltechyx@gmail.com';
            const isAdminUser = firebaseUser.email === adminEmail || firebaseUser.email === 'digitaltechyx@gmail.com';
            console.log('Admin check from Firebase user:', { userEmail: firebaseUser.email, adminEmail, isAdminUser });
            setIsAdmin(isAdminUser);
            
            // If this is an admin user, create their profile
            if (isAdminUser) {
              console.log('Creating admin profile for:', firebaseUser.email);
              const adminProfile: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Admin User',
                email: firebaseUser.email || '',
                avatarUrl: firebaseUser.photoURL || '',
                status: 'approved',
                registrationDate: new Date().toISOString().split('T')[0],
                gallery: []
              };
              
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                  ...adminProfile,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });
                setUserProfile(adminProfile);
                console.log('Admin profile created successfully');
              } catch (error) {
                console.error('Error creating admin profile:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // The admin state will be set by onAuthStateChanged when user profile is loaded
      // Don't return the result, just complete the function
    } catch (error: any) {
      // Convert Firebase error to user-friendly error
      const userFriendlyMessage = getAuthErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, { displayName: name });
      
      // Create user document in Firestore
      const userProfile: User = {
        id: result.user.uid,
        name,
        email,
        avatarUrl: '',
        status: 'pending', // Users start as pending approval
        registrationDate: new Date().toISOString().split('T')[0],
        gallery: []
      };
      
      await setDoc(doc(db, 'users', result.user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setUserProfile(userProfile);
      
      // Don't return the result, just complete the function
    } catch (error: any) {
      // Convert Firebase error to user-friendly error
      const userFriendlyMessage = getAuthErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google login result:', { email: result.user.email, uid: result.user.uid });
      
      // Admin state will be set by onAuthStateChanged when user profile is loaded
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // Check if this is an admin user
        const isAdminUser = result.user.email === 'digitaltechyx@gmail.com';
        
        const userProfile: User = {
          id: result.user.uid,
          name: result.user.displayName || 'Google User',
          email: result.user.email || '',
          avatarUrl: result.user.photoURL || '',
          status: isAdminUser ? 'approved' : 'pending',
          registrationDate: new Date().toISOString().split('T')[0],
          gallery: []
        };
        
        await setDoc(doc(db, 'users', result.user.uid), {
          ...userProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        setUserProfile(userProfile);
      }
      
      // Return the result so we can access user email for immediate redirect
      return { user: result.user };
    } catch (error: any) {
      // Handle specific popup closed error
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      }
      
      const userFriendlyMessage = getAuthErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      
      // Admin state will be set by onAuthStateChanged when user profile is loaded
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        const userProfile: User = {
          id: result.user.uid,
          name: result.user.displayName || 'Facebook User',
          email: result.user.email || '',
          avatarUrl: result.user.photoURL || '',
          status: 'pending',
          registrationDate: new Date().toISOString().split('T')[0],
          gallery: []
        };
        
        await setDoc(doc(db, 'users', result.user.uid), {
          ...userProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        setUserProfile(userProfile);
      }
      
      // Don't return the result, just complete the function
    } catch (error: any) {
      const userFriendlyMessage = getAuthErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
