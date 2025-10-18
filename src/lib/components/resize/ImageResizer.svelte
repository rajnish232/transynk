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
    RotateCcw,
    Maximize2,
    Minimize2
  } from 'lucide-svelte';

  interface ResizedImage {
    original: File;
    resized: Blob;
    originalWidth: number;
    originalHeight: number;
    newWidth: number;
    newHeight: number;
    originalSize: number;
    newSize: number;
    preview: string;
  }

  let files = $state<File[]>([]);
  let resizedImages = $state<ResizedImage[]>([]);
  let targetWidth = $state<number | null>(null);
  let targetHeight = $state<number | null>(null);
  let quality = $state(90);
  let format = $state<'jpeg' | 'png' | 'webp'>('jpeg');
  let maintainAspectRatio = $state(true);
  let useServerProcessing = $state(false);
  let isResizing = $state(false);
  let dragOver = $state(false);

  const dispatch = createEventDispatcher();

  // Common resize presets
  const resizePresets = [
    { name: 'HD', width: 1920, height: 1080, description: '1920×1080' },
    { name: 'Social Media', width: 1200, height: 630, description: '1200×630' },
    { name: 'Instagram Square', width: 1080, height: 1080, description: '1080×1080' },
    { name: 'Profile Picture', width: 400, height: 400, description: '400×400' },
    { name: 'Thumbnail', width: 300, height: 200, description: '300×200' },
    { name: 'Banner', width: 1500, height: 500, description: '1500×500' }
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
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited resizing');
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
    resizedImages = resizedImages.filter((_, i) => i !== index);
  }

  function clearAll() {
    files = [];
    resizedImages = [];
  }

  function setPreset(preset: { width: number; height: number }) {
    targetWidth = preset.width;
    targetHeight = preset.height;
  }

  async function resizeImages() {
    if (!usageStore.canConvert) {
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited resizing');
      return;
    }

    if (!targetWidth && !targetHeight) {
      toastStore.error('Invalid dimensions', 'Please specify width or height');
      return;
    }

    isResizing = true;
    resizedImages = [];

    try {
      if (useServerProcessing && authStore.isPremium) {
        await resizeImagesServer();
      } else {
        await resizeImagesClient();
      }

      toastStore.success(
        'Resize completed!', 
        `Successfully resized ${resizedImages.length} image(s)`
      );
    } catch (error) {
      console.error('Resize error:', error);
      toastStore.error('Resize failed', 'Please try again or contact support');
    } finally {
      isResizing = false;
    }
  }

  async function resizeImagesClient() {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resized = await resizeImageCanvas(file);
      
      if (resized) {
        resizedImages = [...resizedImages, resized];
        
        // Log the resize
        await usageStore.logConversion(
          file.type,
          `resized_${format}`,
          file.size,
          1000
        );
      }
    }
  }

  async function resizeImagesServer() {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    
    formData.append('width', targetWidth?.toString() || '');
    formData.append('height', targetHeight?.toString() || '');
    formData.append('quality', quality.toString());
    formData.append('format', format);
    formData.append('maintainAspectRatio', maintainAspectRatio.toString());

    const response = await authStore.apiRequest('/api/images/batch-resize', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Server resize failed');
    }

    const data = await response.json();
    
    for (const result of data.results) {
      if (result.error) {
        console.error('Resize error for', result.originalName, ':', result.error);
        continue;
      }

      const resizedBlob = new Blob([Uint8Array.from(atob(result.data), c => c.charCodeAt(0))], {
        type: `image/${format}`
      });

      const originalFile = files.find(f => f.name === result.originalName);
      if (originalFile) {
        const img = new Image();
        img.src = URL.createObjectURL(originalFile);
        
        await new Promise(resolve => {
          img.onload = () => {
            resizedImages = [...resizedImages, {
              original: originalFile,
              resized: resizedBlob,
              originalWidth: img.width,
              originalHeight: img.height,
              newWidth: result.width,
              newHeight: result.height,
              originalSize: result.originalSize,
              newSize: result.processedSize,
              preview: URL.createObjectURL(resizedBlob)
            }];
            resolve(null);
          };
        });
      }
    }
  }

  async function resizeImageCanvas(file: File): Promise<ResizedImage | null> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        let newWidth = targetWidth || originalWidth;
        let newHeight = targetHeight || originalHeight;

        // Maintain aspect ratio if enabled
        if (maintainAspectRatio) {
          if (targetWidth && targetHeight) {
            const aspectRatio = originalWidth / originalHeight;
            const targetAspectRatio = targetWidth / targetHeight;
            
            if (aspectRatio > targetAspectRatio) {
              newHeight = Math.round(targetWidth / aspectRatio);
              newWidth = targetWidth;
            } else {
              newWidth = Math.round(targetHeight * aspectRatio);
              newHeight = targetHeight;
            }
          } else if (targetWidth) {
            const aspectRatio = originalWidth / originalHeight;
            newHeight = Math.round(targetWidth / aspectRatio);
            newWidth = targetWidth;
          } else if (targetHeight) {
            const aspectRatio = originalWidth / originalHeight;
            newWidth = Math.round(targetHeight * aspectRatio);
            newHeight = targetHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw resized image
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob
        const mimeType = format === 'png' ? 'image/png' : 
                        format === 'webp' ? 'image/webp' : 'image/jpeg';
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              original: file,
              resized: blob,
              originalWidth,
              originalHeight,
              newWidth,
              newHeight,
              originalSize: file.size,
              newSize: blob.size,
              preview: canvas.toDataURL(mimeType, quality / 100)
            });
          } else {
            resolve(null);
          }
        }, mimeType, quality / 100);
      };

      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  }

  function downloadImage(resized: ResizedImage) {
    const url = URL.createObjectURL(resized.resized);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized_${resized.original.name.split('.')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    resizedImages.forEach(resized => {
      downloadImage(resized);
    });
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="text-center">
    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
      <Maximize2 class="text-white" size={24} />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Image Resizer</h2>
    <p class="text-gray-600 dark:text-gray-400">
      Resize images to specific dimensions while maintaining quality and aspect ratio.
    </p>
  </div>

  <!-- Upload Area -->
  <div
    class="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 {
      dragOver 
        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
        : !usageStore.canConvert
          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if !usageStore.canConvert}
      <div class="text-gray-400 dark:text-gray-500">
        <Crown class="mx-auto mb-4" size={48} />
        <h3 class="text-lg font-medium mb-2">Daily Limit Reached</h3>
        <p class="text-sm mb-4">Upgrade to premium for unlimited image resizing</p>
        <button
          onclick={() => dispatch('upgrade')}
          class="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
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
        class="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
      >
        <Upload class="mr-2" size={16} />
        Select Images
      </label>
    {/if}
  </div>

  <!-- Resize Settings -->
  {#if files.length > 0}
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Settings class="mr-2" size={20} />
        Resize Settings
      </h3>
      
      <!-- Presets -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Presets
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          {#each resizePresets as preset}
            <button
              onclick={() => setPreset(preset)}
              class="p-2 text-xs border rounded-lg transition-all hover:border-orange-300 dark:hover:border-orange-500 border-gray-200 dark:border-gray-600"
            >
              <div class="font-medium">{preset.name}</div>
              <div class="text-gray-500 dark:text-gray-400">{preset.description}</div>
            </button>
          {/each}
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Dimensions -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dimensions (pixels)
          </label>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
              <input
                type="number"
                bind:value={targetWidth}
                placeholder="Auto"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
              <input
                type="number"
                bind:value={targetHeight}
                placeholder="Auto"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <label class="flex items-center text-sm">
            <input
              type="checkbox"
              bind:checked={maintainAspectRatio}
              class="mr-2"
            />
            <span class="text-gray-700 dark:text-gray-300">Maintain aspect ratio</span>
          </label>
        </div>

        <!-- Output Settings -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Output Settings
          </label>
          
          <div class="space-y-4">
            <!-- Format -->
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">Format</label>
              <div class="flex space-x-2">
                {#each ['jpeg', 'png', 'webp'] as fmt}
                  <label class="flex items-center">
                    <input
                      type="radio"
                      bind:group={format}
                      value={fmt}
                      class="mr-1"
                      disabled={fmt === 'webp' && !authStore.isPremium}
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300 uppercase">
                      {fmt}
                      {#if fmt === 'webp' && !authStore.isPremium}
                        <Crown class="inline ml-1 text-yellow-500" size={12} />
                      {/if}
                    </span>
                  </label>
                {/each}
              </div>
            </div>
            
            <!-- Quality -->
            <div>
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                bind:value={quality}
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <!-- Server Processing (Premium) -->
            {#if authStore.isPremium}
              <label class="flex items-center text-sm">
                <input
                  type="checkbox"
                  bind:checked={useServerProcessing}
                  class="mr-2"
                />
                <span class="text-gray-700 dark:text-gray-300">
                  Use server processing
                  <Crown class="inline ml-1 text-yellow-500" size={12} />
                </span>
              </label>
            {/if}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 mt-6">
        <button
          onclick={resizeImages}
          disabled={isResizing || !usageStore.canConvert || (!targetWidth && !targetHeight)}
          class="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {#if isResizing}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Resizing...
          {:else}
            <Zap class="mr-2" size={16} />
            Resize Images
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
        {#if resizedImages.length > 0}
          <button
            onclick={downloadAll}
            class="flex items-center px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Download class="mr-1" size={14} />
            Download All
          </button>
        {/if}
      </div>
      
      <div class="space-y-3">
        {#each files as file, index}
          {@const resized = resizedImages[index]}
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-3">
              <ImageIcon class="text-orange-500" size={20} />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                  {file.name}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                  {#if resized}
                    → {formatFileSize(resized.newSize)}
                    <span class="text-blue-600 dark:text-blue-400">
                      ({resized.originalWidth}×{resized.originalHeight} → {resized.newWidth}×{resized.newHeight})
                    </span>
                  {/if}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              {#if resized}
                <button
                  onclick={() => downloadImage(resized)}
                  class="p-1 text-green-600 hover:text-green-700 transition-colors"
                  title="Download resized image"
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

  <!-- Resize Results -->
  {#if resizedImages.length > 0}
    <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Resize Results
      </h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        {#each resizedImages.slice(0, 2) as resized}
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900 dark:text-white truncate">
                {resized.original.name}
              </h4>
              <button
                onclick={() => downloadImage(resized)}
                class="p-1 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <Download size={16} />
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500 dark:text-gray-400">Original</p>
                <p class="font-medium">{resized.originalWidth}×{resized.originalHeight}</p>
                <p class="text-gray-500 dark:text-gray-400">{formatFileSize(resized.originalSize)}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Resized</p>
                <p class="font-medium">{resized.newWidth}×{resized.newHeight}</p>
                <p class="text-gray-500 dark:text-gray-400">{formatFileSize(resized.newSize)}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      {#if resizedImages.length > 2}
        <p class="text-center text-gray-600 dark:text-gray-400 mt-4">
          And {resizedImages.length - 2} more images resized successfully
        </p>
      {/if}
    </div>
  {/if}
</div>