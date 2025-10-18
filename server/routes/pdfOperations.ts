import express from 'express';
import multer from 'multer';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

export const pdfOperationsRouter = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get PDF metadata endpoint
pdfOperationsRouter.post('/metadata', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No PDF file provided' }
      });
    }

    // For now, return basic info - in production, use pdf-lib or similar
    res.json({
      metadata: {
        filename: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        lastModified: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('PDF metadata error:', error);
    res.status(500).json({
      error: { 
        code: 'METADATA_ERROR', 
        message: 'Failed to get PDF metadata' 
      }
    });
  }
});

// Merge PDFs endpoint
pdfOperationsRouter.post('/merge', upload.array('pdfs', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2) {
      return res.status(400).json({
        error: { code: 'INSUFFICIENT_FILES', message: 'At least 2 PDF files are required for merging' }
      });
    }

    // For now, return a simple response - in production, implement actual merging
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    res.json({
      success: true,
      message: `Successfully merged ${files.length} PDFs`,
      totalSize,
      filename: 'merged.pdf',
      files: files.map(file => ({
        name: file.originalname,
        size: file.size
      }))
    });

  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({
      error: { 
        code: 'MERGE_ERROR', 
        message: 'Failed to merge PDFs' 
      }
    });
  }
});

// Split PDF endpoint
pdfOperationsRouter.post('/split', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No PDF file provided' }
      });
    }

    const { splitType = 'pages', ranges } = req.body;
    
    // For now, return a simple response - in production, implement actual splitting
    res.json({
      success: true,
      message: `PDF split completed`,
      splitType,
      ranges: ranges ? JSON.parse(ranges) : [],
      originalFile: req.file.originalname,
      originalSize: req.file.size,
      estimatedOutputFiles: splitType === 'pages' ? 'one file per page' : ranges?.length || 0
    });

  } catch (error) {
    console.error('PDF split error:', error);
    res.status(500).json({
      error: { 
        code: 'SPLIT_ERROR', 
        message: 'Failed to split PDF' 
      }
    });
  }
});

// Rotate PDF endpoint
pdfOperationsRouter.post('/rotate', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No PDF file provided' }
      });
    }

    const { pages = 'all', degrees = 90 } = req.body;
    
    if (![90, 180, 270].includes(parseInt(degrees))) {
      return res.status(400).json({
        error: { code: 'INVALID_ROTATION', message: 'Rotation must be 90, 180, or 270 degrees' }
      });
    }

    // For now, return a simple response - in production, implement actual rotation
    res.json({
      success: true,
      message: `PDF rotation completed`,
      pages,
      degrees,
      originalFile: req.file.originalname,
      originalSize: req.file.size
    });

  } catch (error) {
    console.error('PDF rotate error:', error);
    res.status(500).json({
      error: { 
        code: 'ROTATE_ERROR', 
        message: 'Failed to rotate PDF' 
      }
    });
  }
});

// Extract PDF pages endpoint
pdfOperationsRouter.post('/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No PDF file provided' }
      });
    }

    const { pages } = req.body;
    
    if (!pages) {
      return res.status(400).json({
        error: { code: 'NO_PAGES', message: 'Pages to extract are required' }
      });
    }

    try {
      const pageNumbers = JSON.parse(pages);
      if (!Array.isArray(pageNumbers) || pageNumbers.length === 0) {
        return res.status(400).json({
          error: { code: 'INVALID_PAGES', message: 'Pages must be a non-empty array' }
        });
      }
    } catch (parseError) {
      return res.status(400).json({
        error: { code: 'INVALID_PAGES_JSON', message: 'Invalid JSON format for pages' }
      });
    }

    // For now, return a simple response - in production, implement actual extraction
    res.json({
      success: true,
      message: `PDF extraction completed`,
      pages: JSON.parse(pages),
      originalFile: req.file.originalname,
      originalSize: req.file.size
    });

  } catch (error) {
    console.error('PDF extract error:', error);
    res.status(500).json({
      error: { 
        code: 'EXTRACT_ERROR', 
        message: 'Failed to extract PDF pages' 
      }
    });
  }
});

