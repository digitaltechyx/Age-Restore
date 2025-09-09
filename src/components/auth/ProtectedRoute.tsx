"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireApproved?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireApproved = false 
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute check:', { user: !!user, isAdmin, requireAdmin, userProfile: userProfile?.email });
      
      if (!user) {
        console.log('No user, redirecting to login');
        router.push('/login');
        return;
      }

      if (requireAdmin && !isAdmin) {
        console.log('Admin required but user is not admin, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }

      if (requireApproved && userProfile?.status !== 'approved') {
        // Allow access to dashboard even if not approved, 
        // they'll see the pending message there
        return;
      }
    }
  }, [user, userProfile, loading, isAdmin, requireAdmin, requireApproved, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is happening
  }

  if (requireAdmin && !isAdmin) {
    return null; // Redirect is happening
  }

  return <>{children}</>;
}


