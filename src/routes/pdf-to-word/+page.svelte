<script lang="ts">
  import { goto } from '$app/navigation';
  import FileConverter from '$lib/components/conversion/FileConverter.svelte';
  import { ArrowRight, FileText, Download, Shield, Zap } from 'lucide-svelte';

  let selectedFiles = $state<File[]>([]);

  function handleFilesSelected(event: CustomEvent) {
    const { files } = event.detail;
    selectedFiles = files.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (selectedFiles.length > 0) {
      // Start conversion process
      startConversion();
    }
  }

  async function startConversion() {
    // Simulate conversion - in real app, this would use the WebAssembly converter
    await new Promise(resolve => setTimeout(resolve, 2000));
    goto('/convert');
  }
</script>

<svelte:head>
  <title>PDF to Word Converter - Free Online Tool | Transynk</title>
  <meta name="description" content="Convert PDF to Word documents instantly with Transynk. Free, secure, and fast PDF to DOCX conversion. No file uploads required - everything happens in your browser." />
  <meta name="keywords" content="PDF to Word, PDF to DOCX, convert PDF, document converter, free PDF converter" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="PDF to Word Converter - Free Online Tool | Transynk" />
  <meta property="og:description" content="Convert PDF to Word documents instantly. Free, secure, and fast conversion with no file uploads required." />
  <meta property="og:type" content="website" />
  
  <!-- Schema.org structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to Word Converter",
    "description": "Convert PDF files to Word documents instantly",
    "url": "https://transynk.com/pdf-to-word",
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

<div class="max-w-4xl mx-auto space-y-12">
  <!-- Hero Section -->
  <section class="text-center py-8">
    <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl flex items-center justify-center">
      <FileText class="text-white" size={32} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      PDF to Word Converter
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
      Convert your PDF files to editable Word documents instantly. 
      Free, secure, and fast conversion with no file uploads required.
    </p>

    <!-- Key Benefits -->
    <div class="flex flex-wrap justify-center gap-6 mb-8">
      <div class="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <Shield size={20} />
        <span class="font-medium">100% Secure</span>
      </div>
      <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
        <Zap size={20} />
        <span class="font-medium">Instant Conversion</span>
      </div>
      <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
        <Download size={20} />
        <span class="font-medium">No Registration</span>
      </div>
    </div>
  </section>

  <!-- File Converter -->
  <section>
    <FileConverter />
  </section>

  <!-- How It Works -->
  <section class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      How to Convert PDF to Word
    </h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          1
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Upload PDF</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Drag and drop your PDF file or click to browse and select it
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          2
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Convert</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Our tool automatically converts your PDF to Word format
        </p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          3
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Download your converted Word document instantly
        </p>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Why Choose Our PDF to Word Converter?
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield class="text-green-600 dark:text-green-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Privacy Protected</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Your files are processed locally in your browser. No uploads to servers, ensuring complete privacy.
          </p>
        </div>
      </div>
      
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap class="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Instant conversion powered by WebAssembly technology. No waiting times or queues.
          </p>
        </div>
      </div>
      
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText class="text-purple-600 dark:text-purple-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Maintains formatting, images, and layout integrity during conversion.
          </p>
        </div>
      </div>
      
      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download class="text-orange-600 dark:text-orange-400" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">No Registration</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Start converting immediately. No account creation or email required.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section>
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
      Frequently Asked Questions
    </h2>
    
    <div class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
          Is it safe to convert PDF to Word online?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Yes, absolutely! Our converter processes files locally in your browser using WebAssembly. 
          Your files never leave your device, ensuring complete privacy and security.
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
          What file formats are supported?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          We support PDF to DOCX (Word 2007+) conversion. The output format is compatible with 
          Microsoft Word, Google Docs, and other word processors.
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
          Is there a file size limit?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Free users can convert files up to 25MB. Premium users can convert files up to 100MB. 
          For larger files, consider upgrading to our premium plan.
        </p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
          How many files can I convert?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Free users get 3 conversions per day. Premium users enjoy unlimited conversions. 
          Upgrade to premium for just $2/month or $15 lifetime.
        </p>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Need More Conversions?
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      Upgrade to premium for unlimited PDF to Word conversions and access to all file formats.
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