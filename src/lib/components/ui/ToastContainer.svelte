<script lang="ts">
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import Toast from './Toast.svelte';
</script>

<div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
  {#each toastStore.items as toast (toast.id)}
    <Toast
      type={toast.type}
      title={toast.title}
      message={toast.message}
      duration={toast.duration}
      dismissible={toast.dismissible}
      on:dismiss={() => toastStore.remove(toast.id)}
    />
  {/each}
</div>