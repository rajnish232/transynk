<script lang="ts">
  import { goto } from '$app/navigation';
  import ImageResizer from '$lib/components/resize/ImageResizer.svelte';
  import { ArrowRight, Maximize2, Zap, Shield, Crown } from 'lucide-svelte';

  function handleUpgrade() {
    goto('/pricing');
  }
</script>

<svelte:head>
  <title>Image Resizer - Resize Images Online | Transynk</title>
  <meta name="description" content="Resize images online for free. Change image dimensions while maintaining quality and aspect ratio. Perfect for social media, web, and print." />
  <meta name="keywords" content="image resizer, resize images, change image size, image dimensions, photo resizer" />
  
  <meta property="og:title" content="Image Resizer - Resize Images Online | Transynk" />
  <meta property="og:description" content="Resize images online for free. Change dimensions while maintaining quality." />
  <meta property="og:type" content="website" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Resizer",
    "description": "Resize images to specific dimensions while maintaining quality",
    "url": "https://transynk.com/resize-images",
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

<div class="max-w-6xl mx-auto space-y-12">
  <!-- Hero Section -->
  <section class="text-center py-8">
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
      <Maximize2 class="text-white" size={32} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      Image Resizer
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Resize images to any dimension while maintaining quality and aspect ratio. 
      Perfect for social media, web optimization, and print preparation.
    </p>

    <!-- Key Benefits -->
    <div class="flex flex-wrap justify-center gap-6 mb-8">
      <div class="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
        <Shield size={20} />
        <span class="font-medium">Quality Preserved</span>
      </div>
      <div class="flex items-center space-x-2 text-red-600 dark:text-red-400">
        <Zap size={20} />
        <span class="font-medium">Instant Resize</span>
      </div>
      <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
        <Maximize2 size={20} />
        <span class="font-medium">Custom Dimensions</span>
      </div>
    </div>
  </section>

  <!-- Image Resizer Component -->
  <section>
    <ImageResizer on:upgrade={handleUpgrade} />
  </section>

  <!-- Features -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Professional Image Resizing
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Maximize2 class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Precise Dimensions</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Set exact width and height or use quick presets for common sizes like social media formats.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Shield class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Aspect Ratio Control</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Maintain original proportions or stretch to exact dimensions based on your needs.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Crown class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Server Processing</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Premium users get access to server-side processing with Sharp for superior quality.
        </p>
      </div>
    </div>
  </section>

  <!-- Common Use Cases -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Popular Resize Presets
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Social Media</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Instagram Square</span>
            <span class="font-medium">1080×1080</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Facebook Cover</span>
            <span class="font-medium">1200×630</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Twitter Header</span>
            <span class="font-medium">1500×500</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Web & Display</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Full HD</span>
            <span class="font-medium">1920×1080</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Thumbnail</span>
            <span class="font-medium">300×200</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Banner</span>
            <span class="font-medium">1500×500</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Profile & Avatar</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Profile Picture</span>
            <span class="font-medium">400×400</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Small Avatar</span>
            <span class="font-medium">128×128</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Large Avatar</span>
            <span class="font-medium">512×512</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Frequently Asked Questions
    </h2>
    
    <div class="max-w-3xl mx-auto space-y-4">
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          What's the difference between client and server processing?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Client processing happens in your browser using Canvas API - it's fast and private. 
          Server processing uses Sharp library for superior quality and supports advanced features, 
          available for premium users.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Will resizing reduce image quality?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          When downsizing, quality is generally preserved. When upsizing, some quality loss may occur. 
          Our algorithms are optimized to maintain the best possible quality during resize operations.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Can I resize multiple images at once?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Yes! You can select multiple images and resize them all with the same settings. 
          Premium users get access to batch server processing for even better results.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          What image formats are supported?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          We support JPG, PNG, and WebP formats. Premium users can output to WebP format 
          for better compression and quality.
        </div>
      </details>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Need Professional Image Processing?
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for server-side processing with Sharp, batch operations, and unlimited daily resizing.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center"
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