<script lang="ts">
  import PDFBase from './PDFBase.svelte';
  import { PDFConverter } from '$lib/utils/pdfConverter';
  import { toastStore } from '$lib/stores/toast.svelte.ts';

  const title = 'Split PDF';
  const description = 'Split a PDF into multiple files by pages or page ranges';
  const operation = 'split';

  let selectedFiles: File[] = [];
  let results: any[] = [];
  let isProcessing = false;
  let error: string | null = null;
  
  // Split options
  let splitType: 'pages' | 'ranges' = 'pages';
  let pageRanges: string = '';
  let showOptions = false;

  async function performOperation(): Promise<void> {
    if (selectedFiles.length !== 1) {
      throw new Error('Please select exactly 1 PDF file to split');
    }

    try {
      let splitResults: any[] = [];
      
      if (splitType === 'pages') {
        splitResults = await PDFConverter.splitPDF(selectedFiles[0], 'pages');
      } else if (splitType === 'ranges' && pageRanges.trim()) {
        const ranges = pageRanges.split(',').map(r => r.trim());
        splitResults = await PDFConverter.splitPDF(selectedFiles[0], 'ranges', ranges);
      } else {
        throw new Error('Please enter page ranges when using ranges split type');
      }
      
      results = splitResults;
    } catch (error) {
      throw new Error(`Failed to split PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  function validatePageRanges(): boolean {
    if (!pageRanges.trim()) return false;
    
    try {
      const ranges = pageRanges.split(',');
      for (const range of ranges) {
        const trimmed = range.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(Number);
          if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
            return false;
          }
        } else {
          const pageNum = Number(trimmed);
          if (isNaN(pageNum) || pageNum < 1) {
            return false;
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  $: canProcess = selectedFiles.length === 1 && 
    ((splitType === 'pages') || (splitType === 'ranges' && validatePageRanges()));
</script>

<PDFBase 
  {title}
  {description}
  {operation}
  bind:performOperation
  bind:selectedFiles
  bind:results
  bind:isProcessing
  bind:error
>

  <div class="split-options">
    <div class="option-group">
      <label>
        <input 
          type="radio" 
          name="splitType" 
          value="pages" 
          bind:group={splitType}
        />
        Split into individual pages
      </label>
      
      <label>
        <input 
          type="radio" 
          name="splitType" 
          value="ranges" 
          bind:group={splitType}
          on:change={() => showOptions = true}
        />
        Split by page ranges
      </label>
    </div>

    {#if splitType === 'ranges'}
      <div class="range-input">
        <label for="pageRanges">Enter page ranges:</label>
        <input 
          type="text" 
          id="pageRanges" 
          bind:value={pageRanges}
          placeholder="e.g., 1-5,7,9-12"
        />
        <small>Format: "1-5,7,9-12" (pages 1-5, page 7, pages 9-12)</small>
        {#if !validatePageRanges() && pageRanges.trim()}
          <p class="error">Invalid page range format</p>
        {/if}
      </div>
    {/if}
  </div>

</PDFBase>

<style>
  .split-options {
    margin: 20px 0;
    padding: 20px;
    background: #f7fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .option-group {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .option-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;
    color: #2d3748;
  }

  .option-group input[type="radio"] {
    cursor: pointer;
  }

  .range-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .range-input label {
    font-weight: 600;
    color: #2d3748;
  }

  .range-input input {
    padding: 10px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .range-input input:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  .range-input small {
    color: #718096;
    font-size: 0.9rem;
  }

  .range-input .error {
    color: #e53e3e;
    font-size: 0.9rem;
    margin-top: 5px;
  }
</style>
