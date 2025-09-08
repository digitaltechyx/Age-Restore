"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, Camera, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export function UploadButtonsDemo() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-500" />
            Upload Button Integration Demo
          </CardTitle>
          <CardDescription>
            See how upload buttons are strategically placed throughout the dashboard for easy access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Header Upload Button */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Dashboard Header</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight font-headline">Welcome back, User!</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-muted-foreground">Your account status:</p>
                    <Badge variant="default" className="bg-green-500 text-white">Approved</Badge>
                  </div>
                </div>
                <Button className="w-full sm:w-auto" size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Primary upload button in the dashboard header - always visible for approved users.
            </p>
          </div>

          {/* Gallery Header Button */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Gallery Section</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                <h2 className="text-lg font-semibold">Your 30-Day Gallery</h2>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Photo
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Secondary upload button in the gallery header for quick access while viewing photos.
            </p>
          </div>

          {/* Empty State Upload */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Empty Gallery State</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Start Your Journey</h3>
                  <p className="text-muted-foreground max-w-md">
                    Upload your first photo to begin your 30-day transformation journey. 
                    Each photo will be a step towards your goal!
                  </p>
                </div>
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Photo
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Special call-to-action for users who haven't uploaded any photos yet.
            </p>
          </div>

          {/* Button Variations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Button Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Primary Upload</h4>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground">Main action button</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Secondary Add</h4>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Photo
                </Button>
                <p className="text-xs text-muted-foreground">Secondary action</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Large CTA</h4>
                <Button size="lg" className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Your First Photo
                </Button>
                <p className="text-xs text-muted-foreground">Call-to-action for empty state</p>
              </div>
            </div>
          </div>

          {/* Responsive Design */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Responsive Design</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Mobile Layout:</h4>
                <p className="text-sm text-muted-foreground">
                  Upload buttons stack vertically and take full width for easy touch interaction.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Desktop Layout:</h4>
                <p className="text-sm text-muted-foreground">
                  Upload buttons align horizontally with other elements for efficient use of space.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Conditional Display:</h4>
                <p className="text-sm text-muted-foreground">
                  Upload buttons only show for approved users, maintaining clean interface for pending users.
                </p>
              </div>
            </div>
          </div>

          {/* User Experience Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Experience Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Upload className="h-3 w-3" />
                  Easy Access
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Multiple upload entry points ensure users can always find the upload function.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <ImageIcon className="h-3 w-3" />
                  Contextual Actions
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Upload buttons appear in relevant contexts (gallery, empty state, header).
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Camera className="h-3 w-3" />
                  Clear Intent
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Different button styles and text communicate the specific action clearly.
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Plus className="h-3 w-3" />
                  Progressive Disclosure
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Upload options become more prominent as users progress through their journey.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

