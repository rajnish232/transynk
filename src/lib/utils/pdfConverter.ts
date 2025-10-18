/**
 * PDF utility functions for client-side operations
 */

export interface PDFOperationResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  processedSize: number;
  operation: string;
}

export interface PDFOptions {
  quality?: number;
  compression?: 'none' | 'low' | 'medium' | 'high';
  password?: string;
  permissions?: {
    printing?: boolean;
    copying?: boolean;
    modifying?: boolean;
    annotating?: boolean;
    fillingForms?: boolean;
  };
}

export class PDFConverter {
  /**
   * Merge multiple PDFs into one
   */
  static async mergePDFs(files: File[], options: PDFOptions = {}): Promise<PDFOperationResult> {
    try {
      // Import pdf-lib dynamically to avoid server-side issues
      const { PDFDocument, rgb } = await import('pdf-lib');
      
      const mergedPdf = await PDFDocument.create();
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      for (const file of files) {
        const fileBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: 'merged.pdf',
        originalSize: totalSize,
        processedSize: resultBlob.size,
        operation: 'merge'
      };
      
    } catch (error) {
      console.error('PDF merge error:', error);
      throw new Error(`Failed to merge PDFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Split a PDF into multiple files
   */
  static async splitPDF(
    file: File, 
    splitOptions: 'pages' | 'ranges', 
    ranges?: string[]
  ): Promise<PDFOperationResult[]> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const totalPages = pdfDoc.getPageCount();
      const results: PDFOperationResult[] = [];
      
      if (splitOptions === 'pages') {
        // Split into individual pages
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          
          const pdfBytes = await newPdf.save();
          const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
          
          results.push({
            blob: resultBlob,
            filename: `page_${i + 1}.pdf`,
            originalSize: file.size,
            processedSize: resultBlob.size,
            operation: 'split'
          });
        }
      } else if (splitOptions === 'ranges' && ranges) {
        // Split by page ranges
        for (const range of ranges) {
          const newPdf = await PDFDocument.create();
          const pageNumbers = this.parsePageRange(range, totalPages);
          
          for (const pageNum of pageNumbers) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
            newPdf.addPage(copiedPage);
          }
          
          const pdfBytes = await newPdf.save();
          const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
          
          results.push({
            blob: resultBlob,
            filename: `pages_${range.replace(/[-,]/g, '_')}.pdf`,
            originalSize: file.size,
            processedSize: resultBlob.size,
            operation: 'split'
          });
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('PDF split error:', error);
      throw new Error(`Failed to split PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reorder PDF pages
   */
  static async reorderPDFPages(file: File, pageOrder: number[]): Promise<PDFOperationResult> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      const reorderedPdf = await PDFDocument.create();
      
      for (const pageIndex of pageOrder) {
        const [copiedPage] = await reorderedPdf.copyPages(pdfDoc, [pageIndex - 1]);
        reorderedPdf.addPage(copiedPage);
      }
      
      const pdfBytes = await reorderedPdf.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `reordered_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'reorder'
      };
      
    } catch (error) {
      console.error('PDF reorder error:', error);
      throw new Error(`Failed to reorder PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract specific pages from PDF
   */
  static async extractPDFPages(file: File, pages: number[]): Promise<PDFOperationResult> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      const extractedPdf = await PDFDocument.create();
      
      for (const pageIndex of pages) {
        const [copiedPage] = await extractedPdf.copyPages(pdfDoc, [pageIndex - 1]);
        extractedPdf.addPage(copiedPage);
      }
      
      const pdfBytes = await extractedPdf.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `extracted_pages_${pages.join('_')}_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'extract'
      };
      
    } catch (error) {
      console.error('PDF extract error:', error);
      throw new Error(`Failed to extract PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Rotate PDF pages
   */
  static async rotatePDFPages(
    file: File, 
    rotationOptions: { pages: number[]; degrees: 90 | 180 | 270 }
  ): Promise<PDFOperationResult> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const rotatedPdf = await PDFDocument.create();
      
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const [copiedPage] = await rotatedPdf.copyPages(pdfDoc, [i]);
        
        if (rotationOptions.pages.includes(i + 1)) {
          copiedPage.setRotation(rotationOptions.degrees);
        }
        
        rotatedPdf.addPage(copiedPage);
      }
      
      const pdfBytes = await rotatedPdf.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `rotated_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'rotate'
      };
      
    } catch (error) {
      console.error('PDF rotate error:', error);
      throw new Error(`Failed to rotate PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete PDF pages
   */
  static async deletePDFPages(file: File, pagesToDelete: number[]): Promise<PDFOperationResult> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const filteredPdf = await PDFDocument.create();
      
      // Sort pages to delete in descending order to avoid index shifting
      const sortedPagesToDelete = [...pagesToDelete].sort((a, b) => b - a);
      
      // Copy pages that should be kept
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        if (!pagesToDelete.includes(i + 1)) {
          const [copiedPage] = await filteredPdf.copyPages(pdfDoc, [i]);
          filteredPdf.addPage(copiedPage);
        }
      }
      
      const pdfBytes = await filteredPdf.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `filtered_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'delete'
      };
      
    } catch (error) {
      console.error('PDF delete error:', error);
      throw new Error(`Failed to delete PDF pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add text overlay to PDF
   */
  static async addTextOverlay(
    file: File, 
    text: string, 
    options: {
      pages?: number[];
      x?: number;
      y?: number;
      fontSize?: number;
      color?: string;
      opacity?: number;
    } = {}
  ): Promise<PDFOperationResult> {
    try {
      const { PDFDocument, rgb } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      // Default options
      const {
        pages = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i + 1),
        x = 50,
        y = 50,
        fontSize = 12,
        color = '#000000',
        opacity = 1
      } = options;
      
      // Parse color
      const rgbColor = this.parseColor(color);
      
      for (const pageNum of pages) {
        const page = pdfDoc.getPage(pageNum - 1);
        const { width, height } = page.getSize();
        
        page.drawText(text, {
          x: Math.min(x, width - 100),
          y: height - y,
          size: fontSize,
          color: rgbColor,
          opacity: opacity
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `text_overlay_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'text-overlay'
      };
      
    } catch (error) {
      console.error('PDF text overlay error:', error);
      throw new Error(`Failed to add text overlay: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add image overlay to PDF
   */
  static async addImageOverlay(
    file: File, 
    imageFile: File, 
    options: {
      pages?: number[];
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      opacity?: number;
    } = {}
  ): Promise<PDFOperationResult> {
    try {
      const { PDFDocument, rgb } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      const imageBytes = await imageFile.arrayBuffer();
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Default options
      const {
        pages = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i + 1),
        x = 50,
        y = 50,
        width = 100,
        height = 100,
        opacity = 1
      } = options;
      
      for (const pageNum of pages) {
        const page = pdfDoc.getPage(pageNum - 1);
        page.drawImage(image, {
          x,
          y,
          width,
          height,
          opacity
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `image_overlay_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'image-overlay'
      };
      
    } catch (error) {
      console.error('PDF image overlay error:', error);
      throw new Error(`Failed to add image overlay: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compress PDF
   */
  static async compressPDF(file: File, options: PDFOptions = {}): Promise<PDFOperationResult> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      // Simple compression - in production, use more sophisticated methods
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false
      });
      
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      return {
        blob: resultBlob,
        filename: `compressed_${file.name}`,
        originalSize: file.size,
        processedSize: resultBlob.size,
        operation: 'compress'
      };
      
    } catch (error) {
      console.error('PDF compression error:', error);
      throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate PDF file
   */
  static async validatePDF(file: File): Promise<boolean> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      await PDFDocument.load(fileBytes);
      return true;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Get PDF metadata
   */
  static async getPDFMetadata(file: File): Promise<{
    pageCount: number;
    title?: string;
    author?: string;
    creator?: string;
    creationDate?: Date;
    modificationDate?: Date;
    size: number;
  }> {
    try {
      const { PDFDocument } = await import('pdf-lib');
      
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      const info = pdfDoc.getInfo();
      
      return {
        pageCount: pdfDoc.getPageCount(),
        title: info.Title || undefined,
        author: info.Author || undefined,
        creator: info.Creator || undefined,
        creationDate: info.CreationDate || undefined,
        modificationDate: info.ModificationDate || undefined,
        size: file.size
      };
      
    } catch (error) {
      throw new Error(`Failed to get PDF metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse page range string (e.g., "1-5,7,9-12")
   */
  private static parsePageRange(range: string, totalPages: number): number[] {
    const pages: number[] = [];
    
    const ranges = range.split(',');
    
    for (const r of ranges) {
      if (r.includes('-')) {
        const [start, end] = r.split('-').map(Number);
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          pages.push(i);
        }
      } else {
        const page = parseInt(r);
        if (page >= 1 && page <= totalPages) {
          pages.push(page);
        }
      }
    }
    
    return [...new Set(pages)].sort((a, b) => a - b);
  }

  /**
   * Parse color string to RGB array
   */
  private static parseColor(color: string): [number, number, number] {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return [r / 255, g / 255, b / 255];
      } else if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return [r / 255, g / 255, b / 255];
      }
    }
    
    // Default to black
    return [0, 0, 0];
  }

  /**
   * Get supported PDF operations
   */
  static getSupportedOperations(): string[] {
    return [
      'merge',
      'split',
      'reorder',
      'extract',
      'rotate',
      'delete',
      'text-overlay',
      'image-overlay',
      'compress'
    ];
  }

  /**
   * Validate file is PDF
   */
  static isPDFFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  /**
   * Validate PDF file size
   */
  static validatePDFSize(file: File, maxSizeMB: number = 50): boolean {
    return file.size <= maxSizeMB * 1024 * 1024;
  }
}
