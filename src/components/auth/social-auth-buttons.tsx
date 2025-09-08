"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

interface SocialAuthButtonsProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

export function SocialAuthButtons({ mode, onSuccess }: SocialAuthButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginWithGoogle, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      toast({
        title: "Success!",
        description: `Welcome! You've successfully ${mode === 'login' ? 'logged in' : 'signed up'} with Gmail.`,
      });
      onSuccess?.();
      
      // Check if this is an admin user by email
      const isAdminUser = result?.user?.email === 'digitaltechyx@gmail.com';
      
      // Redirect based on admin status
      if (isAdminUser) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      
      // Handle specific error cases
      let errorMessage = error.message || "Failed to authenticate with Gmail. Please try again.";
      let errorTitle = `${mode === 'login' ? 'Login' : 'Signup'} Failed`;
      
      if (error.message?.includes('cancelled')) {
        errorTitle = "Sign-in Cancelled";
        errorMessage = "You cancelled the sign-in process. Please try again if you want to continue.";
      } else if (error.message?.includes('popup')) {
        errorTitle = "Sign-in Window Closed";
        errorMessage = "The sign-in window was closed. Please try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };



  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={handleGoogleAuth}
        disabled={isGoogleLoading}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        {isGoogleLoading ? "Loading..." : "Continue with Gmail"}
      </Button>
    </div>
  );
}

