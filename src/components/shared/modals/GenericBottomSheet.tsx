import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  children: React.ReactNode;
  options: {
    sheetRef: React.RefObject<BottomSheetMethods | null>;
    snapPoints: string[];
    isOpen: boolean;
    handleSheetChange: (index: number) => void;
    handleSnapPress: (index: number) => void;
    handleClosePress: () => void;
  };
}
export function GenericBottomSheet({ options, children }: Props) {
  const theme = useTheme();

  return (
    <BottomSheet
      ref={options.sheetRef}
      onChange={(idx, position, type) => {
        if (idx < 2) options.handleClosePress();
        options.handleSheetChange(idx);
      }}
      index={-1}
      snapPoints={options.snapPoints}
      enableDynamicSizing={false}
      style={{ height: "auto" }}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleStyle={{ backgroundColor: theme.colors.elevation.level4 }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}>
      <BottomSheetView
        style={{ ...styles.contentContainer, backgroundColor: theme.colors.surface }}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
