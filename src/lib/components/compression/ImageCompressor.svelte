<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { 
    Upload, 
    Download, 
    Settings, 
    Image as ImageIcon, 
    Zap, 
    Crown,
    X,
    RotateCcw
  } from 'lucide-svelte';

  interface CompressedImage {
    original: File;
    compressed: Blob;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    preview: string;
  }

  let files = $state<File[]>([]);
  let compressedImages = $state<CompressedImage[]>([]);
  let quality = $state(80);
  let format = $state<'jpeg' | 'png' | 'webp'>('jpeg');
  let isCompressing = $state(false);
  let dragOver = $state(false);
  let useTargetSize = $state(false);
  let targetSize = $state(500); // Target size in KB
  let targetUnit = $state<'KB' | 'MB'>('KB');

  const dispatch = createEventDispatcher();

  // Quality presets
  const qualityPresets = [
    { name: 'High Quality', value: 90, description: 'Minimal compression' },
    { name: 'Balanced', value: 80, description: 'Good quality, smaller size' },
    { name: 'Web Optimized', value: 70, description: 'Optimized for web' },
    { name: 'Small Size', value: 50, description: 'Maximum compression' }
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
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited compressions');
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer?.files || [])
      .filter(file => file.type.startsWith('image/'));
    
    if (droppedFiles.length > 0) {
      files = [...files, ...droppedFiles];
    }
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const selectedFiles = Array.from(target.files || [])
      .filter(file => file.type.startsWith('image/'));
    
    if (selectedFiles.length > 0) {
      files = [...files, ...selectedFiles];
    }
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    compressedImages = compressedImages.filter((_, i) => i !== index);
  }

  function clearAll() {
    files = [];
    compressedImages = [];
  }

  async function compressImages() {
    if (!usageStore.canConvert) {
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited compressions');
      return;
    }

    isCompressing = true;
    compressedImages = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file, quality / 100, format);
        
        if (compressed) {
          compressedImages = [...compressedImages, compressed];
          
          // Log the compression
          await usageStore.logConversion(
            file.type,
            `compressed_${format}`,
            file.size,
            1000
          );
        }
      }

      toastStore.success(
        'Compression completed!', 
        `Successfully compressed ${compressedImages.length} image(s)`
      );
    } catch (error) {
      console.error('Compression error:', error);
      toastStore.error('Compression failed', 'Please try again or contact support');
    } finally {
      isCompressing = false;
    }
  }

  async function compressImage(file: File, quality: number, outputFormat: string): Promise<CompressedImage | null> {
    try {
      let compressedBlob: Blob;
      
      if (useTargetSize) {
        // Compress to target size
        compressedBlob = await compressToTargetSize(file, outputFormat);
      } else {
        // Import the real image converter
        const { ImageConverter } = await import('$lib/utils/imageConverter.js');
        
        // Perform regular quality-based compression
        compressedBlob = await ImageConverter.convertImage(file, outputFormat, {
          quality: quality / 100
        });
      }
      
      const compressionRatio = ((file.size - compressedBlob.size) / file.size) * 100;
      
      // Create preview
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = Math.min(img.width, 300);
          canvas.height = Math.min(img.height, 200);
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          resolve({
            original: file,
            compressed: compressedBlob,
            originalSize: file.size,
            compressedSize: compressedBlob.size,
            compressionRatio,
            preview: canvas.toDataURL('image/jpeg', 0.8)
          });
        };
        
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('Compression error:', error);
      toastStore.error('Compression failed', `Failed to compress ${file.name}: ${error.message}`);
      return null;
    }
  }

  async function compressToTargetSize(file: File, outputFormat: string): Promise<Blob> {
    const targetBytes = targetSize * (targetUnit === 'MB' ? 1024 * 1024 : 1024);
    const { ImageConverter } = await import('$lib/utils/imageConverter.js');
    
    let minQuality = 0.1;
    let maxQuality = 1.0;
    let bestBlob: Blob | null = null;
    let attempts = 0;
    const maxAttempts = 15;

    // Binary search for the right quality to achieve target size
    while (attempts < maxAttempts && (maxQuality - minQuality) > 0.01) {
      const currentQuality = (minQuality + maxQuality) / 2;
      
      try {
        const blob = await ImageConverter.convertImage(file, outputFormat, {
          quality: currentQuality
        });

        if (blob.size <= targetBytes) {
          bestBlob = blob;
          minQuality = currentQuality;
        } else {
          maxQuality = currentQuality;
        }
      } catch (error) {
        console.warn('Quality attempt failed:', currentQuality, error);
        maxQuality = currentQuality;
      }
      
      attempts++;
    }

    // If we couldn't achieve the target size, return the best we got
    if (!bestBlob) {
      // Fallback to very low quality
      bestBlob = await ImageConverter.convertImage(file, outputFormat, {
        quality: 0.1
      });
    }

    return bestBlob;
  }

  function downloadImage(compressed: CompressedImage) {
    const url = URL.createObjectURL(compressed.compressed);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${compressed.original.name.split('.')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    compressedImages.forEach(compressed => {
      downloadImage(compressed);
    });
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function setQualityPreset(preset: number) {
    quality = preset;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
      <ImageIcon class="text-white" size={24} />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Image Compressor</h2>
    <p class="text-gray-600 dark:text-gray-400">
      Reduce image file sizes while maintaining quality. Perfect for web optimization.
    </p>
  </div>

  <!-- Upload Area -->
  <div
    class="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 {
      dragOver 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : !usageStore.canConvert
          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if !usageStore.canConvert}
      <div class="text-gray-400 dark:text-gray-500">
        <Crown class="mx-auto mb-4" size={48} />
        <h3 class="text-lg font-medium mb-2">Daily Limit Reached</h3>
        <p class="text-sm mb-4">Upgrade to premium for unlimited image compression</p>
        <button
          onclick={() => dispatch('upgrade')}
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          Upgrade Now
        </button>
      </div>
    {:else}
      <Upload class="mx-auto mb-4 text-gray-400" size={48} />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Drop images here or click to browse
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Supports JPG, PNG, WebP formats
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onchange={handleFileSelect}
        class="hidden"
        id="image-upload"
      />
      <label
        for="image-upload"
        class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
      >
        <Upload class="mr-2" size={16} />
        Select Images
      </label>
    {/if}
  </div>

  <!-- Compression Settings -->
  {#if files.length > 0}
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Settings class="mr-2" size={20} />
        Compression Settings
      </h3>
      
      <!-- Compression Mode Toggle -->
      <div class="mb-6">
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              type="radio"
              bind:group={useTargetSize}
              value={false}
              class="mr-2"
            />
            <span class="text-gray-700 dark:text-gray-300">Quality-based compression</span>
          </label>
          <label class="flex items-center">
            <input
              type="radio"
              bind:group={useTargetSize}
              value={true}
              class="mr-2"
            />
            <span class="text-gray-700 dark:text-gray-300">Target size compression</span>
          </label>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Quality Settings or Target Size -->
        <div>
          {#if useTargetSize}
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Target File Size
            </label>
            
            <div class="flex items-center space-x-2 mb-4">
              <input
                type="number"
                bind:value={targetSize}
                min="1"
                max={targetUnit === 'MB' ? 100 : 10000}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter size"
              />
              <select
                bind:value={targetUnit}
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="KB">KB</option>
                <option value="MB">MB</option>
              </select>
            </div>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p class="text-sm text-blue-800 dark:text-blue-200">
                <strong>Target Size Mode:</strong> The compressor will automatically adjust quality to achieve your desired file size.
                Example: 5MB → 500KB
              </p>
            </div>
          {:else}
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quality: {quality}%
            </label>
          
          <!-- Quality Presets -->
          <div class="grid grid-cols-2 gap-2 mb-4">
            {#each qualityPresets as preset}
              <button
                onclick={() => setQualityPreset(preset.value)}
                class="p-2 text-xs border rounded-lg transition-all {
                  quality === preset.value 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }"
              >
                <div class="font-medium">{preset.name}</div>
                <div class="text-gray-500 dark:text-gray-400">{preset.description}</div>
              </button>
            {/each}
          </div>
          
          <!-- Quality Slider -->
          <input
            type="range"
            min="10"
            max="100"
            bind:value={quality}
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Smaller size</span>
            <span>Better quality</span>
          </div>
          {/if}
        </div>

        <!-- Format Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Output Format
          </label>
          <div class="space-y-2">
            {#each ['jpeg', 'png', 'webp'] as fmt}
              <label class="flex items-center">
                <input
                  type="radio"
                  bind:group={format}
                  value={fmt}
                  class="mr-2"
                  disabled={fmt === 'webp' && !authStore.isPremium}
                />
                <span class="text-gray-700 dark:text-gray-300 uppercase">
                  {fmt}
                  {#if fmt === 'webp' && !authStore.isPremium}
                    <Crown class="inline ml-1 text-yellow-500" size={14} />
                  {/if}
                </span>
              </label>
            {/each}
          </div>
          
          {#if format === 'webp' && !authStore.isPremium}
            <p class="text-xs text-orange-600 dark:text-orange-400 mt-2">
              WebP format requires premium subscription
            </p>
          {/if}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 mt-6">
        <button
          onclick={compressImages}
          disabled={isCompressing || !usageStore.canConvert}
          class="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {#if isCompressing}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Compressing...
          {:else}
            <Zap class="mr-2" size={16} />
            Compress Images
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
          Selected Images ({files.length})
        </h3>
        {#if compressedImages.length > 0}
          <button
            onclick={downloadAll}
            class="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download class="mr-1" size={14} />
            Download All
          </button>
        {/if}
      </div>
      
      <div class="space-y-3">
        {#each files as file, index}
          {@const compressed = compressedImages[index]}
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-3">
              <ImageIcon class="text-blue-500" size={20} />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                  {file.name}
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
                  onclick={() => downloadImage(compressed)}
                  class="p-1 text-green-600 hover:text-green-700 transition-colors"
                  title="Download compressed image"
                >
                  <Download size={16} />
                </button>
              {/if}
              <button
                onclick={() => removeFile(index)}
                class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Compression Results -->
  {#if compressedImages.length > 0}
    <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Compression Results
      </h3>
      
      {#if compressedImages.length > 0}
        {@const totalOriginalSize = compressedImages.reduce((sum, img) => sum + img.originalSize, 0)}
        {@const totalCompressedSize = compressedImages.reduce((sum, img) => sum + img.compressedSize, 0)}
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
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalSavings.toFixed(1)}%
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Size Reduction</p>
        </div>
      </div>
      {/if}
    </div>
  {/if}
</div>