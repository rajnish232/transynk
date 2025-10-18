<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { CheckCircle, Crown, ArrowRight } from 'lucide-svelte';

  let isLoading = $state(true);
  let sessionId = $state('');

  onMount(() => {
    sessionId = $page.url.searchParams.get('session_id') || '';
    
    // Refresh user data to get updated subscription status
    if (authStore.isAuthenticated) {
      authStore.fetchUser().finally(() => {
        isLoading = false;
      });
    } else {
      isLoading = false;
    }
  });

  function goToConverter() {
    goto('/');
  }

  function goToDashboard() {
    goto('/dashboard');
  }
</script>

<svelte:head>
  <title>Payment Successful - Transynk</title>
  <meta name="description" content="Your payment was successful! Welcome to Transynk Premium." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
  <div class="max-w-md w-full">
    {#if isLoading}
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Confirming your payment...</p>
      </div>
    {:else}
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <!-- Success Icon -->
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
          <CheckCircle class="text-white" size={40} />
        </div>

        <!-- Success Message -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Welcome to Transynk Premium! Your account has been upgraded and you now have access to all premium features.
        </p>

        <!-- Premium Features -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
          <div class="flex items-center justify-center mb-4">
            <Crown class="text-purple-600 dark:text-purple-400 mr-2" size={24} />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Premium Features Unlocked</h2>
          </div>
          
          <ul class="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex items-center">
              <CheckCircle class="text-green-500 mr-2" size={16} />
              Unlimited file conversions
            </li>
            <li class="flex items-center">
              <CheckCircle class="text-green-500 mr-2" size={16} />
              Advanced formats (video to MP3)
            </li>
            <li class="flex items-center">
              <CheckCircle class="text-green-500 mr-2" size={16} />
              File compression up to 100MB
            </li>
            <li class="flex items-center">
              <CheckCircle class="text-green-500 mr-2" size={16} />
              No advertisements
            </li>
            <li class="flex items-center">
              <CheckCircle class="text-green-500 mr-2" size={16} />
              Priority support
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            onclick={goToConverter}
            class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
          >
            Start Converting Files
            <ArrowRight class="ml-2" size={18} />
          </button>
          
          <button
            onclick={goToDashboard}
            class="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            View Dashboard
          </button>
        </div>

        <!-- Session Info (for debugging) -->
        {#if sessionId}
          <p class="text-xs text-gray-400 mt-6">
            Session ID: {sessionId.substring(0, 20)}...
          </p>
        {/if}
      </div>
    {/if}
  </div>
</div>