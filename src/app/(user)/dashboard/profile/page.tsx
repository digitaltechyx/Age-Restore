"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { compressImage, getFileSizeInMB, formatFileSize } from "@/lib/image-compression";
// Removed direct email import - now using API endpoint
import { Mail, Phone, MapPin, Calendar, AlertTriangle, Clock, CheckCircle, XCircle, RefreshCw, Upload, Camera, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const { user, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || "");
  const [gender, setGender] = useState(userProfile?.gender || "");
  const [age, setAge] = useState(userProfile?.age?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch user's refund requests
  const fetchRefundRequests = async () => {
    if (!user) return;
    
    setLoadingRefunds(true);
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('additionalData.userId', '==', user.uid),
        where('type', '==', 'refund_request'),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const requests: any[] = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      setRefundRequests(requests);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
    } finally {
      setLoadingRefunds(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRefundRequests();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !userProfile) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData: any = { name };
      
      // Add gender if selected
      if (gender) {
        updateData.gender = gender;
      }
      
      // Add age if provided and valid
      if (age && !isNaN(Number(age)) && Number(age) > 0) {
        updateData.age = Number(age);
      }
      
      await updateDoc(userRef, updateData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(userProfile?.name || "");
    setGender(userProfile?.gender || "");
    setAge(userProfile?.age?.toString() || "");
    setIsEditing(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user || !userProfile) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Show compression progress
      const originalSize = getFileSizeInMB(file);
      toast({
        title: "Compressing Image",
        description: `Original size: ${formatFileSize(file.size)}. Compressing...`,
      });

      // Compress the image
      const compressedFile = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        maxSizeInMB: 0.5 // 500KB max
      });

      const compressedSize = getFileSizeInMB(compressedFile);
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

      console.log(`Image compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${compressionRatio}% reduction)`);

      // Delete old avatar if exists
      if (userProfile.avatarUrl && userProfile.avatarUrl.includes('firebasestorage.googleapis.com')) {
        try {
          const oldAvatarRef = ref(storage, userProfile.avatarUrl);
          await deleteObject(oldAvatarRef);
        } catch (error) {
          console.log('Old avatar not found or already deleted');
        }
      }

      // Upload compressed avatar
      const fileName = `${user.uid}-${Date.now()}.jpg`;
      const avatarRef = ref(storage, `profile-pics/${fileName}`);
      await uploadBytes(avatarRef, compressedFile);
      const downloadURL = await getDownloadURL(avatarRef);

      // Update user profile with new avatar URL
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        avatarUrl: downloadURL,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Profile Picture Updated",
        description: `Image compressed and uploaded successfully! Size reduced by ${compressionRatio}%.`,
      });

      // Refresh the page to show new avatar
      window.location.reload();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        setStream(mediaStream);
        setShowCameraModal(true);
        
        // Set video source when modal opens
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        }, 100);
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to take a photo.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Camera Not Available",
        description: "Camera is not available on this device.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size to a reasonable resolution for profile pictures
        const maxSize = 800;
        let { videoWidth, videoHeight } = videoRef.current;
        
        // Scale down if too large
        if (videoWidth > maxSize || videoHeight > maxSize) {
          const ratio = Math.min(maxSize / videoWidth, maxSize / videoHeight);
          videoWidth = videoWidth * ratio;
          videoHeight = videoHeight * ratio;
        }
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        
        // Convert canvas to blob with good quality
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            await handleAvatarUpload(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleRefundRequest = async () => {
    if (!user || !userProfile) return;
    
    const reason = prompt("Please provide a reason for your refund request:");
    if (!reason || reason.trim() === '') {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for your refund request.",
        variant: "destructive",
      });
      return;
    }
    
    if (confirm("Are you sure you want to request a refund? This will notify administrators.")) {
      try {
        // Create notification directly in Firestore
        await addDoc(collection(db, 'notifications'), {
          type: 'refund_request',
          userEmail: user.email,
          userName: userProfile.name,
          message: `Refund request: ${reason.trim()}`,
          additionalData: {
            refundReason: reason.trim(),
            userId: user.uid
          },
          timestamp: new Date(),
          status: 'pending',
          adminNotified: false,
          refundStatus: 'pending'
        });

        toast({
          title: "Refund Request Submitted",
          description: "Your refund request has been submitted and administrators have been notified.",
        });
        
        // Refresh the refund requests list
        fetchRefundRequests();
      } catch (error) {
        console.error('Error creating refund request:', error);
        toast({
          title: "Request Failed",
          description: "Failed to send refund request. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Helper functions for status display
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'under_review':
        return 'Under Review';
      case 'accepted':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusMessage = (request: any) => {
    const status = request.refundStatus || 'pending';
    switch (status) {
      case 'pending':
        return 'Your refund request is pending admin review.';
      case 'under_review':
        return 'Your refund request is currently being reviewed by administrators.';
      case 'accepted':
        return 'Your refund request has been approved! You will receive your refund soon.';
      case 'rejected':
        return request.adminMessage ? 
          `Your refund request was rejected. Reason: ${request.adminMessage}` :
          'Your refund request was rejected.';
      default:
        return 'Status unknown.';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Personal Information</CardTitle>
          <CardDescription>Your account details and status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.avatarUrl || "https://placehold.co/80x80.png"} alt={userProfile.name} />
              <AvatarFallback className="text-lg">{userProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{userProfile.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={userProfile.status === 'approved' ? 'default' : 'secondary'} 
                       className={userProfile.status === 'approved' ? 'bg-green-500 text-white' : ''}>
                  {userProfile.status.charAt(0).toUpperCase() + userProfile.status.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              ) : (
                <span className="col-span-3">{userProfile.name}</span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Gender</Label>
              <div className="col-span-3 flex items-center gap-2">
                {isEditing ? (
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span>{userProfile.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : 'Not specified'}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Age</Label>
              <div className="col-span-3 flex items-center gap-2">
                {isEditing ? (
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    className="w-full"
                  />
                ) : (
                  <span>{userProfile.age ? `${userProfile.age} years old` : 'Not specified'}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Joined</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(userProfile.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {userProfile.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Your account is pending approval. You'll be able to upload photos once approved by an administrator.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refund Requests Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Refund Requests Status</CardTitle>
              <CardDescription>Track the status of your refund requests.</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRefundRequests}
              disabled={loadingRefunds}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingRefunds ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRefunds ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : refundRequests.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Refund Requests</h3>
              <p className="text-muted-foreground">
                You haven't submitted any refund requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {refundRequests.map((request) => {
                const status = request.refundStatus || 'pending';
                const formattedDate = request.timestamp?.toDate?.()?.toLocaleString() || 
                                     new Date(request.timestamp).toLocaleString();
                
                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <h4 className="font-medium">Refund Request</h4>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {formattedDate}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(status)} border`}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {getStatusMessage(request)}
                      </p>
                      
                      {request.additionalData?.refundReason && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h5 className="text-sm font-medium mb-1">Your Reason:</h5>
                          <p className="text-sm italic">"{request.additionalData.refundReason}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Request Refund</h4>
              <p className="text-sm text-muted-foreground">Request a refund from administrators.</p>
            </div>
            <Button variant="outline" onClick={handleRefundRequest}>
              Request Refund
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">Sign out from your current session.</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
          
        </CardContent>
      </Card>

      {/* Camera Preview Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Take Profile Photo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopCamera}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={capturePhoto}
                disabled={isUploadingAvatar}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
              <Button
                variant="outline"
                onClick={stopCamera}
                disabled={isUploadingAvatar}
                className="flex-1"
              >
                Cancel
            </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              Position your face in the center of the frame and click "Capture Photo"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}