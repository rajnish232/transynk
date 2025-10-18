<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Upload, File, X, AlertCircle } from 'lucide-svelte';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { authStore } from '$lib/stores/auth.svelte.js';

  interface Props {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    disabled?: boolean;
  }

  let { 
    accept = '*/*', 
    multiple = true, 
    maxSize = 100,
    disabled = false 
  }: Props = $props();

  const dispatch = createEventDispatcher();

  let isDragging = $state(false);
  let files = $state<File[]>([]);
  let error = $state('');
  let fileInput: HTMLInputElement;

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled && usageStore.canConvert) {
      isDragging = true;
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    
    if (disabled || !usageStore.canConvert) return;

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    handleFiles(droppedFiles);
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const selectedFiles = Array.from(target.files || []);
    handleFiles(selectedFiles);
  }

  function handleFiles(newFiles: File[]) {
    error = '';

    // Everyone can convert unlimited with ads - no quota check needed

    // Validate files
    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (file.size > maxSize * 1024 * 1024) {
        error = `File "${file.name}" is too large. Maximum size is ${maxSize}MB.`;
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (multiple) {
      files = [...files, ...validFiles];
    } else {
      files = [validFiles[0]];
    }

    dispatch('filesSelected', { files: validFiles });
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    dispatch('fileRemoved', { index });
  }

  function openFileDialog() {
    if (!disabled && usageStore.canConvert) {
      fileInput?.click();
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  $effect(() => {
    // Clear files when quota is exceeded
    if (!usageStore.canConvert && files.length > 0) {
      files = [];
    }
  });
</script>

<div class="w-full">
  <!-- File Input -->
  <input
    bind:this={fileInput}
    type="file"
    {accept}
    {multiple}
    onchange={handleFileSelect}
    class="hidden"
  />

  <!-- Upload Area -->
  <div
    class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 {
      isDragging 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : disabled || !usageStore.canConvert
          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="button"
    tabindex="0"
    onclick={openFileDialog}
    onkeydown={(e) => e.key === 'Enter' && openFileDialog()}
  >
    {#if disabled || !usageStore.canConvert}
      <div class="text-gray-400 dark:text-gray-500">
        <AlertCircle class="mx-auto mb-4" size={48} />
        <h3 class="text-lg font-medium mb-2">
          {!usageStore.canConvert ? 'Daily Limit Reached' : 'Upload Disabled'}
        </h3>
        <p class="text-sm">
          {!usageStore.canConvert 
            ? 'Upgrade to premium for unlimited conversions'
            : 'File upload is currently disabled'}
        </p>
        {#if !usageStore.canConvert}
          <button
            onclick={() => dispatch('upgrade')}
            class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            Upgrade Now
          </button>
        {/if}
      </div>
    {:else}
      <div class="text-gray-600 dark:text-gray-400">
        <Upload class="mx-auto mb-4 {isDragging ? 'text-blue-500 scale-110' : ''} transition-all duration-300" size={48} />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDragging ? 'Drop files here' : 'Upload your files'}
        </h3>
        <p class="text-sm mb-4">
          Drag and drop files here, or click to browse
        </p>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Maximum file size: {maxSize}MB
          {#if !authStore.isPremium}
            • {usageStore.remainingConversions} conversions remaining today
          {/if}
        </div>
      </div>
    {/if}
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center">
        <AlertCircle class="text-red-500 mr-2" size={16} />
        <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    </div>
  {/if}

  <!-- File List -->
  {#if files.length > 0}
    <div class="mt-6 space-y-3">
      <h4 class="font-medium text-gray-900 dark:text-white">Selected Files</h4>
      {#each files as file, index}
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center space-x-3">
            <File class="text-blue-500" size={20} />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {file.name}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onclick={() => removeFile(index)}
            class="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>