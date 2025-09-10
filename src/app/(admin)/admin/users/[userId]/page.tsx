"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Download, FileJson, FileText, XCircle, FileType } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/types";
import { GalleryGrid, GalleryPresets } from "@/components/gallery-grid";

interface GalleryImage {
  id: string;
  imageUrl: string;
  uploadDate: string;
  fileName: string;
  moodText?: string | null;
  moodEmoji?: string | null;
  dayNumber?: number;
  isMissing?: boolean;
  missingMessage?: string;
}

const statusVariant: { [key in User['status']]: "default" | "secondary" | "destructive" } = {
  approved: "default",
  pending: "secondary",
  disapproved: "destructive",
};

const statusColor: { [key in User['status']]: string } = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  disapproved: "bg-red-500",
};

export default function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const [user, setUser] = useState<User | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Unwrap params Promise
        const { userId } = await params;
        
        // Fetch user data
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setUser(userData);
          
          // Fetch user's gallery
          const imagesRef = collection(db, 'images');
          const q = query(imagesRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          
          const userGallery: GalleryImage[] = [];
          querySnapshot.forEach((doc) => {
            userGallery.push({ id: doc.id, ...doc.data() } as GalleryImage);
          });
          
          // Sort by uploadDate ascending to get chronological order
          const sortedGallery = userGallery.sort((a, b) => 
            new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          );
          
          // For admin view, use the same 30-day sequential logic as user dashboard
          const adminGallery: GalleryImage[] = [];
          const today = new Date();
          
          // Get account approval date from user profile
          const approvalDate = userData?.approvedAt ? new Date(userData.approvedAt) : new Date();
          
          // Journey starts from approval date (Day 1 = approval date)
          const journeyStartDate = new Date(approvalDate);
          
          // Create 30 days starting from journey start - FIXED 30-DAY PERIOD
          for (let day = 1; day <= 30; day++) {
            const slotDate = new Date(journeyStartDate);
            slotDate.setDate(journeyStartDate.getDate() + (day - 1));
            
            // Find if there's an uploaded image for this specific day slot
            const uploadedImage = sortedGallery.find(img => {
              // img.uploadDate is stored as YYYY-MM-DD string format
              const imgDateString = img.uploadDate;
              const slotDateString = slotDate.toISOString().split('T')[0];
              return imgDateString === slotDateString;
            });
            
            if (uploadedImage) {
              // Image exists for this day slot
              adminGallery.push({
                ...uploadedImage,
                dayNumber: day,
                isMissing: false
              });
            } else {
              // Missing image for this day slot
              const isPastDay = slotDate < today;
              const isToday = slotDate.getFullYear() === today.getFullYear() &&
                             slotDate.getMonth() === today.getMonth() &&
                             slotDate.getDate() === today.getDate();
              const isFutureDay = slotDate > today;
              
              let missingMessage = '';
              if (isToday) {
                missingMessage = `Today is Day ${day} - User can upload their photo`;
              } else if (isPastDay) {
                missingMessage = `Day ${day} - User missed uploading on ${slotDate.toLocaleDateString()}`;
              } else if (isFutureDay) {
                missingMessage = `Day ${day} - Coming up on ${slotDate.toLocaleDateString()}`;
              } else {
                missingMessage = `Day ${day} - No photo uploaded`;
              }
              
              adminGallery.push({
                id: `missing-${day}`,
                imageUrl: '',
                uploadDate: slotDate.toISOString(),
                fileName: '',
                dayNumber: day,
                isMissing: true,
                missingMessage: missingMessage
              });
            }
          }
          
          setGallery(adminGallery);
        } else {
          toast({
            title: "User not found",
            description: "The requested user could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params, toast]);

  const updateUserStatus = async (newStatus: User['status']) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { status: newStatus });
      
      setUser({ ...user, status: newStatus });
      
      toast({
        title: "Status Updated",
        description: `User status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };



  const downloadUserData = async (format: 'csv' | 'json' | 'word') => {
    if (!user) return;
    
    // Clean, easy-to-understand JSON structure
    const userData = {
      "📋 USER_PROFILE": {
        "User_ID": user.id,
        "Full_Name": user.name,
        "Email_Address": user.email,
        "Account_Status": user.status.toUpperCase(),
        "Registration_Date": user.registrationDate,
        "Total_Photos_Uploaded": gallery.length
      },
      "📸 PHOTO_GALLERY": gallery.map((img, index) => ({
        "Photo_Number": index + 1,
        "Image_ID": img.id,
        "Original_File_Name": img.fileName,
        "Upload_Date": img.uploadDate,
        "Download_Link": img.imageUrl
      })),
      "ℹ️ EXPORT_INFO": {
        "Export_Date": new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString(),
        "Exported_By": "Admin Dashboard",
        "File_Format": "JSON",
        "Total_Photos": gallery.length
      }
    };
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'json') {
      content = JSON.stringify(userData, null, 2);
      filename = `${user.name.replace(/\s+/g, '_')}_Profile_and_Photos.json`;
      mimeType = 'application/json';
    } else if (format === 'word') {
      // Generate Word document
      const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } = await import('docx');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "USER PROFILE & PHOTO EXPORT",
                  bold: true,
                  size: 32,
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            
            // Export Info
            new Paragraph({
              children: [
                new TextRun({
                  text: `Export Date: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: "Exported By: Admin Dashboard",
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // User Information Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "USER INFORMATION",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),

            // User Info Table
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "User ID", bold: true })] })],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: user.id })] })],
                      width: { size: 70, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Full Name", bold: true })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: user.name })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Email Address", bold: true })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: user.email })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Account Status", bold: true })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: user.status.toUpperCase() })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Registration Date", bold: true })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: user.registrationDate })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Total Photos Uploaded", bold: true })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: gallery.length.toString() })] })],
                    }),
                  ],
                }),
              ],
            }),

            // Photo Gallery Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "PHOTO GALLERY",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 600, after: 200 },
            }),

            // Gallery Table
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                // Header row
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Photo #", bold: true })] })],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Original File Name", bold: true })] })],
                      width: { size: 35, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Upload Date", bold: true })] })],
                      width: { size: 25, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Download Link", bold: true })] })],
                      width: { size: 25, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Data rows
                ...gallery.map((img, index) => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString() })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: img.fileName })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: img.uploadDate })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Available on request", size: 18, italics: true })] })],
                      }),
                    ],
                  })
                ),
              ],
            }),

            // Summary Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "SUMMARY",
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 600, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Total Photos in Gallery: ${gallery.length}`,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `User Account Status: ${user.status.toUpperCase()}`,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Report Generated: ${new Date().toLocaleDateString()}`,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.name.replace(/\s+/g, '_')}_Profile_and_Photos.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: `User profile exported as Word document.`,
      });
      return;
    } else {
      // Much cleaner CSV format
      let csvContent = '';
      
      // Header with user summary
      csvContent += '===============================================\n';
      csvContent += '         USER PROFILE & PHOTO EXPORT\n';
      csvContent += '===============================================\n';
      csvContent += `Export Date:,${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
      csvContent += `Exported By:,Admin Dashboard\n`;
      csvContent += `Report Type:,Individual User Report\n`;
      csvContent += '\n';
      
      // User basic information (easy to read)
      csvContent += 'USER INFORMATION\n';
      csvContent += '----------------\n';
      csvContent += 'Field,Value\n';
      csvContent += `User ID,${user.id}\n`;
      csvContent += `Full Name,${user.name}\n`;
      csvContent += `Email Address,${user.email}\n`;
      csvContent += `Account Status,${user.status.toUpperCase()}\n`;
      csvContent += `Registration Date,${user.registrationDate}\n`;
      csvContent += `Total Photos Uploaded,${gallery.length}\n`;
      csvContent += '\n\n';
      
      // Images in a clean table format
      csvContent += 'PHOTO GALLERY\n';
      csvContent += '-------------\n';
      csvContent += 'Photo #,Image ID,Original File Name,Upload Date,Download Link\n';
      
      gallery.forEach((img, index) => {
        csvContent += `${index + 1},${img.id},${img.fileName},${img.uploadDate},${img.imageUrl}\n`;
      });
      
      csvContent += '\n';
      csvContent += '===============================================\n';
      csvContent += 'SUMMARY\n';
      csvContent += '-------\n';
      csvContent += `Total Photos in Gallery:,${gallery.length}\n`;
      csvContent += `User Account Status:,${user.status.toUpperCase()}\n`;
      csvContent += `Report Generated:,${new Date().toLocaleDateString()}\n`;
      csvContent += '===============================================\n';
      
      content = csvContent;
      filename = `${user.name.replace(/\s+/g, '_')}_Profile_and_Photos.csv`;
      mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete",
      description: `Complete user data with ${gallery.length} images exported as ${format.toUpperCase()}.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to users</span>
            </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline">User Details</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatarUrl || "https://placehold.co/64x64.png"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">User ID</span>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={statusVariant[user.status]} className={`${statusColor[user.status]} text-white hover:${statusColor[user.status]}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Registered</span>
                        <span>{user.registrationDate}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Button 
                       className="w-full bg-green-600 hover:bg-green-700 text-white"
                       onClick={() => updateUserStatus('approved')}
                       disabled={user.status === 'approved'}
                     >
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve User
                     </Button>
                     <Button 
                       variant="destructive" 
                       className="w-full"
                       onClick={() => updateUserStatus('disapproved')}
                       disabled={user.status === 'disapproved'}
                     >
                        <XCircle className="mr-2 h-4 w-4" /> Disapprove User
                     </Button>
                   </div>
                   <Separator />
                   <div className="space-y-2">
                     <Button variant="outline" className="w-full" onClick={() => downloadUserData('csv')}>
                        <FileText className="mr-2 h-4 w-4" /> Download Data as CSV
                     </Button>
                     <Button variant="outline" className="w-full" onClick={() => downloadUserData('json')}>
                        <FileJson className="mr-2 h-4 w-4" /> Download Data as JSON
                     </Button>
                     <Button variant="outline" className="w-full" onClick={() => downloadUserData('word')}>
                        <FileType className="mr-2 h-4 w-4" /> Download Data as Word
                     </Button>
                   </div>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{user.name}'s Photo Gallery</CardTitle>
              <CardDescription>All uploaded photos with actual dates and missing day indicators.</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryGrid 
                images={gallery} 
                {...GalleryPresets.adminUserDetail}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
