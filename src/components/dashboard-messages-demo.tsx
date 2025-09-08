"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Upload, Trophy } from "lucide-react";

export function DashboardMessagesDemo() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-blue-500" />
            Dashboard Message States Demo
          </CardTitle>
          <CardDescription>
            See how the dashboard messages change based on user status and upload progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Pending Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pending</Badge>
              <span className="text-sm text-muted-foreground">User waiting for approval</span>
            </div>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Account Pending Approval</AlertTitle>
              <AlertDescription>
                Your account is currently under review by an administrator. You will be notified once it's approved.
              </AlertDescription>
            </Alert>
          </div>

          {/* Approved - No Photos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500 text-white">Approved</Badge>
              <span className="text-sm text-muted-foreground">0 photos uploaded</span>
            </div>
            <Alert className="bg-accent/50 border-accent">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>You're all set!</AlertTitle>
              <AlertDescription>
                Your account is approved. Start your 30-day photo journey by uploading your first picture.
              </AlertDescription>
            </Alert>
          </div>

          {/* Approved - Journey in Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500 text-white">Approved</Badge>
              <span className="text-sm text-muted-foreground">5 photos uploaded</span>
            </div>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Journey in Progress!</AlertTitle>
              <AlertDescription className="text-green-700">
                Great! You've uploaded 5 photos. Keep going to complete your 30-day transformation journey!
              </AlertDescription>
            </Alert>
          </div>

          {/* Approved - Journey Complete */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500 text-white">Approved</Badge>
              <span className="text-sm text-muted-foreground">30+ photos uploaded</span>
            </div>
            <Alert className="bg-purple-50 border-purple-200">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              <AlertTitle className="text-purple-800">🎉 Journey Complete!</AlertTitle>
              <AlertDescription className="text-purple-700">
                Congratulations! You've completed your 30-day transformation journey with 30 photos. What an amazing achievement!
              </AlertDescription>
            </Alert>
          </div>

          {/* Logic Explanation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Message Logic</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Pending Users:</h4>
                <p className="text-sm text-muted-foreground">
                  Shows "Account Pending Approval" message until admin approves the account.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Approved + No Photos:</h4>
                <p className="text-sm text-muted-foreground">
                  Shows "You're all set!" message encouraging first photo upload.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Approved + 1-29 Photos:</h4>
                <p className="text-sm text-muted-foreground">
                  Shows "Journey in Progress!" message with photo count and encouragement.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Approved + 30+ Photos:</h4>
                <p className="text-sm text-muted-foreground">
                  Shows "Journey Complete!" celebration message.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefits of This Approach</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Upload className="h-3 w-3" />
                  Clear Call-to-Action
                </Badge>
                <p className="text-sm text-muted-foreground">
                  New users get a clear message to start their journey with their first photo.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <CheckCircle2 className="h-3 w-3" />
                  Progress Tracking
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Users see their progress and are motivated to continue their journey.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Trophy className="h-3 w-3" />
                  Achievement Recognition
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Completed journeys are celebrated with a special congratulatory message.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Clock className="h-3 w-3" />
                  Contextual Messaging
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Messages only appear when relevant, reducing clutter for active users.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

