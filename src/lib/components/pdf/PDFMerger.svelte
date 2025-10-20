<script lang="ts">
  import PDFBase from './PDFBase.svelte';
  import { PDFConverter } from '$lib/utils/pdfConverter';
  import { toastStore } from '$lib/stores/toast.svelte.ts';

  const title = 'Merge PDFs';
  const description = 'Combine multiple PDF files into a single document';
  const operation = 'merge';

  let selectedFiles: File[] = [];
  let results: any[] = [];
  let isProcessing = false;
  let error: string | null = null;

  async function performOperation(): Promise<void> {
    if (selectedFiles.length < 2) {
      throw new Error('Please select at least 2 PDF files to merge');
    }

    try {
      const result = await PDFConverter.mergePDFs(selectedFiles);
      results = [result];
    } catch (error) {
      throw new Error(`Failed to merge PDFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
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
/>
