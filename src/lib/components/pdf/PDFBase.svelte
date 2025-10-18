<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from '$lib/stores/toast.svelte.ts';
  import type { PDFOperationResult } from '$lib/utils/pdfConverter';

  export let title: string;
  export let description: string;
  export let operation: string;

  let isProcessing = false;
  let uploadArea: HTMLDivElement;
  let selectedFiles: File[] = [];
  let results: PDFOperationResult[] = [];
  let error: string | null = null;

  // File upload handlers
  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    
    if (files.length > 0) {
      validateAndSelectFiles(files);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    
    if (uploadArea && event.dataTransfer) {
      uploadArea.classList.remove('drag-over');
      const files = Array.from(event.dataTransfer.files);
      validateAndSelectFiles(files);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (uploadArea) {
      uploadArea.classList.add('drag-over');
    }
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    if (uploadArea) {
      uploadArea.classList.remove('drag-over');
    }
  }

  function validateAndSelectFiles(files: File[]) {
    // Clear previous selections
    selectedFiles = [];
    error = null;
    
    const validFiles = files.filter(file => {
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        error = `Invalid file: ${file.name}. Only PDF files are allowed.`;
        return false;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        error = `File too large: ${file.name}. Maximum size is 50MB.`;
        return false;
      }
      
      return true;
    });
    
    if (error) {
      toast.error(error);
      return;
    }
    
    selectedFiles = validFiles;
  }

  function removeFile(index: number) {
    selectedFiles.splice(index, 1);
    if (selectedFiles.length === 0) {
      results = [];
    }
  }

  async function processFiles() {
    if (selectedFiles.length === 0) {
      toast.error('Please select PDF files to process');
      return;
    }

    isProcessing = true;
    error = null;
    results = [];

    try {
      // This will be implemented by child components
      await performOperation();
      
      if (results.length > 0) {
        toast.success(`${title} completed successfully!`);
      } else {
        toast.error('No results generated');
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred during processing';
      toast.error(error);
    } finally {
      isProcessing = false;
    }
  }

  // Abstract method to be implemented by child components
  async function performOperation(): Promise<void> {
    throw new Error('performOperation must be implemented by child components');
  }

  function downloadResult(result: PDFOperationResult, index: number) {
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadAllResults() {
    if (results.length === 0) return;

    if (results.length === 1) {
      downloadResult(results[0], 0);
      return;
    }

    // For multiple files, create a zip
    // This would require a zip library like JSZip
    toast.info('Multiple file download would create a zip file (not implemented yet)');
  }

  // File size formatter
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div class="pdf-base">
  <div class="operation-header">
    <h2>{title}</h2>
    <p class="description">{description}</p>
  </div>

  <div 
    class="upload-area"
    bind:this={uploadArea}
    on:drop={handleDrop}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
  >
    <input 
      type="file" 
      id="file-input"
      multiple
      accept=".pdf,application/pdf"
      on:change={handleFileSelect}
      class="hidden"
    />
    
    <label for="file-input" class="upload-label">
      <div class="upload-icon">📄</div>
      <div class="upload-text">
        <strong>Click to upload PDF files</strong>
        <p>or drag and drop files here</p>
        <p class="upload-hint">Maximum file size: 50MB each</p>
      </div>
    </label>
  </div>

  {#if error}
    <div class="error-message">
      ❌ {error}
    </div>
  {/if}

  {#if selectedFiles.length > 0}
    <div class="selected-files">
      <h3>Selected Files ({selectedFiles.length})</h3>
      <div class="file-list">
        {#each selectedFiles as file, index}
          <div class="file-item">
            <div class="file-info">
              <span class="file-name">{file.name}</span>
              <span class="file-size">{formatFileSize(file.size)}</span>
            </div>
            <button 
              class="remove-file" 
              on:click={() => removeFile(index)}
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        {/each}
      </div>
      
      <button 
        class="process-button" 
        on:click={processFiles}
        disabled={isProcessing}
      >
        {#if isProcessing}
          Processing... 
          <span class="spinner">⏳</span>
        {:else}
          {title}
        {/if}
      </button>
    </div>
  {/if}

  {#if results.length > 0}
    <div class="results">
      <h3>Results ({results.length} files)</h3>
      <div class="results-list">
        {#each results as result, index}
          <div class="result-item">
            <div class="result-info">
              <span class="result-name">{result.filename}</span>
              <span class="result-size">{formatFileSize(result.processedSize)}</span>
              <span class="original-size">Original: {formatFileSize(result.originalSize)}</span>
              {#if result.processedSize < result.originalSize}
                <span class="saved">Saved: {formatFileSize(result.originalSize - result.processedSize)}</span>
              {/if}
            </div>
            <button 
              class="download-button" 
              on:click={() => downloadResult(result, index)}
              aria-label="Download {result.filename}"
            >
              ⬇️ Download
            </button>
          </div>
        {/each}
      </div>
      
      {#if results.length > 1}
        <button class="download-all" on:click={downloadAllResults}>
          📦 Download All
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .pdf-base {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Lexend', sans-serif;
  }

  .operation-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .operation-header h2 {
    color: #1a202c;
    margin-bottom: 10px;
    font-size: 2rem;
  }

  .description {
    color: #718096;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .upload-area {
    border: 2px dashed #cbd5e0;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    background: #f7fafc;
  }

  .upload-area:hover {
    border-color: #4299e1;
    background: #ebf8ff;
  }

  .upload-area.drag-over {
    border-color: #3182ce;
    background: #bee3f8;
    transform: scale(1.02);
  }

  .upload-label {
    display: block;
    cursor: pointer;
  }

  .upload-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }

  .upload-text {
    margin-bottom: 10px;
  }

  .upload-hint {
    color: #a0aec0;
    font-size: 0.9rem;
  }

  .error-message {
    background: #fed7d7;
    color: #c53030;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 4px solid #e53e3e;
  }

  .selected-files {
    margin: 30px 0;
  }

  .selected-files h3 {
    color: #2d3748;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  .file-list {
    background: #f7fafc;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: white;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .file-info {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .file-name {
    font-weight: 500;
    color: #2d3748;
  }

  .file-size {
    color: #718096;
    font-size: 0.9rem;
  }

  .remove-file {
    background: #feb2b2;
    color: #c53030;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .remove-file:hover {
    background: #fc8181;
  }

  .process-button {
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .process-button:hover:not(:disabled) {
    background: #3182ce;
    transform: translateY(-1px);
  }

  .process-button:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .results {
    margin: 30px 0;
  }

  .results h3 {
    color: #2d3748;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }

  .results-list {
    background: #f7fafc;
    border-radius: 8px;
    padding: 15px;
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: white;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .result-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .result-name {
    font-weight: 500;
    color: #2d3748;
  }

  .result-size, .original-size, .saved {
    color: #718096;
    font-size: 0.9rem;
  }

  .saved {
    color: #38a169;
    font-weight: 500;
  }

  .download-button {
    background: #48bb78;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .download-button:hover {
    background: #38a169;
    transform: translateY(-1px);
  }

  .download-all {
    background: #805ad5;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;
    margin-top: 15px;
    width: 100%;
  }

  .download-all:hover {
    background: #6b46c1;
    transform: translateY(-1px);
  }
</style>
