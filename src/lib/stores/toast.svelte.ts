interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

class ToastStore {
  private toasts = $state<ToastData[]>([]);

  get items() {
    return this.toasts;
  }

  add(toast: Omit<ToastData, 'id'>) {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast
    };

    this.toasts = [...this.toasts, newToast];
    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  clear() {
    this.toasts = [];
  }

  // Convenience methods
  success(title: string, message?: string, duration?: number) {
    return this.add({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number) {
    return this.add({ type: 'error', title, message, duration });
  }

  info(title: string, message?: string, duration?: number) {
    return this.add({ type: 'info', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number) {
    return this.add({ type: 'warning', title, message, duration });
  }
}

export const toastStore = new ToastStore();