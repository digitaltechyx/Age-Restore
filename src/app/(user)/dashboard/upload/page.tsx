"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Zap, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  compressImage, 
  getFileSizeInMB, 
  formatFileSize,
  isValidImageType
} from "@/lib/image-compression";

export default function UploadPage() {
  const [isUploadedToday, setIsUploadedToday] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null);
  const [totalImages, setTotalImages] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const router = useRouter();
  
  const totalDays = 30;
  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);

  useEffect(() => {
    if (!user || !userProfile) return;
    
    const checkCurrentDayUpload = async () => {
      try {
        // Get account approval date - this is the FIXED start date
        let journeyStartDate: Date;
        
        if (userProfile?.approvedAt) {
          // New users: use approval date
          journeyStartDate = new Date(userProfile.approvedAt);
        } else {
          // For existing users without approvedAt, fetch first upload date
        const imagesRef = collection(db, 'images');
        const q = query(
          imagesRef,
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const firstUpload = querySnapshot.docs[0].data();
            journeyStartDate = new Date(firstUpload.uploadDate);
          } else {
            // No uploads yet, use registration date or today
            journeyStartDate = userProfile?.registrationDate ? new Date(userProfile.registrationDate) : new Date();
          }
        }
        
        // Calculate current day based on journey start date (same logic as gallery)
        const todayDate = new Date();
        const todayDateString = todayDate.toISOString().split('T')[0];
        
        // Find which day slot today corresponds to
        let currentDayNumber = 1;
        for (let day = 1; day <= 30; day++) {
          const slotDate = new Date(journeyStartDate);
          slotDate.setDate(journeyStartDate.getDate() + (day - 1));
          const slotDateString = slotDate.toISOString().split('T')[0];
          
          if (slotDateString === todayDateString) {
            currentDayNumber = day;
            break;
          }
        }
        
        setCurrentDay(currentDayNumber);
        
        
        // Calculate the slot date for the current day
        const slotDate = new Date(journeyStartDate);
        slotDate.setDate(journeyStartDate.getDate() + (currentDayNumber - 1));
        const slotDateString = slotDate.toISOString().split('T')[0];
        
        // Check if user has already uploaded for this specific day slot
        const checkImagesRef = collection(db, 'images');
        const checkQ = query(
          checkImagesRef,
          where('userId', '==', user.uid),
          where('uploadDate', '==', slotDateString)
        );
        const checkQuerySnapshot = await getDocs(checkQ);
        const hasUploadedToday = !checkQuerySnapshot.empty;
        setIsUploadedToday(hasUploadedToday);
        
        // Debug logging
        console.log('🔍 Upload Status Check:');
        console.log('Today Date String:', todayDateString);
        console.log('Journey Start Date:', journeyStartDate.toISOString().split('T')[0]);
        console.log('Current Day:', currentDayNumber);
        console.log('Slot Date String:', slotDateString);
        console.log('Has Uploaded Today:', hasUploadedToday);
        console.log('Query Results Count:', checkQuerySnapshot.size);
        
        // Get total images count
        const allImagesQuery = query(
          checkImagesRef,
          where('userId', '==', user.uid)
        );
        const allImagesSnapshot = await getDocs(allImagesQuery);
        setTotalImages(allImagesSnapshot.size);
        
      } catch (error) {
        console.error('Error checking current day upload:', error);
      }
    };

    checkCurrentDayUpload();
  }, [user, userProfile]);

  // Refresh upload status when component mounts or when currentDay changes
  useEffect(() => {
    if (user && userProfile) {
      const checkCurrentDayUpload = async () => {
        try {
          // Get account approval date - this is the FIXED start date
          let journeyStartDate: Date;
          
          if (userProfile?.approvedAt) {
            // New users: use approval date
            journeyStartDate = new Date(userProfile.approvedAt);
          } else {
            // For existing users without approvedAt, fetch first upload date
            const imagesRef = collection(db, 'images');
            const q = query(
              imagesRef,
              where('userId', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const firstUpload = querySnapshot.docs[0].data();
              journeyStartDate = new Date(firstUpload.uploadDate);
            } else {
              // No uploads yet, use registration date or today
              journeyStartDate = userProfile?.registrationDate ? new Date(userProfile.registrationDate) : new Date();
            }
          }
          
          // Calculate current day based on journey start date (same logic as gallery)
          const todayDate = new Date();
          const todayDateString = todayDate.toISOString().split('T')[0];
          
          // Find which day slot today corresponds to
          let currentDayNumber = 1;
          for (let day = 1; day <= 30; day++) {
            const slotDate = new Date(journeyStartDate);
            slotDate.setDate(journeyStartDate.getDate() + (day - 1));
            const slotDateString = slotDate.toISOString().split('T')[0];
            
            if (slotDateString === todayDateString) {
              currentDayNumber = day;
              break;
            }
          }
          
          setCurrentDay(currentDayNumber);
          
          // Calculate the slot date for the current day
          const slotDate = new Date(journeyStartDate);
          slotDate.setDate(journeyStartDate.getDate() + (currentDayNumber - 1));
          const slotDateString = slotDate.toISOString().split('T')[0];
          
          // Check if user has already uploaded for this specific day slot
          const checkImagesRef = collection(db, 'images');
          const checkQ = query(
            checkImagesRef,
            where('userId', '==', user.uid),
            where('uploadDate', '==', slotDateString)
          );
          const checkQuerySnapshot = await getDocs(checkQ);
          const hasUploadedToday = !checkQuerySnapshot.empty;
          setIsUploadedToday(hasUploadedToday);
          
          // Debug logging
          console.log('🔄 Upload Status Refresh:');
          console.log('Today Date String:', todayDateString);
          console.log('Journey Start Date:', journeyStartDate.toISOString().split('T')[0]);
          console.log('Current Day:', currentDayNumber);
          console.log('Slot Date String:', slotDateString);
          console.log('Has Uploaded Today:', hasUploadedToday);
          console.log('Query Results Count:', checkQuerySnapshot.size);
          
        } catch (error) {
          console.error('Error refreshing upload status:', error);
        }
      };
      
      checkCurrentDayUpload();
    }
  }, [currentDay]); // Refresh when currentDay changes

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Validate file type
      if (!isValidImageType(file)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file (JPEG, PNG, GIF, or WebP).",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setCompressedFile(null);
      setCompressionStats(null);
      
      // Auto-compress the image
      await compressSelectedFile(file);
    }
  };

  const handleCameraClick = async () => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback to file input with camera capture
        const cameraInput = document.createElement('input');
        cameraInput.type = 'file';
        cameraInput.accept = 'image/*';
        cameraInput.capture = 'environment';
        cameraInput.style.display = 'none';
        
        cameraInput.onchange = async (event) => {
          const target = event.target as HTMLInputElement;
          if (target.files && target.files.length > 0) {
            const file = target.files[0];
            await processSelectedFile(file);
          }
        };
        
        document.body.appendChild(cameraInput);
        cameraInput.click();
        document.body.removeChild(cameraInput);
        return;
      }

      // Access camera and show preview modal
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer rear camera on mobile
        } 
      });
      
      setCameraStream(stream);
      setShowCameraModal(true);
      
    } catch (error) {
      console.error('Camera access error:', error);
      
      // Fallback to file input
      const cameraInput = document.createElement('input');
      cameraInput.type = 'file';
      cameraInput.accept = 'image/*';
      cameraInput.capture = 'environment';
      cameraInput.style.display = 'none';
      
      cameraInput.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          await processSelectedFile(file);
        }
      };
      
      document.body.appendChild(cameraInput);
      cameraInput.click();
      document.body.removeChild(cameraInput);
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (video && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Stop the camera stream
          if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
          }
          
          // Close modal
          setShowCameraModal(false);
          
          // Create a file from the blob
          const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
          await processSelectedFile(file);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const processSelectedFile = async (file: File) => {
    // Validate file type
    if (!isValidImageType(file)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPEG, PNG, GIF, or WebP).",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setCompressedFile(null);
    setCompressionStats(null);
    
    // Auto-compress the image
    await compressSelectedFile(file);
  };

  const compressSelectedFile = async (file: File) => {
    setIsCompressing(true);
    
    try {
      // Compress the image using our new utility
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        maxSizeInMB: 1.0 // 1MB max for daily photos
      });
      
      const originalSize = file.size;
      const compressedSize = compressedFile.size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
      // Update state
      setCompressionStats({
        originalSize,
        compressedSize,
        compressionRatio
      });
      setCompressedFile(compressedFile);
      
      toast({
        title: "Image Compressed",
        description: `File size reduced by ${Math.round(compressionRatio)}% (${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)})`,
      });
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression Error",
        description: "Failed to compress image. Using original file.",
        variant: "destructive",
      });
      setCompressedFile(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a picture to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      return;
    }

    if (userProfile?.status !== 'approved') {
      toast({
        title: "Account not approved",
        description: "Your account must be approved before you can upload images.",
        variant: "destructive",
      });
      return;
    }

    if (currentDay > 30) {
      toast({
        title: "Journey completed",
        description: "Congratulations! You have completed your 30-day journey.",
        variant: "destructive",
      });
      return;
    }

    // Use compressed file if available, otherwise use original
    const fileToUpload = compressedFile || selectedFile;

    // Check file size (1MB = 1,048,576 bytes)
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (fileToUpload.size > maxSizeInBytes) {
      const fileSizeInMB = (fileToUpload.size / 1024 / 1024).toFixed(2);
      toast({
        title: "File Too Large",
        description: `Image size is ${fileSizeInMB}MB. Maximum allowed size is 1MB. Please try a different image.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Calculate the slot date for the current day (not today's date)
      let journeyStartDate: Date;
      
      if (userProfile?.approvedAt) {
        // New users: use approval date
        journeyStartDate = new Date(userProfile.approvedAt);
      } else {
        // For existing users without approvedAt, fetch first upload date
        const imagesRef = collection(db, 'images');
        const q = query(
          imagesRef,
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const firstUpload = querySnapshot.docs[0].data();
          journeyStartDate = new Date(firstUpload.uploadDate);
        } else {
          // No uploads yet, use registration date or today
          journeyStartDate = userProfile?.registrationDate ? new Date(userProfile.registrationDate) : new Date();
        }
      }
      
      const slotDate = new Date(journeyStartDate);
      slotDate.setDate(journeyStartDate.getDate() + (currentDay - 1));
      const slotDateString = slotDate.toISOString().split('T')[0];
      
      const fileName = `${user.uid}/${slotDateString}_${Date.now()}_${fileToUpload.name}`;
      const storageRef = ref(storage, `images/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          toast({
            title: "Upload Failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          setUploadProgress(null);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save image metadata to Firestore with the slot date
            await addDoc(collection(db, 'images'), {
              userId: user.uid,
              imageUrl: downloadURL,
              uploadDate: slotDateString, // Use slot date, not today's date
              createdAt: Timestamp.now(),
              fileName: fileToUpload.name,
              filePath: fileName,
              moodEmoji: selectedEmoji
            });

            setIsUploadedToday(true);
            setTotalImages(prev => prev + 1);
            setSelectedFile(null);
            setCompressedFile(null);
            setCompressionStats(null);
            setSelectedEmoji(null);
            
            // Debug logging
            console.log('✅ Upload Success - State Updated:');
            console.log('isUploadedToday set to:', true);
            console.log('Slot Date String:', slotDateString);
            
            const compressionMessage = compressionStats ? 
              ` (compressed from ${formatFileSize(compressionStats.originalSize)})` : '';
            
            toast({
              title: "Upload Successful!",
              description: `Photo for Day ${currentDay} has been uploaded${compressionMessage}.`,
            });

            // Reset file input
            const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
          } catch (error) {
            console.error('Error saving to Firestore:', error);
            toast({
              title: "Upload Error",
              description: "Image uploaded but failed to save metadata.",
              variant: "destructive",
            });
          } finally {
            setIsUploading(false);
            setUploadProgress(null);
          }
        }
      );

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to start upload. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline">Upload Your Photo</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Capture your moment for today. You can upload one picture per day.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your 30-Day Progress</CardTitle>
          <CardDescription>Day {currentDay} of {totalDays}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {compressionStats && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="font-headline text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Image Optimized
            </CardTitle>
            <CardDescription className="text-green-700">
              Your image has been automatically compressed for optimal upload.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Original Size</p>
                <p className="font-medium">{formatFileSize(compressionStats.originalSize)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Compressed Size</p>
                <p className="font-medium text-green-600">{formatFileSize(compressionStats.compressedSize)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size Reduction</p>
                <p className="font-medium text-green-600">{Math.round(compressionStats.compressionRatio)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Space Saved</p>
                <p className="font-medium text-green-600">{formatFileSize(compressionStats.originalSize - compressionStats.compressedSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {isUploadedToday ? "Today's Photo Uploaded" : "Upload for Today"}
          </CardTitle>
          <CardDescription>
            {isUploadedToday
              ? "Great job! Come back tomorrow to upload your next photo."
              : "Select a high-quality image to add to your gallery. Images are automatically compressed to meet the 1MB limit."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isUploadedToday ? (
            // Show success message when already uploaded
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Photo Uploaded Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                You've already uploaded your photo for Day {currentDay}. 
                Come back tomorrow to continue your journey!
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/dashboard">View Gallery</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          ) : (
            // Show upload interface when not uploaded
            <>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF, or WebP (Maximum file size: 1MB)</p>
                {selectedFile && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-primary">{selectedFile.name}</p>
                        <div className="space-y-1">
                          <p className={`text-xs ${(selectedFile.size / 1024 / 1024) > 1 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            Original: {formatFileSize(selectedFile.size)}
                      {(selectedFile.size / 1024 / 1024) > 1 && ' (Too large!)'}
                    </p>
                          {compressionStats && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <p className="text-xs text-green-600">
                                Compressed: {formatFileSize(compressionStats.compressedSize)} 
                                ({Math.round(compressionStats.compressionRatio)}% smaller)
                              </p>
                            </div>
                          )}
                          {isCompressing && (
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-blue-500 animate-pulse" />
                              <p className="text-xs text-blue-600">Compressing image...</p>
                            </div>
                          )}
                        </div>
                  </div>
                )}
              </div>
                  <Input 
                    id="dropzone-file" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
            </label>
          </div>

              {/* Camera Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCameraClick}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo with Camera
                </Button>
              </div>
            </>
          )}

          {/* Simple Emoji Picker - Only show when not uploaded */}
          {!isUploadedToday && (
            <div className="space-y-3">
              <label className="text-sm font-medium">How are you feeling today? (Optional)</label>
              <div className="flex gap-2 justify-center">
                {['😊', '😢', '😴', '😤', '😍'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(selectedEmoji === emoji ? null : emoji)}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedEmoji === emoji
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {selectedEmoji && (
                <p className="text-sm text-muted-foreground text-center">
                  Selected: {selectedEmoji}
                </p>
              )}
            </div>
          )}

          {/* Upload Progress and Button - Only show when not uploaded */}
          {!isUploadedToday && (
            <>
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                    <Progress value={uploadProgress} />
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                className="w-full" 
                disabled={isUploading || isCompressing || !selectedFile}
              >
                {isCompressing ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" />
                    Compressing...
                  </>
                ) : isUploading ? (
                  "Uploading..."
                ) : (
                  "Upload Picture"
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Camera Preview Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Take Photo</h3>
              <button
                onClick={closeCameraModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="relative">
              <video
                id="camera-video"
                autoPlay
                playsInline
                muted
                className="w-full h-48 sm:h-64 bg-gray-200 rounded-lg object-cover"
                ref={(video) => {
                  if (video && cameraStream) {
                    video.srcObject = cameraStream;
                  }
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-4 border-white rounded-lg w-32 h-32 sm:w-48 sm:h-48 opacity-50"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-6">
              <Button
                onClick={closeCameraModal}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Camera className="h-4 w-4" />
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}