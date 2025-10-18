<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { Check, Crown, Zap, Star } from 'lucide-svelte';
  import AuthModal from '$lib/components/auth/AuthModal.svelte';
  import { goto } from '$app/navigation';

  let showAuthModal = $state(false);
  let authMode = $state<'login' | 'register'>('register');
  let isLoading = $state(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 2,
      period: 'month',
      description: 'Perfect for regular users',
      popular: false,
      features: [
        'Everything in Free',
        'No advertisements',
        'Advanced formats (video to MP3)',
        'Image & file compression',
        'ZIP archive creation',
        'WebP format support',
        'Files up to 100MB',
        'Priority support',
        'Batch processing'
      ]
    },
    {
      id: 'lifetime',
      name: 'Premium Lifetime',
      price: 15,
      period: 'one-time',
      description: 'Best value - pay once, use forever',
      popular: true,
      features: [
        'Everything in Monthly',
        'Lifetime access',
        'No recurring payments',
        'Advanced compression algorithms',
        'Password-protected archives',
        'Future feature updates',
        'VIP support',
        'Early access to new tools'
      ]
    }
  ];

  async function handleUpgrade(planId: string) {
    if (!authStore.isAuthenticated) {
      showAuthModal = true;
      return;
    }

    isLoading = true;
    try {
      const response = await authStore.apiRequest('/api/subscriptions/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  function handleAuthSuccess() {
    showAuthModal = false;
  }
</script>

<svelte:head>
  <title>Pricing - Transynk</title>
  <meta name="description" content="Choose the perfect plan for your file conversion needs. Start free or upgrade to premium for unlimited conversions." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
  <div class="container mx-auto px-4 py-16">
    <!-- Header -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        Choose Your <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Start with our free plan or upgrade to premium for unlimited conversions and advanced features.
      </p>
    </div>

    <!-- Plans Grid -->
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <!-- Free Plan -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 relative">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center">
            <Zap class="text-white" size={24} />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
          <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">$0</div>
          <p class="text-gray-600 dark:text-gray-400">Perfect for trying out Transynk</p>
        </div>

        <ul class="space-y-4 mb-8">
          <li class="flex items-center">
            <Check class="text-green-500 mr-3" size={20} />
            <span class="text-gray-700 dark:text-gray-300">Unlimited conversions</span>
          </li>
          <li class="flex items-center">
            <Check class="text-green-500 mr-3" size={20} />
            <span class="text-gray-700 dark:text-gray-300">All file formats</span>
          </li>
          <li class="flex items-center">
            <Check class="text-green-500 mr-3" size={20} />
            <span class="text-gray-700 dark:text-gray-300">Files up to 25MB</span>
          </li>
          <li class="flex items-center">
            <Check class="text-green-500 mr-3" size={20} />
            <span class="text-gray-700 dark:text-gray-300">Local processing</span>
          </li>
          <li class="flex items-center">
            <span class="text-orange-500 mr-3">📺</span>
            <span class="text-gray-700 dark:text-gray-300">With advertisements</span>
          </li>
        </ul>

        <button
          onclick={() => goto('/')}
          class="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          Get Started Free
        </button>
      </div>

      <!-- Premium Plans -->
      {#each plans as plan}
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 {plan.popular ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700'} p-8 relative">
          {#if plan.popular}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star size={16} class="mr-1" />
                Most Popular
              </div>
            </div>
          {/if}

          <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Crown class="text-white" size={24} />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ${plan.price}
              {#if plan.period !== 'one-time'}
                <span class="text-lg text-gray-600 dark:text-gray-400">/{plan.period}</span>
              {/if}
            </div>
            <p class="text-gray-600 dark:text-gray-400">{plan.description}</p>
          </div>

          <ul class="space-y-4 mb-8">
            {#each plan.features as feature}
              <li class="flex items-center">
                <Check class="text-green-500 mr-3" size={20} />
                <span class="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            {/each}
          </ul>

          <button
            onclick={() => handleUpgrade(plan.id)}
            disabled={isLoading}
            class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 {plan.popular ? 'shadow-lg shadow-purple-500/25' : ''}"
          >
            {#if isLoading}
              <div class="flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            {:else}
              Upgrade Now
            {/if}
          </button>
        </div>
      {/each}
    </div>

    <!-- FAQ Section -->
    <div class="mt-20 max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Frequently Asked Questions
      </h2>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">How does the free plan work?</h3>
          <p class="text-gray-600 dark:text-gray-400">You get 3 free conversions every day. The quota resets at midnight UTC. No credit card required.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Is my data secure?</h3>
          <p class="text-gray-600 dark:text-gray-400">Yes! All file conversions happen locally in your browser. Your files never leave your device.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Can I cancel anytime?</h3>
          <p class="text-gray-600 dark:text-gray-400">Yes, you can cancel your monthly subscription anytime. Lifetime purchases are non-refundable.</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">What payment methods do you accept?</h3>
          <p class="text-gray-600 dark:text-gray-400">We accept all major credit cards, debit cards, and digital wallets through Stripe.</p>
        </div>
      </div>
    </div>

    <!-- Trust Indicators -->
    <div class="mt-16 text-center">
      <p class="text-gray-600 dark:text-gray-400 mb-4">Trusted by thousands of users worldwide</p>
      <div class="flex justify-center items-center space-x-8 opacity-60">
        <div class="text-2xl">🔒</div>
        <div class="text-sm text-gray-500">SSL Secured</div>
        <div class="text-2xl">💳</div>
        <div class="text-sm text-gray-500">Stripe Payments</div>
        <div class="text-2xl">🛡️</div>
        <div class="text-sm text-gray-500">Privacy First</div>
      </div>
    </div>
  </div>
</div>

<!-- Auth Modal -->
<AuthModal bind:isOpen={showAuthModal} bind:mode={authMode} on:success={handleAuthSuccess} />