<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { usageStore } from '$lib/stores/usage.svelte.js';
  import { toastStore } from '$lib/stores/toast.svelte.js';
  import { goto } from '$app/navigation';
  
  import { 
    User, 
    Crown, 
    BarChart3, 
    Calendar, 
    Settings, 
    CreditCard,
    Download,
    TrendingUp,
    Users,
    DollarSign
  } from 'lucide-svelte';

  let userProfile = $state(null);
  let subscriptionStatus = $state(null);
  let analytics = $state(null);
  let isLoading = $state(true);

  onMount(async () => {
    if (!authStore.isAuthenticated) {
      goto('/');
      return;
    }

    await Promise.all([
      fetchUserProfile(),
      fetchSubscriptionStatus(),
      fetchAnalytics()
    ]);

    isLoading = false;
  });

  async function fetchUserProfile() {
    try {
      const response = await authStore.apiRequest('/api/users/profile');
      if (response.ok) {
        const data = await response.json();
        userProfile = data.user;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }

  async function fetchSubscriptionStatus() {
    try {
      const response = await authStore.apiRequest('/api/subscriptions/status');
      if (response.ok) {
        const data = await response.json();
        subscriptionStatus = data;
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  }

  async function fetchAnalytics() {
    if (!authStore.isAdmin) return;

    try {
      const response = await authStore.apiRequest('/api/analytics/dashboard');
      if (response.ok) {
        const data = await response.json();
        analytics = data.metrics;
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Dashboard - VastuSphere</title>
  <meta name="description" content="Manage your VastuSphere account, view usage statistics, and upgrade your plan." />
</svelte:head>

{#if isLoading}
  <div class="flex items-center justify-center min-h-96">
    <div class="text-center">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
    </div>
  </div>
{:else}
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {authStore.user?.email}
        </p>
      </div>
      
      {#if !authStore.isPremium}
        <button
          onclick={() => goto('/pricing')}
          class="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
        >
          <Crown class="mr-2" size={18} />
          Upgrade to Premium
        </button>
      {/if}
    </div>

    <!-- Stats Cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Account Status -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {authStore.user?.subscriptionStatus?.replace('_', ' ')}
            </p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            {#if authStore.isPremium}
              <Crown class="text-white" size={24} />
            {:else}
              <User class="text-white" size={24} />
            {/if}
          </div>
        </div>
      </div>

      <!-- Daily Usage -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Today's Usage</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {usageStore.usage?.dailyConversions || 0}
              {#if !authStore.isPremium}
                <span class="text-lg text-gray-500">/ 3</span>
              {/if}
            </p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 class="text-white" size={24} />
          </div>
        </div>
      </div>

      <!-- Member Since -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}
            </p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Calendar class="text-white" size={24} />
          </div>
        </div>
      </div>

      <!-- Subscription -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Subscription</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {subscriptionStatus?.subscription?.plan || 'Free'}
            </p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <CreditCard class="text-white" size={24} />
          </div>
        </div>
      </div>
    </div>

    <!-- Account Management -->
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Profile Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings class="mr-2" size={20} />
          Account Settings
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={authStore.user?.email || ''}
              disabled
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Plan Type
            </label>
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span class="text-gray-900 dark:text-white capitalize">
                {authStore.user?.subscriptionStatus?.replace('_', ' ')} Plan
              </span>
              {#if authStore.isPremium}
                <Crown class="text-yellow-500" size={18} />
              {/if}
            </div>
          </div>

          {#if subscriptionStatus?.subscription?.currentPeriodEnd}
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Billing Date
              </label>
              <p class="text-gray-900 dark:text-white">
                {formatDate(subscriptionStatus.subscription.currentPeriodEnd)}
              </p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Usage Statistics -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp class="mr-2" size={20} />
          Usage Statistics
        </h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Today's Conversions</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {usageStore.usage?.dailyConversions || 0}
            </span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Remaining Today</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {authStore.isPremium ? '∞' : (usageStore.usage?.remainingConversions || 0)}
            </span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Daily Limit</span>
            <span class="font-semibold text-gray-900 dark:text-white">
              {authStore.isPremium ? 'Unlimited' : '3'}
            </span>
          </div>

          {#if !authStore.isPremium && usageStore.usage}
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Usage Progress</span>
                <span>{Math.round((usageStore.usage.dailyConversions / 3) * 100)}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style="width: {Math.min((usageStore.usage.dailyConversions / 3) * 100, 100)}%"
                ></div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Admin Analytics (if admin) -->
    {#if authStore.isAdmin && analytics}
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <BarChart3 class="mr-2" size={20} />
          Admin Analytics
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp class="text-white" size={24} />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.totals?.totalConversions || 0}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Conversions</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Users class="text-white" size={24} />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.totals?.newUsers || 0}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">New Users</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <DollarSign class="text-white" size={24} />
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              ${analytics.totals?.revenue?.toFixed(2) || '0.00'}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      
      <div class="grid md:grid-cols-3 gap-4">
        <button
          onclick={() => goto('/')}
          class="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Download class="text-blue-500 mb-2" size={24} />
          <h3 class="font-medium text-gray-900 dark:text-white">Convert Files</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Start converting your files</p>
        </button>
        
        <button
          onclick={() => goto('/pricing')}
          class="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Crown class="text-purple-500 mb-2" size={24} />
          <h3 class="font-medium text-gray-900 dark:text-white">
            {authStore.isPremium ? 'Manage Subscription' : 'Upgrade Plan'}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {authStore.isPremium ? 'View subscription details' : 'Get unlimited conversions'}
          </p>
        </button>
        
        <button
          onclick={() => goto('/about')}
          class="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Settings class="text-green-500 mb-2" size={24} />
          <h3 class="font-medium text-gray-900 dark:text-white">Help & Support</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Get help and contact support</p>
        </button>
      </div>
    </div>
  </div>
{/if}