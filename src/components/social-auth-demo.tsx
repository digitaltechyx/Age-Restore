"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Badge } from "@/components/ui/badge";
import { Chrome, Facebook, Shield, Users, Zap } from "lucide-react";

export function SocialAuthDemo() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Social Authentication Demo
          </CardTitle>
          <CardDescription>
            Experience seamless login and signup with Google and Facebook integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Chrome className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Google Sign-In</h3>
                <p className="text-sm text-muted-foreground">Quick access with Google account</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Facebook className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Facebook Login</h3>
                <p className="text-sm text-muted-foreground">Connect with Facebook profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Instant Access</h3>
                <p className="text-sm text-muted-foreground">No password required</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefits of Social Authentication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Users className="h-3 w-3" />
                  Faster Registration
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Users can sign up instantly without creating new passwords or filling lengthy forms.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Shield className="h-3 w-3" />
                  Enhanced Security
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Leverage Google and Facebook's robust security infrastructure for user authentication.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Zap className="h-3 w-3" />
                  Better UX
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Reduce friction in the signup process and improve user conversion rates.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Users className="h-3 w-3" />
                  Profile Data
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Automatically import user profile information like name and profile picture.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Try It Out</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Login Demo</CardTitle>
                  <CardDescription>Test the login functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialAuthButtons mode="login" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Signup Demo</CardTitle>
                  <CardDescription>Test the signup functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialAuthButtons mode="signup" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Implementation</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>Firebase Authentication:</strong> Integrated with Google and Facebook providers
              </p>
              <p className="text-sm">
                <strong>Automatic Profile Creation:</strong> User profiles are created automatically upon first social login
              </p>
              <p className="text-sm">
                <strong>Admin Support:</strong> Admin users can also use social authentication
              </p>
              <p className="text-sm">
                <strong>Error Handling:</strong> User-friendly error messages for authentication failures
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


