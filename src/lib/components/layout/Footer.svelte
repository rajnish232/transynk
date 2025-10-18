<script lang="ts">
  import { Heart, Github, Twitter, Mail } from 'lucide-svelte';
</script>

<footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
  <div class="container mx-auto px-4 py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <!-- Brand -->
      <div class="md:col-span-1">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transynk
          </span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Modern file converter and compressor. Convert any file format instantly with privacy-first local processing.
        </p>
        <div class="flex space-x-4">
          <a href="https://github.com" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Github size={20} />
          </a>
          <a href="https://twitter.com" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Twitter size={20} />
          </a>
          <a href="mailto:support@transynk.com" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Mail size={20} />
          </a>
        </div>
      </div>

      <!-- Product -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">File Converter</a></li>
          <li><a href="/compress-images" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Image Compressor</a></li>
          <li><a href="/compress-files" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">File Compressor</a></li>
          <li><a href="/pricing" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
          <li><a href="/pdf-to-word" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">PDF to Word</a></li>
          <li><a href="/jpg-to-png" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">JPG to PNG</a></li>
        </ul>
      </div>

      <!-- Company -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/about" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a></li>
          <li><a href="/privacy" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
          <li><a href="/terms" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
          <li><a href="/contact" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/help" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
          <li><a href="/faq" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a></li>
          <li><a href="/contact" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a></li>
          <li><a href="/status" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">System Status</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p class="text-gray-600 dark:text-gray-400 text-sm flex items-center">
        Made with <Heart class="text-red-500 mx-1" size={16} /> for creators worldwide
      </p>
      <p class="text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0">
        © 2024 Transynk. All rights reserved.
      </p>
    </div>
  </div>

  <!-- Ad Slot - Bottom -->
  <div class="border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-4">
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <div class="text-gray-400 dark:text-gray-500 text-sm">
          Advertisement
        </div>
        <div class="mt-2 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          <span class="text-gray-500 dark:text-gray-400 text-sm">Ad Space</span>
        </div>
      </div>
    </div>
  </div>
</footer>