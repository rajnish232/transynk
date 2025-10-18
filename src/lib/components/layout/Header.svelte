<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { goto } from '$app/navigation';
  import { Menu, X, User, LogOut, Settings, Crown, Zap } from 'lucide-svelte';
  import AuthModal from '$lib/components/auth/AuthModal.svelte';

  let showMobileMenu = $state(false);
  let showUserMenu = $state(false);
  let showAuthModal = $state(false);
  let authMode = $state<'login' | 'register'>('login');

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }

  function toggleUserMenu() {
    showUserMenu = !showUserMenu;
  }

  function handleLogin() {
    authMode = 'login';
    showAuthModal = true;
  }

  function handleSignup() {
    authMode = 'register';
    showAuthModal = true;
  }

  function handleLogout() {
    authStore.logout();
    showUserMenu = false;
    goto('/');
  }

  function handleAuthSuccess() {
    showAuthModal = false;
    usageStore.fetchUsage();
  }

  // Close menus when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.user-menu-container')) {
      showUserMenu = false;
    }
    if (!target.closest('.mobile-menu-container')) {
      showMobileMenu = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transynk
          </span>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
          Convert
        </a>
        
        <!-- Compression Dropdown -->
        <div class="relative group">
          <button class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center">
            Compress
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div class="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <a href="/compress-images" class="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl">
              Image Compressor
            </a>
            <a href="/resize-images" class="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Image Resizer
            </a>
            <a href="/compress-files" class="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              File Compressor
            </a>
          </div>
        </div>
        
        <!-- PDF Operations Dropdown -->
        <div class="relative group">
          <button class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center">
            PDF Tools
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div class="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <a href="/pdf-operations" class="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl">
              PDF Operations
            </a>
            <a href="/pdf-to-word" class="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              PDF to Word
            </a>
            <a href="/pdf-compress" class="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl">
              PDF Compress
            </a>
          </div>
        </div>
        
        <a href="/pricing" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
          Pricing
        </a>
        <a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
          About
        </a>
      </nav>

      <!-- Desktop Auth/User Menu -->
      <div class="hidden md:flex items-center space-x-4">
        {#if authStore.isAuthenticated}
          <!-- Usage Display -->
          <div class="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {#if authStore.isPremium}
              <Crown class="text-yellow-500" size={16} />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Premium</span>
            {:else}
              <Zap class="text-blue-500" size={16} />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {usageStore.remainingConversions >= 0 ? usageStore.remainingConversions : '...'} left
              </span>
            {/if}
          </div>

          <!-- User Menu -->
          <div class="relative user-menu-container">
            <button
              onclick={toggleUserMenu}
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User class="text-white" size={16} />
              </div>
            </button>

            {#if showUserMenu}
              <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {authStore.user?.email}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {authStore.user?.subscriptionStatus?.replace('_', ' ')} Plan
                  </p>
                </div>
                
                <a href="/dashboard" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings class="mr-3" size={16} />
                  Dashboard
                </a>
                
                {#if !authStore.isPremium}
                  <a href="/pricing" class="flex items-center px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Crown class="mr-3" size={16} />
                    Upgrade to Premium
                  </a>
                {/if}
                
                <button
                  onclick={handleLogout}
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut class="mr-3" size={16} />
                  Sign out
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <button
            onclick={handleLogin}
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Sign in
          </button>
          <button
            onclick={handleSignup}
            class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200"
          >
            Get Started
          </button>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <button
        onclick={toggleMobileMenu}
        class="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {#if showMobileMenu}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
    </div>

    <!-- Mobile Menu -->
    {#if showMobileMenu}
      <div class="md:hidden mobile-menu-container">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <a href="/" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Convert
          </a>
          <a href="/compress-images" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Image Compressor
          </a>
          <a href="/resize-images" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Image Resizer
          </a>
          <a href="/compress-files" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            File Compressor
          </a>
          <a href="/pdf-operations" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            PDF Operations
          </a>
          <a href="/pdf-to-word" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            PDF to Word
          </a>
          <a href="/pricing" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Pricing
          </a>
          <a href="/about" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            About
          </a>
          
          {#if authStore.isAuthenticated}
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div class="px-3 py-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {authStore.user?.email}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {authStore.user?.subscriptionStatus?.replace('_', ' ')} Plan
                </p>
              </div>
              
              <a href="/dashboard" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Dashboard
              </a>
              
              {#if !authStore.isPremium}
                <a href="/pricing" class="block px-3 py-2 text-purple-600 dark:text-purple-400">
                  Upgrade to Premium
                </a>
              {/if}
              
              <button
                onclick={handleLogout}
                class="block w-full text-left px-3 py-2 text-red-600 dark:text-red-400"
              >
                Sign out
              </button>
            </div>
          {:else}
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 space-y-2">
              <button
                onclick={handleLogin}
                class="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign in
              </button>
              <button
                onclick={handleSignup}
                class="block w-full mx-3 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</header>

<!-- Auth Modal -->
<AuthModal bind:isOpen={showAuthModal} bind:mode={authMode} on:success={handleAuthSuccess} />
