<script lang="ts">
  import { goto } from '$app/navigation';
  import ImageCompressor from '$lib/components/compression/ImageCompressor.svelte';
  import { ArrowRight, Image, Zap, Shield, Crown } from 'lucide-svelte';

  function handleUpgrade() {
    goto('/pricing');
  }
</script>

<svelte:head>
  <title>Image Compressor - Reduce Image File Sizes | Transynk</title>
  <meta name="description" content="Compress images online for free. Reduce JPG, PNG, WebP file sizes while maintaining quality. Perfect for web optimization and storage savings." />
  <meta name="keywords" content="image compressor, compress images, reduce image size, optimize images, JPG compressor, PNG compressor" />
  
  <meta property="og:title" content="Image Compressor - Reduce Image File Sizes | Transynk" />
  <meta property="og:description" content="Compress images online for free. Reduce file sizes while maintaining quality." />
  <meta property="og:type" content="website" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Image Compressor",
    "description": "Compress images to reduce file sizes while maintaining quality",
    "url": "https://transynk.com/compress-images",
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
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
      <Image class="text-white" size={32} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      Image Compressor
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Reduce image file sizes without losing quality. Perfect for web optimization, 
      faster loading times, and saving storage space.
    </p>

    <!-- Key Benefits -->
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
        <Image size={20} />
        <span class="font-medium">Quality Preserved</span>
      </div>
    </div>
  </section>

  <!-- Image Compressor Component -->
  <section>
    <ImageCompressor on:upgrade={handleUpgrade} />
  </section>

  <!-- Features -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Why Use Our Image Compressor?
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Shield class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">100% Private</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          All compression happens locally in your browser. Your images never leave your device.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Zap class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Instant compression with real-time preview. No waiting or uploading required.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Image class="text-white" size={24} />
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Quality Control</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Adjust compression levels to find the perfect balance between size and quality.
        </p>
      </div>
    </div>
  </section>

  <!-- Use Cases -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Perfect For
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
          <span class="text-blue-600 dark:text-blue-400 text-lg">🌐</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Web Optimization</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Faster loading websites with optimized images
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
          <span class="text-green-600 dark:text-green-400 text-lg">📱</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Social Media</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Optimize images for social platforms
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
          <span class="text-purple-600 dark:text-purple-400 text-lg">💾</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Storage Savings</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Free up space on your devices
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
        <div class="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
          <span class="text-orange-600 dark:text-orange-400 text-lg">📧</span>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Email Attachments</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Reduce file sizes for email sending
        </p>
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
          How much can I compress my images?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Compression results vary by image type and content. Typically, you can achieve 30-70% size reduction 
          while maintaining good visual quality. Photos with many colors compress less than graphics with fewer colors.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          What image formats are supported?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          We support JPG/JPEG, PNG, and WebP formats. Premium users get access to WebP output format, 
          which provides superior compression compared to traditional formats.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Is there a limit on file size or number of images?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Free users can compress images up to 25MB each, with 3 compressions per day. 
          Premium users get 100MB file limit and unlimited daily compressions.
        </div>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary class="p-4 font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          Will compressing images reduce their quality?
        </summary>
        <div class="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
          Our compression algorithm is designed to maintain visual quality while reducing file size. 
          You can adjust the quality slider to find the perfect balance for your needs.
        </div>
      </details>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Need More Compression Power?
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for unlimited image compression, larger file sizes, and WebP format support.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center"
      >
        <Crown class="mr-2" size={18} />
        Upgrade to Premium
        <ArrowRight class="ml-2" size={18} />
      </button>
      <button
        onclick={() => goto('/compress-files')}
        class="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        Try File Compressor
      </button>
    </div>
  </section>
</div>