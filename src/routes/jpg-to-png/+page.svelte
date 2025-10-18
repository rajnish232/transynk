<script lang="ts">
  import { goto } from '$app/navigation';
  import FileUploader from '$lib/components/upload/FileUploader.svelte';
  import { ArrowRight, Image, Download, Shield, Zap } from 'lucide-svelte';

  let selectedFiles = $state<File[]>([]);

  function handleFilesSelected(event: CustomEvent) {
    const { files } = event.detail;
    selectedFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg'))
    );
    
    if (selectedFiles.length > 0) {
      startConversion();
    }
  }

  async function startConversion() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    goto('/convert');
  }
</script>

<svelte:head>
  <title>JPG to PNG Converter - Free Online Image Converter | Transynk</title>
  <meta name="description" content="Convert JPG to PNG images instantly with Transynk. Free, secure, and fast image conversion. Preserve transparency and quality with our online tool." />
  <meta name="keywords" content="JPG to PNG, JPEG to PNG, image converter, convert images, free image converter, transparency" />
  
  <meta property="og:title" content="JPG to PNG Converter - Free Online Image Converter | Transynk" />
  <meta property="og:description" content="Convert JPG to PNG images instantly. Free, secure, and fast conversion with transparency support." />
  <meta property="og:type" content="website" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JPG to PNG Converter",
    "description": "Convert JPG images to PNG format with transparency support",
    "url": "https://transynk.com/jpg-to-png",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-12">
  <!-- Hero Section -->
  <section class="text-center py-8">
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
      <Image class="text-white" size={32} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      JPG to PNG Converter
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Convert your JPG images to PNG format instantly. 
      Perfect for adding transparency or improving image quality.
    </p>

    <div class="flex flex-wrap justify-center gap-6 mb-8">
      <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <Shield size={20} />
        <span class="font-medium">Privacy Protected</span>
      </div>
      <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
        <Zap size={20} />
        <span class="font-medium">Instant Results</span>
      </div>
      <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
        <Download size={20} />
        <span class="font-medium">High Quality</span>
      </div>
    </div>
  </section>

  <!-- File Converter -->
  <section>
    <FileUploader
      accept=".jpg,.jpeg,image/jpeg"
      multiple={true}
      on:filesSelected={handleFilesSelected}
    />
  </section>

  <!-- Benefits -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Why Convert JPG to PNG?
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">α</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Transparency Support</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          PNG format supports transparent backgrounds, perfect for logos and graphics
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Image class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Lossless Quality</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          PNG uses lossless compression, preserving image quality without artifacts
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <span class="text-white font-bold text-lg">∞</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Better for Graphics</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Ideal for images with text, logos, or graphics with sharp edges
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Download class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Web Compatible</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          PNG is widely supported across all web browsers and platforms
        </p>
      </div>
    </div>
  </section>

  <!-- Comparison -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      JPG vs PNG: When to Use Each Format
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white text-sm font-bold">JPG</span>
          </div>
          JPEG Format
        </h3>
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Smaller file sizes</li>
          <li>• Best for photographs</li>
          <li>• Lossy compression</li>
          <li>• No transparency support</li>
          <li>• Ideal for web images</li>
        </ul>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white text-sm font-bold">PNG</span>
          </div>
          PNG Format
        </h3>
        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Larger file sizes</li>
          <li>• Best for graphics & logos</li>
          <li>• Lossless compression</li>
          <li>• Supports transparency</li>
          <li>• Perfect for editing</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Common Questions
    </h2>
    
    <div class="space-y-4">
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Will converting JPG to PNG improve image quality?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Converting from JPG to PNG won't improve the existing quality, but it will prevent further quality loss. 
          PNG uses lossless compression, so subsequent edits won't degrade the image.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Why are PNG files larger than JPG?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          PNG uses lossless compression, which preserves all image data. JPG uses lossy compression, 
          which discards some data to achieve smaller file sizes. The trade-off is quality vs file size.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Can I convert multiple JPG files at once?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Yes! Our converter supports batch conversion. Simply select multiple JPG files and 
          they'll all be converted to PNG format simultaneously.
        </div>
      </details>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Convert More Image Formats
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for unlimited conversions and access to advanced image formats like WEBP, TIFF, and more.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center"
      >
        Upgrade to Premium
        <ArrowRight class="ml-2" size={18} />
      </button>
      <button
        onclick={() => goto('/')}
        class="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        Try Other Formats
      </button>
    </div>
  </section>
</div>