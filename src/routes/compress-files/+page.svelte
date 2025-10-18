<script lang="ts">
  import { goto } from '$app/navigation';
  import FileCompressor from '$lib/components/compression/FileCompressor.svelte';
  import { ArrowRight, Archive, Zap, Shield, Crown } from 'lucide-svelte';

  function handleUpgrade() {
    goto('/pricing');
  }
</script>

<svelte:head>
  <title>File Compressor - Reduce File Sizes & Create Archives | Transynk</title>
  <meta name="description" content="Compress files online for free. Reduce file sizes and create ZIP archives. Support for all file types with advanced compression algorithms." />
  <meta name="keywords" content="file compressor, compress files, ZIP archive, reduce file size, file compression online" />
  
  <meta property="og:title" content="File Compressor - Reduce File Sizes & Create Archives | Transynk" />
  <meta property="og:description" content="Compress files online for free. Reduce file sizes and create ZIP archives." />
  <meta property="og:type" content="website" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "File Compressor",
    "description": "Compress files and create archives to save storage space",
    "url": "https://transynk.com/compress-files",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-12">
  <!-- Hero Section -->
  <section class="text-center py-8">
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
      <Archive class="text-white" size={32} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      File Compressor
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Compress files to save storage space and improve transfer speeds. 
      Create ZIP archives and reduce file sizes with advanced compression.
    </p>

    <!-- Key Benefits -->
    <div class="flex flex-wrap justify-center gap-6 mb-8">
      <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
        <Shield size={20} />
        <span class="font-medium">Secure & Private</span>
      </div>
      <div class="flex items-center space-x-2 text-pink-600 dark:text-pink-400">
        <Zap size={20} />
        <span class="font-medium">Fast Compression</span>
      </div>
      <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
        <Archive size={20} />
        <span class="font-medium">ZIP Archives</span>
      </div>
    </div>
  </section>

  <!-- File Compressor Component -->
  <section>
    <FileCompressor on:upgrade={handleUpgrade} />
  </section>

  <!-- Features -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Powerful Compression Features
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Archive class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Compress any file type including documents, images, videos, and more.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Zap class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Smart Compression</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Advanced algorithms automatically optimize compression for each file type.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Crown class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">ZIP Archives</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Create compressed ZIP archives from multiple files (Premium feature).
        </p>
      </div>
    </div>
  </section>

  <!-- Compression Levels -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Choose Your Compression Level
    </h2>
    
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="text-center mb-4">
          <div class="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <span class="text-green-600 dark:text-green-400 font-bold">1</span>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Fast</h3>
        </div>
        <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• Quick compression</li>
          <li>• Minimal processing time</li>
          <li>• Good for large files</li>
          <li>• Moderate size reduction</li>
        </ul>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-purple-500">
        <div class="text-center mb-4">
          <div class="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <span class="text-purple-600 dark:text-purple-400 font-bold">6</span>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Balanced</h3>
          <span class="text-xs text-purple-600 dark:text-purple-400 font-medium">Recommended</span>
        </div>
        <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• Optimal speed vs size</li>
          <li>• Best for most files</li>
          <li>• Good compression ratio</li>
          <li>• Reasonable processing time</li>
        </ul>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="text-center mb-4">
          <div class="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <span class="text-red-600 dark:text-red-400 font-bold">9</span>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Maximum</h3>
        </div>
        <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• Highest compression</li>
          <li>• Smallest file sizes</li>
          <li>• Longer processing time</li>
          <li>• Best for archiving</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Use Cases -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      When to Use File Compression
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-blue-600 dark:text-blue-400 text-lg">💾</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Storage Optimization</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Free up disk space by compressing large files and folders.
            </p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-green-600 dark:text-green-400 text-lg">📤</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">File Sharing</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Reduce upload times and bandwidth usage when sharing files.
            </p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-purple-600 dark:text-purple-400 text-lg">📦</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Archiving</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Create compressed archives for long-term storage and backup.
            </p>
          </div>
        </div>
      </div>
      
      <div class="space-y-6">
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-orange-600 dark:text-orange-400 text-lg">📧</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Email Attachments</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Compress files to meet email attachment size limits.
            </p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-pink-600 dark:text-pink-400 text-lg">☁️</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Cloud Storage</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Maximize your cloud storage space with compressed files.
            </p>
          </div>
        </div>
        
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-red-600 dark:text-red-400 text-lg">🚀</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Performance</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Improve application performance with smaller file sizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Common Questions
    </h2>
    
    <div class="max-w-3xl mx-auto space-y-4">
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          What types of files can I compress?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          You can compress any file type including documents (PDF, DOC, TXT), images (JPG, PNG), 
          videos (MP4, AVI), audio files (MP3, WAV), and more. Our algorithm adapts to each file type.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          How much compression can I expect?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Compression ratios vary by file type and content. Text files can compress up to 90%, 
          while already compressed files (like JPG or MP3) may only compress 10-20%.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Can I create password-protected archives?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Password protection for ZIP archives is a premium feature. Upgrade to premium to create 
          secure, password-protected archives for sensitive files.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Is there a limit on file size?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Free users can compress files up to 25MB each. Premium users get increased limits up to 100MB 
          per file and can create larger archives.
        </div>
      </details>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Unlock Advanced Compression
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for ZIP archives, larger file limits, password protection, and unlimited daily compressions.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
      >
        <Crown class="mr-2" size={18} />
        Upgrade to Premium
        <ArrowRight class="ml-2" size={18} />
      </button>
      <button
        onclick={() => goto('/compress-images')}
        class="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        Try Image Compressor
      </button>
    </div>
  </section>
</div>