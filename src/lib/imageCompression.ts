import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  success: boolean;
  error?: string;
}

/**
 * Compress an image file to meet size requirements
 * @param file - The original image file
 * @param options - Compression options
 * @returns Promise with compression result
 */
export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1, // 1MB limit
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    quality: 0.8, // 80% quality
    ...options
  };

  try {
    const originalSize = file.size;
    
    // Compress the image
    const compressedFile = await imageCompression(file, defaultOptions);
    
    const compressedSize = compressedFile.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
    
    return {
      compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
      success: true
    };
  } catch (error) {
    console.error('Image compression error:', error);
    return {
      compressedFile: file, // Return original file if compression fails
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Compression failed'
    };
  }
}

/**
 * Get optimal compression options based on file size
 * @param file - The image file
 * @returns Compression options
 */
export function getOptimalCompressionOptions(file: File): Partial<CompressionOptions> {
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB <= 0.5) {
    // Small file, light compression
    return {
      maxSizeMB: 0.8,
      quality: 0.9,
      maxWidthOrHeight: 2048
    };
  } else if (fileSizeMB <= 2) {
    // Medium file, moderate compression
    return {
      maxSizeMB: 1,
      quality: 0.8,
      maxWidthOrHeight: 1920
    };
  } else if (fileSizeMB <= 5) {
    // Large file, aggressive compression
    return {
      maxSizeMB: 1,
      quality: 0.7,
      maxWidthOrHeight: 1600
    };
  } else {
    // Very large file, maximum compression
    return {
      maxSizeMB: 1,
      quality: 0.6,
      maxWidthOrHeight: 1280
    };
  }
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file is a valid image type
 * @param file - The file to check
 * @returns True if valid image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type.toLowerCase());
}

/**
 * Get compression preview information
 * @param file - The original file
 * @param compressedFile - The compressed file
 * @returns Preview information
 */
export function getCompressionPreview(file: File, compressedFile: File) {
  const originalSize = file.size;
  const compressedSize = compressedFile.size;
  const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
  
  return {
    originalSize: formatFileSize(originalSize),
    compressedSize: formatFileSize(compressedSize),
    compressionRatio: Math.round(compressionRatio),
    sizeReduction: formatFileSize(originalSize - compressedSize)
  };
}

