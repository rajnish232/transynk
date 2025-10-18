<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { 
    Upload, 
    Download, 
    Archive, 
    File as FileIcon, 
    Zap, 
    Crown,
    X,
    RotateCcw,
    FolderArchive
  } from 'lucide-svelte';

  interface CompressedFile {
    original: File;
    compressed: Blob;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  }

  let files = $state<File[]>([]);
  let compressedFiles = $state<CompressedFile[]>([]);
  let compressionLevel = $state(6); // 1-9 scale
  let createZip = $state(false);
  let isCompressing = $state(false);
  let dragOver = $state(false);

  const dispatch = createEventDispatcher();

  // Compression level presets
  const compressionPresets = [
    { name: 'Fast', level: 1, description: 'Quick compression' },
    { name: 'Balanced', level: 6, description: 'Good speed & size' },
    { name: 'Best', level: 9, description: 'Maximum compression' }
  ];

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (usageStore.canConvert) {
      dragOver = true;
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    
    if (!usageStore.canConvert) {
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited compression');
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length > 0) {
      files = [...files, ...droppedFiles];
    }
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const selectedFiles = Array.from(target.files || []);
    
    if (selectedFiles.length > 0) {
      files = [...files, ...selectedFiles];
    }
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    compressedFiles = compressedFiles.filter((_, i) => i !== index);
  }

  function clearAll() {
    files = [];
    compressedFiles = [];
  }

  async function compressFiles() {
    if (!usageStore.canConvert) {
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited compression');
      return;
    }

    isCompressing = true;
    compressedFiles = [];

    try {
      if (createZip && files.length > 1) {
        // Create ZIP archive
        const zipBlob = await createZipArchive(files);
        const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
        const compressionRatio = ((totalOriginalSize - zipBlob.size) / totalOriginalSize) * 100;
        
        compressedFiles = [{
          original: new File([zipBlob], 'archive.zip', { type: 'application/zip' }),
          compressed: zipBlob,
          originalSize: totalOriginalSize,
          compressedSize: zipBlob.size,
          compressionRatio
        }];
      } else {
        // Compress individual files
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const compressed = await compressFile(file, compressionLevel);
          
          if (compressed) {
            compressedFiles = [...compressedFiles, compressed];
          }
        }
      }

      // Log the compression
      await usageStore.logConversion(
        'multiple',
        createZip ? 'zip_archive' : 'compressed_files',
        files.reduce((sum, file) => sum + file.size, 0),
        2000
      );

      toastStore.success(
        'Compression completed!', 
        createZip ? 'ZIP archive created successfully' : `Successfully compressed ${compressedFiles.length} file(s)`
      );
    } catch (error) {
      console.error('Compression error:', error);
      toastStore.error('Compression failed', 'Please try again or contact support');
    } finally {
      isCompressing = false;
    }
  }

  async function compressFile(file: File, level: number): Promise<CompressedFile | null> {
    try {
      // For demo purposes, we'll simulate compression by creating a smaller blob
      // In a real implementation, you'd use a compression library like pako or fflate
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simulate compression (this is just for demo - use real compression library)
      const compressionFactor = Math.max(0.1, 1 - (level / 10));
      const compressedSize = Math.floor(file.size * compressionFactor);
      const compressedData = uint8Array.slice(0, compressedSize);
      
      const compressedBlob = new Blob([compressedData], { type: file.type });
      const compressionRatio = ((file.size - compressedBlob.size) / file.size) * 100;
      
      return {
        original: file,
        compressed: compressedBlob,
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressionRatio
      };
    } catch (error) {
      console.error('File compression error:', error);
      return null;
    }
  }

  async function createZipArchive(files: File[]): Promise<Blob> {
    // This is a simplified ZIP creation for demo purposes
    // In production, use a library like JSZip or fflate
    
    // For now, we'll create a simple archive by concatenating files
    // This is NOT a real ZIP format - use proper ZIP library in production
    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      chunks.push(uint8Array);
      totalSize += uint8Array.length;
    }
    
    // Simulate compression
    const compressionFactor = 0.7; // 30% compression
    const compressedSize = Math.floor(totalSize * compressionFactor);
    const combinedArray = new Uint8Array(compressedSize);
    
    let offset = 0;
    for (const chunk of chunks) {
      const chunkSize = Math.min(chunk.length, compressedSize - offset);
      combinedArray.set(chunk.slice(0, chunkSize), offset);
      offset += chunkSize;
      if (offset >= compressedSize) break;
    }
    
    return new Blob([combinedArray], { type: 'application/zip' });
  }

  function downloadFile(compressed: CompressedFile) {
    const url = URL.createObjectURL(compressed.compressed);
    const a = document.createElement('a');
    a.href = url;
    a.download = createZip ? 'archive.zip' : `compressed_${compressed.original.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    compressedFiles.forEach(compressed => {
      downloadFile(compressed);
    });
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function setCompressionPreset(level: number) {
    compressionLevel = level;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
      <Archive class="text-white" size={24} />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">File Compressor</h2>
    <p class="text-gray-600 dark:text-gray-400">
      Compress files to reduce storage space and improve transfer speeds.
    </p>
  </div>

  <!-- Upload Area -->
  <div
    class="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 {
      dragOver 
        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
        : !usageStore.canConvert
          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if !usageStore.canConvert}
      <div class="text-gray-400 dark:text-gray-500">
        <Crown class="mx-auto mb-4" size={48} />
        <h3 class="text-lg font-medium mb-2">Daily Limit Reached</h3>
        <p class="text-sm mb-4">Upgrade to premium for unlimited file compression</p>
        <button
          onclick={() => dispatch('upgrade')}
          class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          Upgrade Now
        </button>
      </div>
    {:else}
      <Upload class="mx-auto mb-4 text-gray-400" size={48} />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Drop files here or click to browse
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Supports all file types • {authStore.isPremium ? '100MB' : '25MB'} max per file
      </p>
      <input
        type="file"
        multiple
        onchange={handleFileSelect}
        class="hidden"
        id="file-upload"
      />
      <label
        for="file-upload"
        class="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer transition-colors"
      >
        <Upload class="mr-2" size={16} />
        Select Files
      </label>
    {/if}
  </div>

  <!-- Compression Settings -->
  {#if files.length > 0}
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Archive class="mr-2" size={20} />
        Compression Settings
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Compression Level -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Compression Level: {compressionLevel}
          </label>
          
          <!-- Compression Presets -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            {#each compressionPresets as preset}
              <button
                onclick={() => setCompressionPreset(preset.level)}
                class="p-2 text-xs border rounded-lg transition-all {
                  compressionLevel === preset.level 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }"
              >
                <div class="font-medium">{preset.name}</div>
                <div class="text-gray-500 dark:text-gray-400">{preset.description}</div>
              </button>
            {/each}
          </div>
          
          <!-- Compression Slider -->
          <input
            type="range"
            min="1"
            max="9"
            bind:value={compressionLevel}
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Faster</span>
            <span>Smaller</span>
          </div>
        </div>

        <!-- Archive Options -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Archive Options
          </label>
          
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                type="checkbox"
                bind:checked={createZip}
                class="mr-2"
                disabled={files.length < 2}
              />
              <span class="text-gray-700 dark:text-gray-300">
                Create ZIP archive
                {#if !authStore.isPremium}
                  <Crown class="inline ml-1 text-yellow-500" size={14} />
                {/if}
              </span>
            </label>
            
            {#if createZip && !authStore.isPremium}
              <p class="text-xs text-orange-600 dark:text-orange-400">
                ZIP archive creation requires premium subscription
              </p>
            {/if}
            
            {#if files.length < 2}
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Add multiple files to create an archive
              </p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 mt-6">
        <button
          onclick={compressFiles}
          disabled={isCompressing || !usageStore.canConvert || (createZip && !authStore.isPremium)}
          class="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {#if isCompressing}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Compressing...
          {:else}
            <Zap class="mr-2" size={16} />
            {createZip ? 'Create Archive' : 'Compress Files'}
          {/if}
        </button>
        
        <button
          onclick={clearAll}
          class="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw class="mr-2" size={16} />
          Clear All
        </button>
      </div>
    </div>
  {/if}

  <!-- File List -->
  {#if files.length > 0}
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Selected Files ({files.length})
        </h3>
        {#if compressedFiles.length > 0}
          <button
            onclick={downloadAll}
            class="flex items-center px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Download class="mr-1" size={14} />
            Download All
          </button>
        {/if}
      </div>
      
      <div class="space-y-3">
        {#each files as file, index}
          {@const compressed = compressedFiles[index]}
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-3">
              {#if createZip && files.length > 1}
                <FolderArchive class="text-purple-500" size={20} />
              {:else}
                <FileIcon class="text-purple-500" size={20} />
              {/if}
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                  {createZip && files.length > 1 ? 'archive.zip' : file.name}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                  {#if compressed}
                    → {formatFileSize(compressed.compressedSize)}
                    <span class="text-green-600 dark:text-green-400">
                      (-{compressed.compressionRatio.toFixed(1)}%)
                    </span>
                  {/if}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              {#if compressed}
                <button
                  onclick={() => downloadFile(compressed)}
                  class="p-1 text-green-600 hover:text-green-700 transition-colors"
                  title="Download compressed file"
                >
                  <Download size={16} />
                </button>
              {/if}
              {#if !createZip || files.length === 1}
                <button
                  onclick={() => removeFile(index)}
                  class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Compression Results -->
  {#if compressedFiles.length > 0}
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Compression Results
      </h3>
      
      {#if compressedFiles.length > 0}
        {@const totalOriginalSize = compressedFiles.reduce((sum, file) => sum + file.originalSize, 0)}
        {@const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.compressedSize, 0)}
        {@const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100}
        
        <div class="grid md:grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {formatFileSize(totalOriginalSize)}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Original Size</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {formatFileSize(totalCompressedSize)}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Compressed Size</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalSavings.toFixed(1)}%
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Space Saved</p>
        </div>
      </div>
      {/if}
    </div>
  {/if}
</div>