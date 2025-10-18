import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

export const imageResizeRouter = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Resize image endpoint
imageResizeRouter.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No image file provided' }
      });
    }

    const { width, height, quality = 80, format = 'jpeg', maintainAspectRatio = true } = req.body;

    if (!width && !height) {
      return res.status(400).json({
        error: { code: 'NO_DIMENSIONS', message: 'Width or height must be specified' }
      });
    }

    // Parse dimensions
    const targetWidth = width ? parseInt(width) : null;
    const targetHeight = height ? parseInt(height) : null;
    const targetQuality = Math.min(100, Math.max(1, parseInt(quality)));

    // Create Sharp instance
    let sharpInstance = sharp(req.file.buffer);

    // Get original image metadata
    const metadata = await sharpInstance.metadata();

    // Resize image
    if (maintainAspectRatio === 'true' || maintainAspectRatio === true) {
      sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    } else {
      sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
        fit: 'fill'
      });
    }

    // Set output format and quality
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        sharpInstance = sharpInstance.jpeg({ quality: targetQuality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: targetQuality });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: targetQuality });
        break;
      default:
        sharpInstance = sharpInstance.jpeg({ quality: targetQuality });
    }

    // Process the image
    const processedBuffer = await sharpInstance.toBuffer();
    const processedMetadata = await sharp(processedBuffer).metadata();

    // Set response headers
    res.set({
      'Content-Type': `image/${format}`,
      'Content-Length': processedBuffer.length.toString(),
      'X-Original-Width': metadata.width?.toString() || '0',
      'X-Original-Height': metadata.height?.toString() || '0',
      'X-Processed-Width': processedMetadata.width?.toString() || '0',
      'X-Processed-Height': processedMetadata.height?.toString() || '0',
      'X-Original-Size': req.file.size.toString(),
      'X-Processed-Size': processedBuffer.length.toString()
    });

    // Send the processed image
    res.send(processedBuffer);

  } catch (error) {
    console.error('Image resize error:', error);
    res.status(500).json({
      error: { 
        code: 'RESIZE_ERROR', 
        message: 'Failed to resize image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

// Get image metadata endpoint
imageResizeRouter.post('/metadata', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No image file provided' }
      });
    }

    const metadata = await sharp(req.file.buffer).metadata();
    
    res.json({
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: req.file.size,
        channels: metadata.channels,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        space: metadata.space
      }
    });

  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({
      error: { 
        code: 'METADATA_ERROR', 
        message: 'Failed to get image metadata' 
      }
    });
  }
});

// Batch resize endpoint (premium feature)
imageResizeRouter.post('/batch-resize', authenticateToken, upload.array('images', 10), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    // Check if user has premium access
    if (!req.user.subscriptionStatus.includes('premium')) {
      return res.status(403).json({
        error: { code: 'PREMIUM_REQUIRED', message: 'Batch resize requires premium subscription' }
      });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        error: { code: 'NO_FILES', message: 'No image files provided' }
      });
    }

    const { width, height, quality = 80, format = 'jpeg', maintainAspectRatio = true } = req.body;

    const results = [];

    for (const file of files) {
      try {
        const targetWidth = width ? parseInt(width) : null;
        const targetHeight = height ? parseInt(height) : null;
        const targetQuality = Math.min(100, Math.max(1, parseInt(quality)));

        let sharpInstance = sharp(file.buffer);

        // Resize
        if (maintainAspectRatio === 'true' || maintainAspectRatio === true) {
          sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
            fit: 'inside',
            withoutEnlargement: true
          });
        } else {
          sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
            fit: 'fill'
          });
        }

        // Set format
        switch (format.toLowerCase()) {
          case 'jpeg':
          case 'jpg':
            sharpInstance = sharpInstance.jpeg({ quality: targetQuality });
            break;
          case 'png':
            sharpInstance = sharpInstance.png({ quality: targetQuality });
            break;
          case 'webp':
            sharpInstance = sharpInstance.webp({ quality: targetQuality });
            break;
        }

        const processedBuffer = await sharpInstance.toBuffer();
        const processedMetadata = await sharp(processedBuffer).metadata();

        results.push({
          originalName: file.originalname,
          originalSize: file.size,
          processedSize: processedBuffer.length,
          width: processedMetadata.width,
          height: processedMetadata.height,
          data: processedBuffer.toString('base64')
        });

      } catch (error) {
        results.push({
          originalName: file.originalname,
          error: error instanceof Error ? error.message : 'Processing failed'
        });
      }
    }

    res.json({ results });

  } catch (error) {
    console.error('Batch resize error:', error);
    res.status(500).json({
      error: { 
        code: 'BATCH_RESIZE_ERROR', 
        message: 'Failed to process batch resize' 
      }
    });
  }
});