import { Snackbar } from "react-native-paper";
import { useSnackbarStore } from "./global-snackbar-store";

export function GlobalSnackbar() {
  const { visible, message, action, duration, hideSnackbar } = useSnackbarStore();

  return (
    <Snackbar
      visible={visible}
      onDismiss={hideSnackbar}
      duration={duration}
      action={action}
      style={{
        marginBottom: 60, // Add some space above tab bar
      }}
    >
      {message}
    </Snackbar>
  );
}

