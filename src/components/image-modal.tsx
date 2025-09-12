"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  imageUrl: string;
  uploadDate: string;
  fileName?: string;
  moodText?: string | null;
  moodEmoji?: string | null;
  dayNumber?: number;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageModal({ isOpen, onClose, images, currentIndex, onIndexChange }: ImageModalProps) {

  const currentImage = images[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };


  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-headline">
              Day {currentImage.dayNumber || 'Unknown'}
              {currentImage.moodEmoji && (
                <span className="ml-2 text-2xl">{currentImage.moodEmoji}</span>
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="relative flex-1 min-h-0">
          {/* Image Container */}
          <div className="relative w-full h-[60vh] bg-black flex items-center justify-center">
            {currentImage.imageUrl ? (
              <Image
                src={currentImage.imageUrl}
                alt={`Day ${currentImage.dayNumber || 'Unknown'} - ${currentImage.moodText || 'Journey photo'}`}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex items-center justify-center text-white text-lg">
                Image not available
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                )}
                {currentIndex < images.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Image Info */}
          <div className="p-6 space-y-4">
            {currentImage.moodText && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">How I felt:</p>
                <p className="text-base italic">"{currentImage.moodText}"</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Uploaded: {new Date(currentImage.uploadDate).toLocaleDateString()}
              </Badge>
              {currentImage.fileName && (
                <Badge variant="outline">
                  {currentImage.fileName}
                </Badge>
              )}
              <Badge variant="outline">
                {currentIndex + 1} of {images.length}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

