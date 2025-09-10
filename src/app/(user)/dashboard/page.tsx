"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GalleryGrid, GalleryPresets } from "@/components/gallery-grid";


interface GalleryImage {
  id: string;
  imageUrl: string;
  uploadDate: string;
  moodText?: string | null;
  moodEmoji?: string | null;
  dayNumber?: number;
  isMissing?: boolean;
  missingMessage?: string;
}

export default function DashboardHomePage() {
  const { user, userProfile } = useAuth();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (!user) return;
      
      try {
        const imagesRef = collection(db, 'images');
        // Temporary workaround: Get all user images without ordering, then sort in memory
        // This avoids the composite index requirement
        const q = query(
          imagesRef, 
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        const uploadedImages: GalleryImage[] = [];
        querySnapshot.forEach((doc) => {
          uploadedImages.push({ id: doc.id, ...doc.data() } as GalleryImage);
        });
        
        // Sort by uploadDate in memory (this works for small datasets)
        uploadedImages.sort((a, b) => 
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        );
        
        // Create a 30-day sequential grid based on account approval date
        const sequentialGrid: GalleryImage[] = [];
        const today = new Date();
        
        // Get account approval date from user profile
        let journeyStartDate: Date;
        
        if (userProfile?.approvedAt) {
          // New users: use approval date
          journeyStartDate = new Date(userProfile.approvedAt);
        } else if (uploadedImages.length > 0) {
          // Existing users: use date of first upload as journey start
          const firstUpload = uploadedImages[0];
          journeyStartDate = new Date(firstUpload.uploadDate);
        } else {
          // Fallback: use registration date or today
          journeyStartDate = userProfile?.registrationDate ? new Date(userProfile.registrationDate) : new Date();
        }
        
        
        // Create 30 days starting from journey start
        for (let day = 1; day <= 30; day++) {
          const currentDate = new Date(journeyStartDate);
          currentDate.setDate(journeyStartDate.getDate() + (day - 1));
          
          
          // Find if there's an uploaded image for this day
          const uploadedImage = uploadedImages.find(img => {
            // img.uploadDate is stored as YYYY-MM-DD string format
            const imgDateString = img.uploadDate;
            const currentDateString = currentDate.toISOString().split('T')[0];
            return imgDateString === currentDateString;
          });
          
          if (uploadedImage) {
            // Image exists for this day
            sequentialGrid.push({
              ...uploadedImage,
              dayNumber: day
            });
          } else {
            // Missing image for this day
            const isPastDay = currentDate < today;
            const isToday = currentDate.toDateString() === today.toDateString();
            const isFutureDay = currentDate > today;
            
            let missingMessage = '';
            if (isToday) {
              missingMessage = `Today is Day ${day} - Upload your photo to continue your journey!`;
            } else if (isPastDay) {
              missingMessage = `You forgot to upload your Day ${day} picture on ${currentDate.toLocaleDateString()}`;
            } else if (isFutureDay) {
              missingMessage = `Day ${day} - Coming up on ${currentDate.toLocaleDateString()}`;
            } else {
              missingMessage = `Day ${day} - Upload your photo`;
            }
            
            sequentialGrid.push({
              id: `missing-${day}`,
              imageUrl: '',
              uploadDate: currentDate.toISOString(),
              dayNumber: day,
              isMissing: true,
              missingMessage: missingMessage
            });
          }
        }
        

        
        setGalleryImages(sequentialGrid);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto px-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight font-headline truncate">Welcome back, {userProfile?.name || 'User'}!</h1>
          <div className="mt-2 flex items-center gap-2 min-w-0">
            <p className="text-muted-foreground whitespace-nowrap">Your account status:</p>
          <Badge variant={userProfile?.status === 'approved' ? 'default' : 'secondary'} className={userProfile?.status === 'approved' ? 'bg-green-500 text-white' : ''}>
            {userProfile?.status ? userProfile.status.charAt(0).toUpperCase() + userProfile.status.slice(1) : 'Pending'}
          </Badge>
        </div>
        </div>
        
        {userProfile?.status === 'approved' && (
          <Link href="/dashboard/upload" className="flex-shrink-0">
            <Button className="w-full sm:w-auto" size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </Link>
        )}
      </div>

      {userProfile?.status === 'pending' && (
        <Alert className="mt-5">
          <AlertTitle>Account Pending Approval</AlertTitle>
          <AlertDescription>
            Your account is currently under review by an administrator. You will be notified once it's approved.
          </AlertDescription>
        </Alert>
      )}

      {userProfile?.status === 'approved' && (() => {
        const uploadedCount = galleryImages.filter(img => !img.isMissing).length;
        const missingCount = galleryImages.filter(img => img.isMissing).length;
        const todayImage = galleryImages.find(img => {
          const today = new Date();
          const imgDate = new Date(img.uploadDate);
          return imgDate.toDateString() === today.toDateString();
        });
        
        if (uploadedCount === 0) {
          return (
         <Alert className="bg-accent/50 border-accent mt-5">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>You're all set!</AlertTitle>
          <AlertDescription>
            Your account is approved. Start your 30-day photo journey by uploading your first picture.
          </AlertDescription>
        </Alert>
          );
        } else if (uploadedCount < 30) {
          return (
            <Alert className="bg-green-50 border-green-200 mt-5">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Journey in Progress!</AlertTitle>
              <AlertDescription className="text-green-700">
                {uploadedCount === 1 ? (
                  <>🌟 Your transformation journey has begun! You've captured your first moment. {missingCount > 0 && `${missingCount} more days to go - you've got this!`}</>
                ) : uploadedCount <= 5 ? (
                  <>🚀 Amazing start! You're building momentum with {uploadedCount} photos. {missingCount > 0 && `Keep going - ${missingCount} days left in your journey!`}</>
                ) : uploadedCount <= 10 ? (
                  <>💪 You're on fire! {uploadedCount} photos captured and counting. {missingCount > 0 && `You're ${Math.round((uploadedCount/30)*100)}% there - ${missingCount} days to complete your transformation!`}</>
                ) : uploadedCount <= 20 ? (
                  <>✨ Incredible progress! You've documented {uploadedCount} days of your journey. {missingCount > 0 && `You're more than halfway there - just ${missingCount} more days to go!`}</>
                ) : (
                  <>🎯 Almost there! You've captured {uploadedCount} amazing moments. {missingCount > 0 && `Only ${missingCount} more days until you complete your 30-day transformation!`}</>
                )}
                {todayImage?.isMissing && " Don't forget to capture today's moment!"}
              </AlertDescription>
            </Alert>
          );
        } else {
          return (
            <Alert className="bg-purple-50 border-purple-200 mt-5">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              <AlertTitle className="text-purple-800">🎉 Journey Complete!</AlertTitle>
              <AlertDescription className="text-purple-700">
                Congratulations! You've completed your 30-day transformation journey with {uploadedCount} photos. What an amazing achievement!
              </AlertDescription>
            </Alert>
          );
        }
      })()}

      <Card className="mt-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-headline">Your 30-Day Gallery</CardTitle>
          {userProfile?.status === 'approved' && (
            <Link href="/dashboard/upload">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Photo
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : galleryImages.length === 0 && userProfile?.status === 'approved' ? (
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
              <Link href="/dashboard/upload">
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Photo
                </Button>
              </Link>
            </div>
          ) : (
            <GalleryGrid 
              images={galleryImages} 
              {...GalleryPresets.userDashboard}
            />
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

