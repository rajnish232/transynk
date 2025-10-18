<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { createEventDispatcher } from 'svelte';
  import { X, Mail, Lock, User } from 'lucide-svelte';

  interface Props {
    isOpen: boolean;
    mode?: 'login' | 'register';
  }

  let { isOpen = $bindable(), mode = $bindable('login') }: Props = $props();

  const dispatch = createEventDispatcher();

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let isLoading = $state(false);
  let error = $state('');

  function closeModal() {
    isOpen = false;
    resetForm();
  }

  function resetForm() {
    email = '';
    password = '';
    confirmPassword = '';
    error = '';
    isLoading = false;
  }

  function switchMode() {
    mode = mode === 'login' ? 'register' : 'login';
    resetForm();
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (isLoading) return;

    error = '';

    // Validation
    if (!email || !password) {
      error = 'Email and password are required';
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        error = 'Password must be at least 6 characters';
        return;
      }
      if (password !== confirmPassword) {
        error = 'Passwords do not match';
        return;
      }
    }

    isLoading = true;

    try {
      const result = mode === 'login' 
        ? await authStore.login(email, password)
        : await authStore.register(email, password);

      if (result.success) {
        closeModal();
        dispatch('success', { mode });
      } else {
        error = result.error || 'Authentication failed';
      }
    } catch (err) {
      error = 'An unexpected error occurred';
    } finally {
      isLoading = false;
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
      <!-- Close button -->
      <button
        onclick={closeModal}
        class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X size={20} />
      </button>

      <div class="p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <User class="text-white" size={24} />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            {mode === 'login' 
              ? 'Sign in to access your premium features' 
              : 'Join Transynk and get 3 free conversions daily'}
          </p>
        </div>

        <!-- Form -->
        <form onsubmit={handleSubmit} class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                bind:value={email}
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                bind:value={password}
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <!-- Confirm Password (Register only) -->
          {#if mode === 'register'}
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm password
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="confirmPassword"
                  type="password"
                  bind:value={confirmPassword}
                  required
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          {/if}

          <!-- Error message -->
          {#if error}
            <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          {/if}

          <!-- Submit button -->
          <button
            type="submit"
            disabled={isLoading}
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            {:else}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            {/if}
          </button>
        </form>

        <!-- Switch mode -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onclick={switchMode}
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-1"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}