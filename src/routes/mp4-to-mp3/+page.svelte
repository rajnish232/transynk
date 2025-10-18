<script lang="ts">
  import { goto } from '$app/navigation';
  import FileUploader from '$lib/components/upload/FileUploader.svelte';
  import { ArrowRight, Video, Download, Shield, Zap } from 'lucide-svelte';

  let selectedFiles = $state<File[]>([]);

  function handleFilesSelected(event: CustomEvent) {
    const { files } = event.detail;
    selectedFiles = files.filter(file => 
      file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4')
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
  <title>MP4 to MP3 Converter - Extract Audio from Video | Transynk</title>
  <meta name="description" content="Convert MP4 videos to MP3 audio files instantly. Extract high-quality audio from video files with our free online converter." />
  <meta name="keywords" content="MP4 to MP3, video to audio, extract audio, convert video, MP3 converter" />
  
  <meta property="og:title" content="MP4 to MP3 Converter - Extract Audio from Video | Transynk" />
  <meta property="og:description" content="Convert MP4 videos to MP3 audio files instantly. Extract high-quality audio from video files." />
  <meta property="og:type" content="website" />
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MP4 to MP3 Converter",
    "description": "Convert MP4 video files to MP3 audio format",
    "url": "https://transynk.com/mp4-to-mp3",
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
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-purple-500 rounded-2xl flex items-center justify-center">
      <Video class="text-white" size={32} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      MP4 to MP3 Converter
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Extract high-quality audio from MP4 videos instantly. 
      Perfect for creating music files, podcasts, and audio clips.
    </p>

    <!-- Key Benefits -->
    <div class="flex flex-wrap justify-center gap-6 mb-8">
      <div class="flex items-center space-x-2 text-red-600 dark:text-red-400">
        <Shield size={20} />
        <span class="font-medium">100% Secure</span>
      </div>
      <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
        <Zap size={20} />
        <span class="font-medium">High Quality</span>
      </div>
      <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
        <Download size={20} />
        <span class="font-medium">Instant Download</span>
      </div>
    </div>
  </section>

  <!-- File Converter -->
  <section>
    <FileUploader
      accept=".mp4,video/mp4"
      multiple={true}
      on:filesSelected={handleFilesSelected}
    />
  </section>

  <!-- How It Works -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      How to Convert MP4 to MP3
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          1
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Upload MP4</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Select your MP4 video file or drag and drop it into the converter
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          2
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Extract Audio</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Our converter extracts the audio track from your video file
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          3
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Download MP3</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Download your high-quality MP3 audio file instantly
        </p>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Why Choose Our MP4 to MP3 Converter?
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield class="text-red-600 dark:text-red-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Privacy Protected</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            All conversions happen locally in your browser. Your video files never leave your device.
          </p>
        </div>
      </div>
      
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap class="text-purple-600 dark:text-purple-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">High Quality Audio</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Preserves original audio quality during conversion for the best listening experience.
          </p>
        </div>
      </div>
      
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Video class="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Supports various video formats including MP4, AVI, MOV, and more.
          </p>
        </div>
      </div>
      
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download class="text-green-600 dark:text-green-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Instant Download</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            No waiting times or queues. Download your MP3 files immediately after conversion.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Use Cases -->
  <section class="bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-900/20 dark:to-purple-900/20 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Perfect For
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="text-center">
        <div class="text-4xl mb-3">🎵</div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Music Extraction</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Extract music from music videos and concerts
        </p>
      </div>
      
      <div class="text-center">
        <div class="text-4xl mb-3">🎙️</div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Podcast Creation</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Convert video interviews to audio podcasts
        </p>
      </div>
      
      <div class="text-center">
        <div class="text-4xl mb-3">📚</div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Educational Content</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Create audio versions of video lectures
        </p>
      </div>
      
      <div class="text-center">
        <div class="text-4xl mb-3">💾</div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Storage Saving</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Save space by keeping only the audio
        </p>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Frequently Asked Questions
    </h2>
    
    <div class="space-y-4">
      <details class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <summary class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-red-600 dark:hover:text-red-400">
          What video formats can I convert to MP3?
        </summary>
        <p class="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          We support MP4, AVI, MOV, WMV, FLV, WebM, and many other popular video formats. 
          The converter automatically detects the format and extracts the audio.
        </p>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <summary class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-red-600 dark:hover:text-red-400">
          Will the audio quality be preserved?
        </summary>
        <p class="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Yes! Our converter preserves the original audio quality from your video file. 
          The MP3 output maintains the same bitrate and quality as the source audio.
        </p>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <summary class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-red-600 dark:hover:text-red-400">
          Is there a file size limit?
        </summary>
        <p class="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Free users can convert video files up to 25MB. Premium users can convert files up to 100MB. 
          For larger files, consider upgrading to premium.
        </p>
      </details>
      
      <details class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <summary class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-red-600 dark:hover:text-red-400">
          How long does the conversion take?
        </summary>
        <p class="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Conversion time depends on the file size and your device's processing power. 
          Most files convert within seconds to a few minutes.
        </p>
      </details>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Need More Video Conversion Features?
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for larger file sizes, batch processing, and access to all video formats.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => goto('/pricing')}
        class="px-8 py-3 bg-gradient-to-r from-red-500 to-purple-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center"
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