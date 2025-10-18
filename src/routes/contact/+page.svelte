<script lang="ts">
  import { Mail, MessageCircle, HelpCircle, Bug, Lightbulb, Heart } from 'lucide-svelte';
  import { toastStore } from '$lib/stores/toast.svelte.js';

  let name = $state('');
  let email = $state('');
  let subject = $state('');
  let message = $state('');
  let category = $state('general');
  let isSubmitting = $state(false);

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'feedback', label: 'Feedback', icon: Heart }
  ];

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toastStore.error('Missing fields', 'Please fill in all required fields');
      return;
    }

    isSubmitting = true;

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toastStore.success(
        'Message sent!', 
        'Thank you for contacting us. We\'ll get back to you within 24 hours.'
      );
      
      // Reset form
      name = '';
      email = '';
      subject = '';
      message = '';
      category = 'general';
    } catch (error) {
      toastStore.error('Failed to send', 'Please try again or email us directly');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Contact Us - Transynk Support</title>
  <meta name="description" content="Get in touch with Transynk support. We're here to help with technical issues, feature requests, and general inquiries." />
</svelte:head>

<div class="max-w-4xl mx-auto space-y-12">
  <!-- Header -->
  <section class="text-center py-8">
    <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
      <Mail class="text-white" size={24} />
    </div>
    
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      Contact Us
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      Have a question, found a bug, or want to suggest a feature? 
      We'd love to hear from you!
    </p>
  </section>

  <div class="grid lg:grid-cols-3 gap-12">
    <!-- Contact Form -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
        
        <form onsubmit={handleSubmit} class="space-y-6">
          <!-- Category Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What can we help you with?
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              {#each categories as cat}
                <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-all {
                  category === cat.value 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }">
                  <input
                    type="radio"
                    bind:group={category}
                    value={cat.value}
                    class="sr-only"
                  />
                  <svelte:component this={cat.icon} class="mr-2 {
                    category === cat.value ? 'text-blue-600' : 'text-gray-400'
                  }" size={16} />
                  <span class="text-sm {
                    category === cat.value 
                      ? 'text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }">
                    {cat.label}
                  </span>
                </label>
              {/each}
            </div>
          </div>

          <!-- Name and Email -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                id="name"
                type="text"
                bind:value={name}
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                bind:value={email}
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              bind:value={subject}
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of your inquiry"
            />
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              bind:value={message}
              required
              rows="6"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Please provide as much detail as possible..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {#if isSubmitting}
              <div class="flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            {:else}
              Send Message
            {/if}
          </button>
        </form>
      </div>
    </div>

    <!-- Contact Info & FAQ -->
    <div class="space-y-8">
      <!-- Quick Contact -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Contact</h3>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <Mail class="text-blue-500 mr-3" size={20} />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Email</p>
              <a href="mailto:support@transynk.com" class="text-blue-600 dark:text-blue-400 hover:underline">
                support@transynk.com
              </a>
            </div>
          </div>
          
          <div class="flex items-center">
            <MessageCircle class="text-green-500 mr-3" size={20} />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Response Time</p>
              <p class="text-gray-600 dark:text-gray-400">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Common Issues -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Issues</h3>
        
        <div class="space-y-3">
          <details class="group">
            <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              File conversion failed
            </summary>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Try refreshing the page and ensure your file is under the size limit.
            </p>
          </details>
          
          <details class="group">
            <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Ads not loading properly
            </summary>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Check if you have an ad blocker enabled. Consider upgrading to premium for an ad-free experience.
            </p>
          </details>
          
          <details class="group">
            <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Premium features not working
            </summary>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Make sure you're logged in and your subscription is active.
            </p>
          </details>
        </div>
      </div>

      <!-- Feature Requests -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 Have an idea?
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          We love hearing feature requests from our users. Your ideas help make Transynk better!
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Select "Feature Request" above to share your ideas.
        </p>
      </div>
    </div>
  </div>
</div>