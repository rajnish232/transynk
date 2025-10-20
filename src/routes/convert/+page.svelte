<script lang="ts">
  import { goto } from '$app/navigation';
  import FileConverter from '$lib/components/conversion/FileConverter.svelte';
  import { ArrowRight, Zap, Shield, Infinity } from 'lucide-svelte';

  function handleUpgrade() {
    goto('/pricing');
  }
</script>

<svelte:head>
  <title>File Converter - Convert Any File Format | VastuSphere</title>
  <meta name="description" content="Convert any file format with VastuSphere. Support for images, documents, audio, video, and archives. Choose your output format and download instantly." />
  <meta name="keywords" content="file converter, convert files, file format converter, online converter, free converter" />
</svelte:head>

<div class="max-w-6xl mx-auto space-y-12">
  <!-- Hero Section -->
  <section class="text-center py-8">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
      Universal File Converter
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
      Convert any file to any format instantly. Choose from 100+ supported formats 
      including images, documents, audio, video, and archives.
    </p>

    <!-- Key Benefits -->
    <div class="flex flex-wrap justify-center gap-6 mb-8">
      <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
        <Shield size={20} />
        <span class="font-medium">100% Private</span>
      </div>
      <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
        <Zap size={20} />
        <span class="font-medium">Instant Results</span>
      </div>
      <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <Infinity size={20} />
        <span class="font-medium">Unlimited Usage</span>
      </div>
    </div>
  </section>

  <!-- File Converter Component -->
  <section>
    <FileConverter on:upgrade={handleUpgrade} />
  </section>

  <!-- Supported Formats -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Supported File Formats
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <span class="text-blue-600 dark:text-blue-400 text-lg">🖼️</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Images</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          JPG, PNG, WebP, GIF, BMP, TIFF, SVG
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
          <span class="text-green-600 dark:text-green-400 text-lg">📄</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Documents</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          PDF, Word, Excel, PowerPoint, TXT
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
          <span class="text-purple-600 dark:text-purple-400 text-lg">🎵</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Audio</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          MP3, WAV, AAC, OGG, FLAC, M4A
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <span class="text-red-600 dark:text-red-400 text-lg">🎬</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Video</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          MP4, AVI, MOV, WebM, MKV, WMV
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
          <span class="text-orange-600 dark:text-orange-400 text-lg">📦</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Archives</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          ZIP, RAR, 7Z, TAR, GZ
        </p>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      How It Works
    </h2>
    
    <div class="grid md:grid-cols-4 gap-6">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          1
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Upload Files</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Drag and drop or select the files you want to convert
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          2
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Choose Format</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Select the output format from our extensive list
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          3
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Convert</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Our engine processes your files locally and securely
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          4
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Download your converted files instantly
        </p>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Why Choose VastuSphere?
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Shield class="text-white" size={24} />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          All conversions happen locally in your browser. Your files never leave your device.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Zap class="text-white" size={24} />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Powered by WebAssembly for instant conversions. No waiting, no uploading.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Infinity class="text-white" size={24} />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unlimited Usage</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Convert as many files as you want with our ad-supported free plan.
        </p>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Ready to Go Ad-Free?
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for an ad-free experience and access to premium formats.
    </p>
    <button
      onclick={() => goto('/pricing')}
      class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center mx-auto"
    >
      View Pricing
      <ArrowRight class="ml-2" size={18} />
    </button>
  </section>
</div>