<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { Crown, Zap } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleUpgrade() {
    dispatch('upgrade');
  }

  $effect(() => {
    if (authStore.isAuthenticated) {
      usageStore.fetchUsage();
    } else {
      // Load local usage for non-authenticated users
      usageStore.fetchUsage();
    }
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
  {#if authStore.isPremium}
    <!-- Premium user display -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Crown class="text-white" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Premium Active</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Unlimited conversions</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Conversions left</p>
      </div>
    </div>
  {:else}
    <!-- Free user display -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap class="text-white" size={20} />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Free with Ads</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Unlimited conversions</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">∞</div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Unlimited usage</p>
      </div>
    </div>

    <!-- Ad-supported message -->
    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <p class="text-sm text-blue-800 dark:text-blue-200 mb-2">
        🎉 Enjoy unlimited conversions with ads! Upgrade to remove ads and support Transynk.
      </p>
      <button
        onclick={handleUpgrade}
        class="w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
      >
        Remove Ads - Go Premium
      </button>
    </div>
  {/if}
</div>