import { KenyaShapeSpinner } from "@/components/state-screens/kenya-shape-spinner";
import { StyleSheet, View } from "react-native";

interface MapDimLoadingOverlayProps {
  spinnerSize?: number;
}

export function MapDimLoadingOverlay({ spinnerSize = 110 }: MapDimLoadingOverlayProps) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <KenyaShapeSpinner size={spinnerSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.42)",
    zIndex: 10,
    elevation: 10,
  },
});
