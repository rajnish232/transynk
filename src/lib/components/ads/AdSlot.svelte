<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { onMount } from 'svelte';

  interface Props {
    slot: 'header' | 'sidebar' | 'footer' | 'content-top' | 'content-bottom' | 'floating';
    size?: 'small' | 'medium' | 'large' | 'banner';
    position?: 'left' | 'right' | 'center';
  }

  let { slot, size = 'medium', position = 'center' }: Props = $props();

  let adContainer: HTMLDivElement;
  let adLoaded = $state(false);
  let adFailed = $state(false);

  const sizeClasses = {
    small: 'h-20',
    medium: 'h-32',
    large: 'h-48',
    banner: 'h-24'
  };

  const adColors = [
    'from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20',
    'from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20',
    'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
    'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
    'from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20'
  ];

  onMount(() => {
    // Don't show ads to premium users
    if (authStore.isPremium) {
      return;
    }

    // Simulate ad loading (replace with actual ad network integration)
    loadAd();
  });

  async function loadAd() {
    try {
      // Simulate ad loading delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Simulate random ad loading success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        adLoaded = true;
        renderDemoAd();
      } else {
        throw new Error('Ad failed to load');
      }
    } catch (error) {
      console.warn(`Ad failed to load for slot: ${slot}`, error);
      adFailed = true;
    }
  }

  function renderDemoAd() {
    if (!adContainer) return;
    
    const randomColor = adColors[Math.floor(Math.random() * adColors.length)];
    const adTypes = ['Product Ad', 'Service Ad', 'Brand Ad', 'Sponsored Content'];
    const randomAdType = adTypes[Math.floor(Math.random() * adTypes.length)];
    
    // Demo ad content - replace with actual ad network code
    adContainer.innerHTML = `
      <div class="w-full h-full bg-gradient-to-r ${randomColor} rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
        <div class="text-center p-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${randomAdType}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Advertisement • ${slot}</div>
        </div>
      </div>
    `;
  }
</script>

{#if !authStore.isPremium}
  <div class="ad-slot-container {sizeClasses[size]}">
    {#if adLoaded}
      <div bind:this={adContainer} class="w-full h-full"></div>
    {:else if adFailed}
      <!-- Graceful fallback when ad fails -->
      <div class="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <div class="text-sm text-gray-400 dark:text-gray-500">
            Support Transynk
          </div>
          <a 
            href="/pricing" 
            class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Upgrade to remove ads
          </a>
        </div>
      </div>
    {:else}
      <!-- Loading state -->
      <div class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center animate-pulse">
        <div class="text-sm text-gray-400 dark:text-gray-500">Loading ad...</div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .ad-slot-container {
    /* Ensure ads don't interfere with main content */
    max-width: 100%;
    overflow: hidden;
  }
</style>