import { browser } from '$app/environment';

interface User {
  id: string;
  email: string;
  subscriptionStatus: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

class AuthStore {
  private state = $state<AuthState>({
    user: null,
    token: null,
    isLoading: true
  });

  constructor() {
    if (browser) {
      this.initializeAuth();
    }
  }

  get user() {
    return this.state.user;
  }

  get token() {
    return this.state.token;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get isAuthenticated() {
    return !!this.state.user && !!this.state.token;
  }

  get isPremium() {
    return this.state.user?.subscriptionStatus?.includes('premium') || false;
  }

  get isAdmin() {
    return this.state.user?.isAdmin || false;
  }

  private initializeAuth() {
    const token = localStorage.getItem('transynk_token');
    if (token) {
      this.state.token = token;
      this.fetchUser();
    } else {
      this.state.isLoading = false;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      this.state.user = data.user;
      this.state.token = data.token;
      localStorage.setItem('transynk_token', data.token);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  async register(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed');
      }

      this.state.user = data.user;
      this.state.token = data.token;
      localStorage.setItem('transynk_token', data.token);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  async fetchUser() {
    if (!this.state.token) {
      this.state.isLoading = false;
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.state.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      this.state.user = data.user;
    } catch (error) {
      console.error('Fetch user error:', error);
      this.logout();
    } finally {
      this.state.isLoading = false;
    }
  }

  logout() {
    this.state.user = null;
    this.state.token = null;
    this.state.isLoading = false;
    localStorage.removeItem('transynk_token');
  }

  async apiRequest(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.state.token) {
      headers['Authorization'] = `Bearer ${this.state.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Authentication required');
    }

    return response;
  }
}

export const authStore = new AuthStore();