import BottomSheet, {
  BottomSheetView,
  type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
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
      onChange={(idx) => {
        options.handleSheetChange(idx);
        if (idx < 0) {
          options.handleClosePress();
        }
      }}
      index={-1}
      snapPoints={options.snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: theme.colors.background }}>
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