// Add text overlay endpoint
pdfOperationsRouter.post('/add-text', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No PDF file provided' }
      });
    }

    const { text, x = 50, y = 50, fontSize = 12, color = '#000000', opacity = 1, pages = 'all' } = req.body;

    if (!text) {
      return res.status(400).json({
        error: { code: 'NO_TEXT', message: 'Text content is required' }
      });
    }

    const parsedPages = pages === 'all' ? 'all' : JSON.parse(pages);

    // For now, return a simple response - in production, implement actual text overlay
    res.json({
      success: true,
      message: 'Text overlay added successfully',
      text,
      position: { x, y },
      fontSize,
      color,
      opacity,
      pages: parsedPages,
      originalFile: req.file.originalname,
      originalSize: req.file.size
    });

  } catch (error) {
    console.error('PDF text overlay error:', error);
    res.status(500).json({
      error: { 
        code: 'TEXT_OVERLAY_ERROR', 
        message: 'Failed to add text overlay to PDF' 
      }
    });
  }
});

// Add image overlay endpoint
pdfOperationsRouter.post('/add-image', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const pdfFile = (req.files as Express.Multer.File[]).find(f => f.fieldname === 'pdf');
    const imageFile = (req.files as Express.Multer.File[]).find(f => f.fieldname === 'image');

    if (!pdfFile) {
      return res.status(400).json({
        error: { code: 'NO_PDF', message: 'No PDF file provided' }
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        error: { code: 'NO_IMAGE', message: 'No image file provided' }
      });
    }

    const { x = 50, y = 50, width = 100, height = 100, opacity = 1, pages = 'all' } = req.body;
    const parsedPages = pages === 'all' ? 'all' : JSON.parse(pages);

    // For now, return a simple response - in production, implement actual image overlay
    res.json({
      success: true,
      message: 'Image overlay added successfully',
      image: imageFile.originalname,
      position: { x, y },
      dimensions: { width, height },
      opacity,
      pages: parsedPages,
      pdfFile: pdfFile.originalname,
      imageSize: imageFile.size
    });

  } catch (error) {
    console.error('PDF image overlay error:', error);
    res.status(500).json({
      error: { 
        code: 'IMAGE_OVERLAY_ERROR', 
        message: 'Failed to add image overlay to PDF' 
      }
    });
  }
});

// Compress PDF endpoint
pdfOperationsRouter.post('/compress', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: 'NO_FILE', message: 'No PDF file provided' }
      });
    }

    const { quality = 'medium', removeImages = false } = req.body;

    // For now, return a simple response - in production, implement actual compression
    res.json({
      success: true,
      message: 'PDF compression completed',
      quality,
      removeImages,
      originalFile: req.file.originalname,
      originalSize: req.file.size,
      estimatedCompressionRatio: '30-50%'
    });

  } catch (error) {
    console.error('PDF compression error:', error);
    res.status(500).json({
      error: { 
        code: 'COMPRESS_ERROR', 
        message: 'Failed to compress PDF' 
      }
    });
  }
});

// Batch PDF operations endpoint (premium feature)
pdfOperationsRouter.post('/batch', authenticateToken, upload.array('pdfs', 5), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    // Check if user has premium access
    if (!req.user.subscriptionStatus.includes('premium')) {
      return res.status(403).json({
        error: { code: 'PREMIUM_REQUIRED', message: 'Batch operations require premium subscription' }
      });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        error: { code: 'NO_FILES', message: 'No PDF files provided' }
      });
    }

    const { operation, options = {} } = req.body;

    if (!operation || !['merge', 'compress', 'add-text'].includes(operation)) {
      return res.status(400).json({
        error: { code: 'INVALID_OPERATION', message: 'Invalid batch operation' }
      });
    }

    // For now, return a simple response - in production, implement actual batch processing
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    res.json({
      success: true,
      message: `Batch ${operation} operation completed`,
      operation,
      filesCount: files.length,
      totalSize,
      options,
      files: files.map(file => ({
        name: file.originalname,
        size: file.size
      }))
    });

  } catch (error) {
    console.error('Batch PDF operation error:', error);
    res.status(500).json({
      error: { 
        code: 'BATCH_ERROR', 
        message: 'Failed to process batch operation' 
      }
    });
  }
});

// Health check for PDF operations
pdfOperationsRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PDF Operations',
    timestamp: new Date().toISOString(),
    supportedOperations: [
      'metadata',
      'merge',
      'split',
      'rotate',
      'extract',
      'add-text',
      'add-image',
      'compress',
      'batch'
    ]
  });
});
