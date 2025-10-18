/**
 * Real image conversion utilities using Canvas API
 */

export interface ConversionOptions {
  quality?: number; // 0-1 for JPEG quality
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export class ImageConverter {
  /**
   * Convert image to specified format
   */
  static async convertImage(
    file: File, 
    targetFormat: string, 
    options: ConversionOptions = {}
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Set canvas dimensions
          let { width, height } = options;
          
          if (!width && !height) {
            width = img.width;
            height = img.height;
          } else if (width && !height && options.maintainAspectRatio) {
            height = (img.height * width) / img.width;
          } else if (height && !width && options.maintainAspectRatio) {
            width = (img.width * height) / img.height;
          }

          canvas.width = width || img.width;
          canvas.height = height || img.height;

          // Clear canvas and draw image
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert to target format
          const mimeType = this.getMimeType(targetFormat);
          const quality = options.quality || 0.9;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image'));
              }
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Compress image with quality control
   */
  static async compressImage(
    file: File, 
    quality: number = 0.8, 
    maxWidth?: number, 
    maxHeight?: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Resize if max dimensions specified
          if (maxWidth && width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (maxHeight && height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Resize image to specific dimensions
   */
  static async resizeImage(
    file: File, 
    width: number, 
    height: number, 
    mode: 'fit' | 'fill' | 'cover' = 'fit'
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          const originalWidth = img.width;
          const originalHeight = img.height;
          
          canvas.width = width;
          canvas.height = height;

          let drawWidth = width;
          let drawHeight = height;
          let offsetX = 0;
          let offsetY = 0;

          if (mode === 'fit') {
            const scale = Math.min(width / originalWidth, height / originalHeight);
            drawWidth = originalWidth * scale;
            drawHeight = originalHeight * scale;
            offsetX = (width - drawWidth) / 2;
            offsetY = (height - drawHeight) / 2;
          } else if (mode === 'cover') {
            const scale = Math.max(width / originalWidth, height / originalHeight);
            drawWidth = originalWidth * scale;
            drawHeight = originalHeight * scale;
            offsetX = (width - drawWidth) / 2;
            offsetY = (height - drawHeight) / 2;
          }

          // Fill background for fit mode
          if (mode === 'fit') {
            ctx!.fillStyle = '#FFFFFF';
            ctx!.fillRect(0, 0, width, height);
          }

          ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to resize image'));
              }
            },
            'image/jpeg',
            0.9
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get MIME type for format
   */
  private static getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      bmp: 'image/bmp'
    };
    
    return mimeTypes[format.toLowerCase()] || 'image/jpeg';
  }

  /**
   * Get file extension for MIME type
   */
  static getExtensionForMimeType(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/bmp': 'bmp'
    };
    
    return extensions[mimeType] || 'jpg';
  }

  /**
   * Validate if file is an image
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/') || 
           /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name);
  }
}