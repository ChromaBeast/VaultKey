export type ToastType = 'error' | 'success' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

export const TOAST_EVENT = 'vk_toast_push';

let toastSeq = 0;

export const pushToast = (message: string, type: ToastType = 'info') => {
  window.dispatchEvent(
    new CustomEvent<ToastItem>(TOAST_EVENT, {
      detail: { id: ++toastSeq, message, type },
    })
  );
};

export type { ToastItem };
