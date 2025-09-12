"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageModal } from "@/components/image-modal";

interface GalleryImage {
  id: string;
  imageUrl: string;
  uploadDate: string;
  fileName?: string;
  moodText?: string | null;
  moodEmoji?: string | null;
  dayNumber?: number;
  isMissing?: boolean;
  missingMessage?: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  className?: string;
  gridCols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  showDate?: boolean;
  showFileName?: boolean;
  showMoodText?: boolean;
  showMoodEmoji?: boolean;
}

export function GalleryGrid({
  images,
  className = "",
  gridCols = { default: 2, sm: 2, md: 3, lg: 4, xl: 5 },
  aspectRatio = 'square',
  showDate = true,
  showFileName = false,
  showMoodText = false,
  showMoodEmoji = true
}: GalleryGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (image: GalleryImage) => {
    if (image.isMissing) return;
    
    // Find the index of this image in the non-missing images array
    const nonMissingImages = images.filter(img => !img.isMissing);
    const modalIndex = nonMissingImages.findIndex(img => img.id === image.id);
    
    if (modalIndex !== -1) {
      setCurrentImageIndex(modalIndex);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No images found.</p>
        <p>Start by uploading your first photo!</p>
      </div>
    );
  }

  // Build grid classes based on props
  const gridClasses = [
    'grid',
    'gap-4',
    gridCols.default ? `grid-cols-${gridCols.default}` : '',
    gridCols.sm ? `sm:grid-cols-${gridCols.sm}` : '',
    gridCols.md ? `md:grid-cols-${gridCols.md}` : '',
    gridCols.lg ? `lg:grid-cols-${gridCols.lg}` : '',
    gridCols.xl ? `xl:grid-cols-${gridCols.xl}` : '',
    className
  ].filter(Boolean).join(' ');

  // Aspect ratio classes
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  return (
    <>
      <div className={gridClasses}>
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className={`group relative overflow-hidden rounded-lg bg-gray-100 ${aspectClasses[aspectRatio]} ${image.isMissing ? 'cursor-default' : 'cursor-pointer hover:shadow-lg'} transition-shadow duration-300`}
            onClick={() => handleImageClick(image)}
          >
          {image.isMissing ? (
            // Missing image placeholder
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-500 p-4">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-medium text-center">Day {image.dayNumber}</p>
              <p className="text-xs text-center mt-1 opacity-75">
                {image.missingMessage || 'Missing photo'}
              </p>
            </div>
          ) : (
            // Regular image
            <>
              <Image
                src={image.imageUrl}
                alt={`Photo from ${image.uploadDate}`}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              
              {/* Emoji Badge - Always visible */}
              {showMoodEmoji && image.moodEmoji && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <span className="text-2xl">{image.moodEmoji}</span>
                </div>
              )}

              {/* Overlay with image info */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                {/* Click indicator */}
                <div className="flex justify-center pt-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                    Click to view
                  </div>
                </div>
                
                {/* Image info at bottom */}
                <div className="flex flex-col">
                {showMoodText && image.moodText && (
                  <p className="text-white text-xs opacity-90 mb-2 line-clamp-2">
                    "{image.moodText}"
                  </p>
                )}
                {showDate && (
                  <p className="text-white text-sm font-medium">
                    Day {image.dayNumber || 'N/A'}
                  </p>
                )}
                {showFileName && image.fileName && (
                  <p className="text-white text-xs opacity-90 truncate">
                    {image.fileName}
                  </p>
                )}
                </div>
              </div>
            </>
          )}
          </div>
        ))}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={images.filter(img => !img.isMissing)}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
    </>
  );
}

// Preset configurations for common use cases
export const GalleryPresets = {
  // User dashboard gallery
  userDashboard: {
    gridCols: { default: 2, sm: 2, md: 3, lg: 4, xl: 5 },
    aspectRatio: 'square' as const,
    showDate: true,
    showFileName: false,
    showMoodText: true,
    showMoodEmoji: true
  },
  
  // Admin user detail gallery
  adminUserDetail: {
    gridCols: { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
    aspectRatio: 'square' as const,
    showDate: true,
    showFileName: true,
    showMoodText: true,
    showMoodEmoji: true
  },
  
  // Compact gallery
  compact: {
    gridCols: { default: 2, sm: 3, md: 4, lg: 6, xl: 8 },
    aspectRatio: 'square' as const,
    showDate: false,
    showFileName: false,
    showMoodText: false,
    showMoodEmoji: true
  },
  
  // Detailed gallery with filenames
  detailed: {
    gridCols: { default: 1, sm: 2, md: 3 },
    aspectRatio: 'square' as const,
    showDate: true,
    showFileName: true,
    showMoodText: true,
    showMoodEmoji: true
  }
};
