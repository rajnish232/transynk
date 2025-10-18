<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  
  import FileConverter from '$lib/components/conversion/FileConverter.svelte';
  import QuotaDisplay from '$lib/components/usage/QuotaDisplay.svelte';
  
  import { 
    Zap, 
    Shield, 
    Infinity, 
    Star, 
    ArrowRight, 
    CheckCircle,
    Image,
    FileText,
    Video,
    Music,
    Maximize2
  } from 'lucide-svelte';

  let selectedFiles = $state<File[]>([]);
  let isConverting = $state(false);

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All conversions happen locally in your browser. Your files never leave your device.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant conversions powered by WebAssembly. No waiting, no uploading.'
    },
    {
      icon: Infinity,
      title: 'Unlimited Formats',
      description: 'Support for images, documents, videos, audio, and more file formats.'
    },
    {
      icon: Star,
      title: 'Premium Features',
      description: 'Advanced formats, file compression, and unlimited conversions available.'
    }
  ];

  const popularConversions = [
    { from: 'PDF', to: 'Word', icon: FileText, href: '/pdf-to-word' },
    { from: 'JPG', to: 'PNG', icon: Image, href: '/jpg-to-png' },
    { from: 'MP4', to: 'MP3', icon: Video, href: '/mp4-to-mp3' },
    { from: 'WAV', to: 'MP3', icon: Music, href: '/wav-to-mp3' }
  ];

  const compressionTools = [
    { name: 'Image Compressor', description: 'Reduce image file sizes', icon: Image, href: '/compress-images' },
    { name: 'Image Resizer', description: 'Resize images to perfect dimensions', icon: Maximize2, href: '/resize-images' },
    { name: 'File Compressor', description: 'Compress any file type', icon: FileText, href: '/compress-files' }
  ];

  onMount(() => {
    // Listen for dropped files from layout
    const handleFilesDropped = (event: CustomEvent) => {
      const { files } = event.detail;
      handleFilesSelected({ detail: { files } });
    };

    window.addEventListener('filesDropped', handleFilesDropped as EventListener);

    return () => {
      window.removeEventListener('filesDropped', handleFilesDropped as EventListener);
    };
  });

  function handleFilesSelected(event: CustomEvent) {
    const { files } = event.detail;
    selectedFiles = files;
    
    if (files.length > 0) {
      // Navigate to convert page or start conversion
      startConversion();
    }
  }

  function handleFileRemoved(event: CustomEvent) {
    const { index } = event.detail;
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
  }

  async function startConversion() {
    if (selectedFiles.length === 0) return;

    if (!usageStore.canConvert) {
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited conversions');
      return;
    }

    isConverting = true;
    
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the conversion
      for (const file of selectedFiles) {
        await usageStore.logConversion(
          file.type || 'unknown',
          'converted',
          file.size,
          2000
        );
      }

      toastStore.success('Conversion completed!', `Successfully converted ${selectedFiles.length} file(s)`);
      selectedFiles = [];
    } catch (error) {
      toastStore.error('Conversion failed', 'Please try again or contact support');
    } finally {
      isConverting = false;
    }
  }

  function handleUpgrade() {
    goto('/pricing');
  }
</script>

<svelte:head>
  <title>Transynk - Modern File Converter & Compressor</title>
  <meta name="description" content="Convert and compress files instantly with Transynk. Support for images, documents, videos, and more. Privacy-first local processing." />
</svelte:head>

<div class="space-y-16">
  <!-- Hero Section -->
  <section class="text-center py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Convert Files
        <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Instantly
        </span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Transform any file format with our modern, privacy-first converter. 
        No uploads, no waiting - everything happens in your browser.
      </p>
      
      <!-- Usage Stats -->
      <div class="flex justify-center mb-12">
        <QuotaDisplay on:upgrade={handleUpgrade} />
      </div>
    </div>
  </section>

  <!-- File Converter -->
  <section class="max-w-4xl mx-auto">
    <FileConverter on:upgrade={handleUpgrade} />
  </section>

  <!-- Popular Conversions -->
  <section class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Popular Conversions
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each popularConversions as conversion}
        <a
          href={conversion.href}
          class="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <conversion.icon class="text-white" size={20} />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {conversion.from} → {conversion.to}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Convert now
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- Compression Tools -->
  <section class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Compression Tools
    </h2>
    <div class="grid md:grid-cols-3 gap-6">
      {#each compressionTools as tool}
        <a
          href={tool.href}
          class="group p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg transition-all duration-200"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <tool.icon class="text-white" size={24} />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                {tool.name}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
            </div>
            <ArrowRight class="text-gray-400 group-hover:text-green-500 transition-colors" size={20} />
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- Features -->
  <section class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
      Why Choose Transynk?
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each features as feature}
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <feature.icon class="text-white" size={24} />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      Ready for Unlimited Conversions?
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Upgrade to premium and unlock unlimited conversions, advanced formats, 
      file compression, and priority support.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
      >
        View Pricing
        <ArrowRight class="ml-2" size={18} />
      </button>
      <button
        onclick={() => goto('/about')}
        class="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        Learn More
      </button>
    </div>
  </section>

  <!-- Trust Indicators -->
  <section class="text-center py-8">
    <div class="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400">
      <div class="flex items-center space-x-2">
        <CheckCircle size={20} />
        <span class="text-sm">100% Private</span>
      </div>
      <div class="flex items-center space-x-2">
        <CheckCircle size={20} />
        <span class="text-sm">No File Uploads</span>
      </div>
      <div class="flex items-center space-x-2">
        <CheckCircle size={20} />
        <span class="text-sm">Instant Processing</span>
      </div>
      <div class="flex items-center space-x-2">
        <CheckCircle size={20} />
        <span class="text-sm">Secure & Fast</span>
      </div>
    </div>
  </section>
</div>