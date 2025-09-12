import { create } from "zustand";

export type SnackbarAction = {
  label: string;
  onPress?: () => void;
};

type SnackbarState = {
  visible: boolean;
  message: string;
  duration?: number;
  action?: SnackbarAction;
  onDismiss?: () => void;
};

type SnackbarStore = SnackbarState & {
  showSnackbar: (
    message: string,
    options?: {
      duration?: number;
      action?: SnackbarAction;
      onDismiss?: () => void;
    }
  ) => void;
  hideSnackbar: () => void;
};

// Initial snackbar state
const initialState: SnackbarState = {
  visible: false,
  message: "",
  duration: 3000,
  action: undefined,
  onDismiss: undefined,
};

// Create Zustand store
export const useSnackbarStore = create<SnackbarStore>((set, get) => ({
  ...initialState,

  // Show a snackbar with the provided options
  showSnackbar: (message, options) => {
    set({
      visible: true,
      message,
      duration: options?.duration ?? 3000,
      action: options?.action,
      onDismiss: options?.onDismiss,
    });
  },

  // Hide snackbar and call onDismiss if provided
  hideSnackbar: () => {
    const { onDismiss } = get();
    
    set({
      visible: false,
      message: "",
      duration: 3000,
      action: undefined,
      onDismiss: undefined,
    });

    // Call onDismiss callback if it exists
    if (onDismiss) {
      onDismiss();
    }
  },
}));

// Hook to use snackbar functionality (for backward compatibility)
export function useSnackbar() {
  return useSnackbarStore();
}
