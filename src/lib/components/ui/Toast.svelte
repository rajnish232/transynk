<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { CheckCircle, AlertCircle, Info, X } from 'lucide-svelte';

  interface Props {
    type?: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    duration?: number;
    dismissible?: boolean;
  }

  let { 
    type = 'info', 
    title, 
    message, 
    duration = 5000,
    dismissible = true 
  }: Props = $props();

  const dispatch = createEventDispatcher();

  let visible = $state(true);
  let timeoutId: number;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle
  };

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500'
  };

  onMount(() => {
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        dismiss();
      }, duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  });

  function dismiss() {
    visible = false;
    setTimeout(() => {
      dispatch('dismiss');
    }, 300); // Wait for animation to complete
  }
</script>

{#if visible}
  <div 
    class="toast-container transform transition-all duration-300 ease-in-out {visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}"
    role="alert"
  >
    <div class="flex items-start p-4 border rounded-lg shadow-lg backdrop-blur-sm {colors[type]}">
      <svelte:component 
        this={icons[type]} 
        class="flex-shrink-0 mt-0.5 mr-3 {iconColors[type]}" 
        size={20} 
      />
      
      <div class="flex-1 min-w-0">
        <h4 class="font-medium">{title}</h4>
        {#if message}
          <p class="mt-1 text-sm opacity-90">{message}</p>
        {/if}
      </div>

      {#if dismissible}
        <button
          onclick={dismiss}
          class="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .toast-container {
    max-width: 400px;
    width: 100%;
  }
</style>