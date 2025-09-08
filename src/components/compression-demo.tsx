"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Zap, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { 
  compressImage, 
  getOptimalCompressionOptions, 
  formatFileSize, 
  isValidImageType,
  type CompressionResult 
} from "@/lib/imageCompression";

export function CompressionDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      if (!isValidImageType(file)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
        return;
      }
      
      setSelectedFile(file);
      setCompressionResult(null);
      await compressFile(file);
    }
  };

  const compressFile = async (file: File) => {
    setIsCompressing(true);
    
    try {
      const options = getOptimalCompressionOptions(file);
      const result = await compressImage(file, options);
      setCompressionResult(result);
    } catch (error) {
      console.error('Compression error:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRecompress = async () => {
    if (selectedFile) {
      await compressFile(selectedFile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Image Compression Demo</CardTitle>
          <CardDescription>
            Test the image compression functionality. Upload any image to see how it gets compressed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="demo-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
            >
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> an image
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, or WebP</p>
              <Input 
                id="demo-file" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          {selectedFile && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected File: {selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                Original Size: {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}

          {isCompressing && (
            <div className="space-y-2">
                             <div className="flex items-center gap-2">
                 <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
                 <p className="text-sm text-blue-600">Compressing image...</p>
               </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {compressionResult && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="font-headline text-green-800 flex items-center gap-2">
                  {compressionResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  Compression {compressionResult.success ? 'Successful' : 'Failed'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Original Size</p>
                    <p className="font-medium">{formatFileSize(compressionResult.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Compressed Size</p>
                    <p className="font-medium text-green-600">{formatFileSize(compressionResult.compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size Reduction</p>
                    <p className="font-medium text-green-600">{Math.round(compressionResult.compressionRatio)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Space Saved</p>
                    <p className="font-medium text-green-600">
                      {formatFileSize(compressionResult.originalSize - compressionResult.compressedSize)}
                    </p>
                  </div>
                </div>

                {compressionResult.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">Error: {compressionResult.error}</p>
                  </div>
                )}

                                 <Button onClick={handleRecompress} variant="outline" className="w-full">
                   <Zap className="mr-2 h-4 w-4" />
                   Recompress with Different Settings
                 </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
