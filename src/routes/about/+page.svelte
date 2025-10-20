<script lang="ts">
  import { goto } from '$app/navigation';
  import { Shield, Zap, Heart, Users, Globe, Award } from 'lucide-svelte';
</script>

<svelte:head>
  <title>About VastuSphere - Modern File Converter & Compressor</title>
  <meta name="description" content="Learn about VastuSphere, the modern file converter that prioritizes privacy, speed, and user experience. Convert and compress files with confidence." />
</svelte:head>

<div class="max-w-4xl mx-auto space-y-16">
  <!-- Hero Section -->
  <section class="text-center py-12">
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
      <span class="text-white font-bold text-2xl">T</span>
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
      About <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transynk</span>
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      We're on a mission to make file conversion and compression accessible, 
      private, and lightning-fast for everyone.
    </p>
  </section>

  <!-- Mission Statement -->
  <section class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
      <p class="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        To provide the world's most user-friendly, secure, and efficient file conversion platform. 
        We believe that powerful tools should be accessible to everyone, which is why we offer 
        unlimited conversions with ads, and premium ad-free experience for those who prefer it.
      </p>
    </div>
  </section>

  <!-- Core Values -->
  <section>
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
      What Makes Us Different
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
          <Shield class="text-white" size={24} />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Privacy First</h3>
        <p class="text-gray-600 dark:text-gray-400">
          All file processing happens locally in your browser. Your files never leave your device, 
          ensuring complete privacy and security.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Zap class="text-white" size={24} />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Powered by WebAssembly technology for instant conversions. No waiting, no uploading, 
          no server processing delays.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Heart class="text-white" size={24} />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">User Focused</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Designed with users in mind. Clean interface, intuitive controls, and unlimited usage 
          for everyone with optional ad-free experience.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Globe class="text-white" size={24} />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Globally Accessible</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Works on any device, any browser, anywhere in the world. No downloads, 
          no installations required.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
          <Users class="text-white" size={24} />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Community Driven</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Built based on user feedback and needs. We continuously improve based on 
          what our community wants.
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <Award class="text-white" size={24} />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Quality Focused</h3>
        <p class="text-gray-600 dark:text-gray-400">
          High-quality conversions with advanced algorithms. We never compromise on 
          the quality of your converted files.
        </p>
      </div>
    </div>
  </section>

  <!-- Features Overview -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
      What We Offer
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">File Conversion</h3>
        <ul class="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Convert between 100+ file formats</li>
          <li>• Images: JPG, PNG, WebP, GIF, BMP, TIFF</li>
          <li>• Documents: PDF, Word, Excel, PowerPoint</li>
          <li>• Audio: MP3, WAV, FLAC, AAC, OGG</li>
          <li>• Video: MP4, AVI, MOV, WebM, MKV</li>
          <li>• Archives: ZIP, RAR, 7Z, TAR</li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Advanced Tools</h3>
        <ul class="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• Image compression with quality control</li>
          <li>• Image resizing with preset dimensions</li>
          <li>• File compression and ZIP creation</li>
          <li>• Batch processing for multiple files</li>
          <li>• Custom quality and size settings</li>
          <li>• Social media optimized presets</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Technology -->
  <section>
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Built with Modern Technology
    </h2>
    
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
      <div class="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div class="text-4xl mb-3">⚡</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">WebAssembly</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Near-native performance in the browser for lightning-fast conversions
          </p>
        </div>
        
        <div>
          <div class="text-4xl mb-3">🔒</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Client-Side Processing</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            All processing happens locally, ensuring your files remain private
          </p>
        </div>
        
        <div>
          <div class="text-4xl mb-3">📱</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Progressive Web App</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Works seamlessly across all devices and platforms
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Monetization Model -->
  <section class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
      Our Business Model
    </h2>
    
    <div class="max-w-3xl mx-auto text-center">
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
        We believe powerful tools should be accessible to everyone. That's why we offer:
      </p>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Free with Ads</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Unlimited conversions and all features, supported by respectful, 
            non-intrusive advertisements.
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Premium Ad-Free</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Support our development and enjoy an ad-free experience with 
            additional premium features.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact/Support -->
  <section class="text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      Get in Touch
    </h2>
    
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Have questions, feedback, or need support? We'd love to hear from you!
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/contact')}
        class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
      >
        Contact Support
      </button>
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        View Pricing
      </button>
    </div>
  </section>
</div>