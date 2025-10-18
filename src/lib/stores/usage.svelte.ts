import { authStore } from './auth.svelte.js';
import { browser } from '$app/environment';

interface UsageStats {
  dailyConversions: number;
  remainingConversions: number;
  maxConversions: number;
  subscriptionStatus: string;
  resetDate: string;
}

class UsageStore {
  private state = $state<{
    usage: UsageStats | null;
    isLoading: boolean;
  }>({
    usage: null,
    isLoading: false
  });

  get usage() {
    return this.state.usage;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get canConvert() {
    return true; // Everyone can convert unlimited with ads
  }

  get remainingConversions() {
    return -1; // Unlimited for everyone
  }

  async fetchUsage() {
    if (!authStore.isAuthenticated) {
      // For non-authenticated users, check localStorage
      this.loadLocalUsage();
      return;
    }

    this.state.isLoading = true;
    try {
      const response = await authStore.apiRequest('/api/users/usage');
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage');
      }

      const data = await response.json();
      this.state.usage = data.usage;
    } catch (error) {
      console.error('Fetch usage error:', error);
    } finally {
      this.state.isLoading = false;
    }
  }

  private loadLocalUsage() {
    if (!browser) return;

    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('transynk_usage');
    
    if (stored) {
      const usage = JSON.parse(stored);
      if (usage.resetDate === today) {
        this.state.usage = usage;
        return;
      }
    }

    // Reset for new day
    this.state.usage = {
      dailyConversions: 0,
      remainingConversions: 3,
      maxConversions: 3,
      subscriptionStatus: 'free',
      resetDate: today
    };
    
    this.saveLocalUsage();
  }

  private saveLocalUsage() {
    if (!browser || !this.state.usage) return;
    localStorage.setItem('transynk_usage', JSON.stringify(this.state.usage));
  }

  async logConversion(inputFormat: string, outputFormat: string, fileSize?: number, processingTime?: number) {
    try {
      // Log to analytics
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authStore.user?.id,
          sessionId: this.getSessionId(),
          inputFormat,
          outputFormat,
          fileSize,
          processingTime,
          success: true
        }),
      });

      // Update local usage for non-authenticated users
      if (!authStore.isAuthenticated && this.state.usage) {
        this.state.usage.dailyConversions++;
        this.state.usage.remainingConversions = Math.max(0, this.state.usage.remainingConversions - 1);
        this.saveLocalUsage();
      } else if (authStore.isAuthenticated) {
        // Refresh usage from server
        await this.fetchUsage();
      }
    } catch (error) {
      console.error('Log conversion error:', error);
    }
  }

  private getSessionId(): string {
    if (!browser) return 'server';
    
    let sessionId = localStorage.getItem('transynk_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('transynk_session_id', sessionId);
    }
    return sessionId;
  }

  async logUserAction(action: string, metadata?: any) {
    try {
      await fetch('/api/analytics/user-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId: authStore.user?.id,
          sessionId: this.getSessionId(),
          metadata
        }),
      });
    } catch (error) {
      console.error('Log user action error:', error);
    }
  }
}

export const usageStore = new UsageStore();