<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, beforeNavigate, afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
  import AdSlot from '$lib/components/ads/AdSlot.svelte';
  
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { toastStore } from '$lib/stores/toast.svelte.js';

  import '$lib/css/app.scss';

  let { children } = $props();

  let dropping = $state(false);
  let isMobile = $state(false);

  onMount(() => {
    // Initialize mobile detection
    const handleResize = () => {
      isMobile = window.innerWidth <= 768;
    };
    
    isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', handleResize);

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Initialize auth and usage
    if (authStore.isAuthenticated) {
      usageStore.fetchUsage();
    }

    // Handle file paste
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData || !clipboardData.files.length) return;
      
      e.preventDefault();
      handleFiles(Array.from(clipboardData.files));
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('paste', handlePaste);
    };
  });

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (usageStore.canConvert) {
      dropping = true;
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dropping = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dropping = false;
    
    if (!usageStore.canConvert) {
      toastStore.warning('Daily limit reached', 'Upgrade to premium for unlimited conversions');
      return;
    }

    const files = Array.from(e.dataTransfer?.files || []);
    handleFiles(files);
  }

  function handleFiles(files: File[]) {
    if (files.length === 0) return;

    // Navigate to convert page if not already there
    if ($page.url.pathname !== '/convert' && $page.url.pathname !== '/') {
      goto('/convert');
    }

    // Dispatch custom event for file handling
    window.dispatchEvent(new CustomEvent('filesDropped', { detail: { files } }));
  }
</script>

<svelte:head>
  <title>Transynk - Modern File Converter & Compressor</title>
  <meta name="theme-color" content="#6366f1" />
</svelte:head>

<div 
  class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200"
  role="application"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <!-- Drag Overlay -->
  {#if dropping}
    <div class="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border-2 border-dashed border-blue-500">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Drop files to convert
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Release to start processing your files
          </p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Header -->
  <Header />

  <!-- Header Ad Slot -->
  <div class="container mx-auto px-4 py-2">
    <AdSlot slot="header" size="banner" />
  </div>

  <!-- Main Content -->
  <main class="flex-1">
    <div class="container mx-auto px-4 py-8">
      <div class="flex gap-6">
        <!-- Left Sidebar Ad (Desktop Only) -->
        <div class="hidden xl:block w-64 flex-shrink-0">
          <div class="sticky top-24 space-y-4">
            <AdSlot slot="sidebar" size="large" position="left" />
            <AdSlot slot="sidebar" size="medium" position="left" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Content Top Ad (Desktop Only) -->
          <div class="hidden lg:block mb-6">
            <AdSlot slot="content-top" size="banner" />
          </div>
          
          {@render children()}
          
          <!-- Content Bottom Ad -->
          <div class="mt-8">
            <AdSlot slot="content-bottom" size="banner" />
          </div>
        </div>

        <!-- Right Sidebar Ad (Desktop Only) -->
        <div class="hidden xl:block w-64 flex-shrink-0">
          <div class="sticky top-24 space-y-4">
            <AdSlot slot="sidebar" size="large" position="right" />
            <AdSlot slot="sidebar" size="medium" position="right" />
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <Footer />

  <!-- Toast Container -->
  <ToastContainer />
</div>