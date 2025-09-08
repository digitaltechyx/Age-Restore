"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Clock, AlertTriangle } from "lucide-react";

export function SequentialUploadDemo() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            Sequential 30-Day Upload System Demo
          </CardTitle>
          <CardDescription>
            See how the sequential upload system works with missing day tracking and reminders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* System Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Overview</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">30-Day Sequential Grid:</h4>
                <p className="text-sm text-muted-foreground">
                  Users must upload photos in sequence over 30 consecutive days. Each day gets a slot in the gallery.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Missing Day Tracking:</h4>
                <p className="text-sm text-muted-foreground">
                  If a user misses a day, the gallery shows an empty slot with a reminder message about the missing day.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Smart Messaging:</h4>
                <p className="text-sm text-muted-foreground">
                  Different messages for past days, today, and future days to guide users appropriately.
                </p>
              </div>
            </div>
          </div>

          {/* Gallery States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gallery States</h3>
            
            {/* Uploaded Day */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500 text-white">Day 1</Badge>
                <span className="text-sm text-muted-foreground">Successfully uploaded</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">📸</span>
                    </div>
                    <p className="text-sm font-medium">Day 1</p>
                    <p className="text-xs text-muted-foreground">Uploaded successfully</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Past Day */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Day 2</Badge>
                <span className="text-sm text-muted-foreground">Missing - past day</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="aspect-square bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-gray-500 text-xl">📷</span>
                    </div>
                    <p className="text-gray-600 font-medium text-sm">Day 2</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      You forgot to upload your Day 2 picture on 12/15/2024
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Today */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Day 3</Badge>
                <span className="text-sm text-muted-foreground">Missing - today</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="aspect-square bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-gray-500 text-xl">📷</span>
                    </div>
                    <p className="text-gray-600 font-medium text-sm">Day 3</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Today is Day 3 - Upload your photo to continue your journey!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Future Day */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Day 4</Badge>
                <span className="text-sm text-muted-foreground">Future day</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="aspect-square bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-gray-500 text-xl">📷</span>
                    </div>
                    <p className="text-gray-600 font-medium text-sm">Day 4</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Day 4 - Future day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dashboard Messages</h3>
            
            {/* Progress Message */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Journey in Progress:</h4>
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Journey in Progress!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Great! You've uploaded 1 photo out of 30. You have 2 missing days. Don't forget to upload today's photo!
                </AlertDescription>
              </Alert>
            </div>

            {/* Missing Days Alert */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Missing Days Reminder:</h4>
              <Alert className="bg-orange-50 border-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800">Missing Days Detected</AlertTitle>
                <AlertDescription className="text-orange-700">
                  You have 2 missing days in your journey. While you can continue uploading, consider maintaining consistency for the best results.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefits of Sequential System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Calendar className="h-3 w-3" />
                  Daily Consistency
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Encourages users to maintain daily photo-taking habits for better transformation results.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Clock className="h-3 w-3" />
                  Progress Tracking
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Clear visual representation of progress with missing day indicators.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <AlertTriangle className="h-3 w-3" />
                  Accountability
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Missing days are clearly marked, encouraging users to stay on track.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <CheckCircle2 className="h-3 w-3" />
                  Achievement
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Completing all 30 days becomes a significant achievement worth celebrating.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Implementation</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Date-Based Logic:</h4>
                <p className="text-sm text-muted-foreground">
                  System calculates 30-day period from current date and matches uploaded images to specific days.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Missing Day Detection:</h4>
                <p className="text-sm text-muted-foreground">
                  Compares expected dates with actual upload dates to identify missing days.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Smart Messaging:</h4>
                <p className="text-sm text-muted-foreground">
                  Different messages for past, present, and future days to guide user behavior appropriately.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Visual Indicators:</h4>
                <p className="text-sm text-muted-foreground">
                  Dashed borders and camera icons clearly distinguish missing days from uploaded photos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

