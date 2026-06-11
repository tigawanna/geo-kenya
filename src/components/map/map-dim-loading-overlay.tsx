import { KenyaShapeSpinner } from "@/components/state-screens/kenya-shape-spinner";
import { StyleSheet, View } from "react-native";

interface MapDimLoadingOverlayProps {
  spinnerSize?: number;
  showSpinner?: boolean;
  dimOpacity?: number;
}

export function MapDimLoadingOverlay({
  spinnerSize = 110,
  showSpinner = true,
  dimOpacity = 0.42,
}: MapDimLoadingOverlayProps) {
  return (
    <View
      style={[styles.overlay, { backgroundColor: `rgba(0, 0, 0, ${dimOpacity})` }]}
      pointerEvents="none">
      {showSpinner ? <KenyaShapeSpinner size={spinnerSize} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
});
