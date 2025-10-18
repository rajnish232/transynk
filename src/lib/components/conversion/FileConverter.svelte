<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { 
    Upload, 
    Download, 
    FileText, 
    Image as ImageIcon, 
    Video, 
    Music, 
    Archive,
    Zap, 
    Crown,
    X,
    RotateCcw,
    Settings,
    ArrowRight
  } from 'lucide-svelte';

  interface ConvertedFile {
    original: File;
    converted: Blob;
    originalFormat: string;
    targetFormat: string;
    downloadName: string;
  }

  let files = $state<File[]>([]);
  let convertedFiles = $state<ConvertedFile[]>([]);
  let selectedFormat = $state('');
  let isConverting = $state(false);
  let dragOver = $state(false);

  const dispatch = createEventDispatcher();

  // Comprehensive format categories
  const formatCategories = {
    image: {
      name: 'Images',
      icon: ImageIcon,
      formats: [
        { value: 'jpg', label: 'JPG', description: 'Best for photos' },
        { value: 'png', label: 'PNG', description: 'Best for graphics' },
        { value: 'webp', label: 'WebP', description: 'Modern format', premium: true },
        { value: 'gif', label: 'GIF', description: 'Animated images' },
        { value: 'bmp', label: 'BMP', description: 'Uncompressed' },
        { value: 'tiff', label: 'TIFF', description: 'High quality', premium: true }
      ]
    },
    document: {
      name: 'Documents',
      icon: FileText,
      formats: [
        { value: 'pdf', label: 'PDF', description: 'Portable document' },
        { value: 'docx', label: 'Word', description: 'Microsoft Word' },
        { value: 'txt', label: 'Text', description: 'Plain text' },
        { value: 'rtf', label: 'RTF', description: 'Rich text format' },
        { value: 'odt', label: 'ODT', description: 'OpenDocument', premium: true }
      ]
    },
    audio: {
      name: 'Audio',
      icon: Music,
      formats: [
        { value: 'mp3', label: 'MP3', description: 'Most compatible' },
        { value: 'wav', label: 'WAV', description: 'Uncompressed' },
        { value: 'aac', label: 'AAC', description: 'High quality' },
        { value: 'ogg', label: 'OGG', description: 'Open source' },
        { value: 'flac', label: 'FLAC', description: 'Lossless', premium: true },
        { value: 'm4a', label: 'M4A', description: 'Apple format', premium: true }
      ]
    },
    video: {
      name: 'Video',
      icon: Video,
      formats: [
        { value: 'mp4', label: 'MP4', description: 'Most compatible' },
        { value: 'avi', label: 'AVI', description: 'Windows standard' },
        { value: 'mov', label: 'MOV', description: 'Apple format' },
        { value: 'webm', label: 'WebM', description: 'Web optimized' },
        { value: 'mkv', label: 'MKV', description: 'High quality', premium: true },
        { value: 'wmv', label: 'WMV', description: 'Windows Media', premium: true }
      ]
    },
    archive: {
      name: 'Archives',
      icon: Archive,
      formats: [
        { value: 'zip', label: 'ZIP', description: 'Most compatible' },
        { value: 'rar', label: 'RAR', description: 'High compression', premium: true },
        { value: '7z', label: '7Z', description: 'Best compression', premium: true },
        { value: 'tar', label: 'TAR', description: 'Unix standard' }
      ]
    }
  };

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    
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
    convertedFiles = convertedFiles.filter((_, i) => i !== index);
  }

  function clearAll() {
    files = [];
    convertedFiles = [];
    selectedFormat = '';
  }

  function getFileCategory(file: File): string {
    const type = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    if (type.includes('zip') || type.includes('archive')) return 'archive';
    
    // Check by extension
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(extension)) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(extension)) return 'audio';
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) return 'document';
    if (['zip', 'rar', '7z', 'tar'].includes(extension)) return 'archive';
    
    return 'document'; // Default fallback
  }

  function getAvailableFormats() {
    if (files.length === 0) return [];
    
    const categories = new Set(files.map(file => getFileCategory(file)));
    const availableFormats: any[] = [];
    
    categories.forEach(category => {
      if (formatCategories[category as keyof typeof formatCategories]) {
        const categoryData = formatCategories[category as keyof typeof formatCategories];
        availableFormats.push({
          category: category,
          name: categoryData.name,
          icon: categoryData.icon,
          formats: categoryData.formats
        });
      }
    });
    
    return availableFormats;
  }

  async function convertFiles() {
    if (!selectedFormat || files.length === 0) {
      toastStore.error('Missing selection', 'Please select files and output format');
      return;
    }

    isConverting = true;
    convertedFiles = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const converted = await convertFile(file, selectedFormat);
        
        if (converted) {
          convertedFiles = [...convertedFiles, converted];
          
          // Log the conversion
          await usageStore.logConversion(
            file.type || 'unknown',
            selectedFormat,
            file.size,
            2000
          );
        }
      }

      toastStore.success(
        'Conversion completed!', 
        `Successfully converted ${convertedFiles.length} file(s) to ${selectedFormat.toUpperCase()}`
      );
    } catch (error) {
      console.error('Conversion error:', error);
      toastStore.error('Conversion failed', 'Please try again or contact support');
    } finally {
      isConverting = false;
    }
  }

  async function convertFile(file: File, targetFormat: string): Promise<ConvertedFile | null> {
    try {
      // Import the real file converter
      const { FileConverter } = await import('$lib/utils/fileConverter.js');
      
      // Perform real conversion
      const result = await FileConverter.convertFile(file, targetFormat, {
        quality: 0.9,
        maintainAspectRatio: true
      });
      
      return {
        original: file,
        converted: result.blob,
        originalFormat: file.name.split('.').pop() || '',
        targetFormat: targetFormat,
        downloadName: result.filename
      };
    } catch (error) {
      console.error('File conversion error:', error);
      toastStore.error('Conversion failed', `Failed to convert ${file.name}: ${error.message}`);
      return null;
    }
  }

  function getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      bmp: 'image/bmp',
      tiff: 'image/tiff',
      
      // Documents
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      rtf: 'application/rtf',
      odt: 'application/vnd.oasis.opendocument.text',
      
      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      aac: 'audio/aac',
      ogg: 'audio/ogg',
      flac: 'audio/flac',
      m4a: 'audio/mp4',
      
      // Video
      mp4: 'video/mp4',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      webm: 'video/webm',
      mkv: 'video/x-matroska',
      wmv: 'video/x-ms-wmv',
      
      // Archives
      zip: 'application/zip',
      rar: 'application/vnd.rar',
      '7z': 'application/x-7z-compressed',
      tar: 'application/x-tar'
    };
    
    return mimeTypes[format] || 'application/octet-stream';
  }

  function downloadFile(converted: ConvertedFile) {
    const url = URL.createObjectURL(converted.converted);
    const a = document.createElement('a');
    a.href = url;
    a.download = converted.downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toastStore.success('Download started', `${converted.downloadName} is downloading`);
  }

  function downloadAll() {
    convertedFiles.forEach((converted, index) => {
      setTimeout(() => downloadFile(converted), index * 500); // Stagger downloads
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
    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
      <Zap class="text-white" size={24} />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Universal File Converter</h2>
    <p class="text-gray-600 dark:text-gray-400">
      Convert any file to any format. Choose your files and select the output format.
    </p>
  </div>

  <!-- Upload Area -->
  <div
    class="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 {
      dragOver 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    <Upload class="mx-auto mb-4 text-gray-400" size={48} />
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
      Drop files here or click to browse
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Supports images, documents, audio, video, and archive files
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
      class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
    >
      <Upload class="mr-2" size={16} />
      Select Files
    </label>
  </div>

  <!-- Format Selection -->
  {#if files.length > 0}
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Settings class="mr-2" size={20} />
        Choose Output Format
      </h3>
      
      {#each getAvailableFormats() as category}
        <div class="mb-6">
          <h4 class="flex items-center text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            <svelte:component this={category.icon} class="mr-2" size={18} />
            {category.name}
          </h4>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {#each category.formats as format}
              <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-all {
                selectedFormat === format.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              } {format.premium && !authStore.isPremium ? 'opacity-60' : ''}">
                <input
                  type="radio"
                  bind:group={selectedFormat}
                  value={format.value}
                  class="sr-only"
                  disabled={format.premium && !authStore.isPremium}
                />
                <div class="flex-1">
                  <div class="flex items-center">
                    <span class="font-medium text-sm {
                      selectedFormat === format.value 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }">
                      {format.label}
                    </span>
                    {#if format.premium && !authStore.isPremium}
                      <Crown class="ml-1 text-yellow-500" size={12} />
                    {/if}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format.description}
                  </div>
                </div>
              </label>
            {/each}
          </div>
        </div>
      {/each}

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 mt-6">
        <button
          onclick={convertFiles}
          disabled={isConverting || !selectedFormat}
          class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {#if isConverting}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Converting...
          {:else}
            <Zap class="mr-2" size={16} />
            Convert to {selectedFormat ? selectedFormat.toUpperCase() : 'Format'}
          {/if}
        </button>
        
        <button
          onclick={clearAll}
          class="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
          Files to Convert ({files.length})
        </h3>
        {#if convertedFiles.length > 0}
          <button
            onclick={downloadAll}
            class="flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download class="mr-2" size={16} />
            Download All ({convertedFiles.length})
          </button>
        {/if}
      </div>
      
      <div class="space-y-3">
        {#each files as file, index}
          {@const converted = convertedFiles[index]}
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-3 flex-1">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                {#if getFileCategory(file) === 'image'}
                  <ImageIcon class="text-blue-600" size={20} />
                {:else if getFileCategory(file) === 'video'}
                  <Video class="text-red-600" size={20} />
                {:else if getFileCategory(file) === 'audio'}
                  <Music class="text-green-600" size={20} />
                {:else if getFileCategory(file) === 'archive'}
                  <Archive class="text-purple-600" size={20} />
                {:else}
                  <FileText class="text-gray-600" size={20} />
                {/if}
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(file.size)}</span>
                  {#if converted}
                    <ArrowRight size={12} />
                    <span class="text-green-600 dark:text-green-400 font-medium">
                      {converted.targetFormat.toUpperCase()}
                    </span>
                  {:else if selectedFormat}
                    <ArrowRight size={12} />
                    <span class="text-blue-600 dark:text-blue-400">
                      → {selectedFormat.toUpperCase()}
                    </span>
                  {/if}
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              {#if converted}
                <button
                  onclick={() => downloadFile(converted)}
                  class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Download converted file"
                >
                  <Download size={16} />
                </button>
              {/if}
              <button
                onclick={() => removeFile(index)}
                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Conversion Results -->
  {#if convertedFiles.length > 0}
    <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Download class="mr-2" size={20} />
        Conversion Complete!
      </h3>
      
      <div class="grid md:grid-cols-3 gap-4 text-center mb-6">
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {convertedFiles.length}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Files Converted</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedFormat.toUpperCase()}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Output Format</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">
            Ready
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">For Download</p>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Your files have been successfully converted! Click the download buttons above or use "Download All" to get your files.
        </p>
        <button
          onclick={downloadAll}
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center mx-auto"
        >
          <Download class="mr-2" size={18} />
          Download All Files
        </button>
      </div>
    </div>
  {/if}
</div>