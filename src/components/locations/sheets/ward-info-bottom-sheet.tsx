import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { useTheme } from "react-native-paper";
import { WardSheetHeader } from "./ward-sheet-header";

export const WARD_SHEET_SNAP_POINTS = ["10%", "30%", "50%", "70%", "90%"] as const;
export const WARD_SHEET_INITIAL_INDEX = 1;

interface WardInfoBottomSheetProps {
  ward: Partial<KenyaWardsSelect> | null | undefined;
  backButton?: boolean;
  actions?: ReactNode;
  nearbyContent: ReactNode;
  onSheetIndexChange?: (index: number) => void;
}

export const WardInfoBottomSheet = forwardRef<BottomSheetMethods, WardInfoBottomSheetProps>(
  function WardInfoBottomSheet(
    { ward, backButton, actions, nearbyContent, onSheetIndexChange },
    forwardedRef,
  ) {
    const theme = useTheme();
    const sheetRef = useRef<BottomSheetMethods>(null);

    useImperativeHandle(forwardedRef, () => sheetRef.current as BottomSheetMethods);

    if (!ward?.id) {
      return null;
    }

    return (
      <BottomSheet
        key={ward.id}
        ref={sheetRef}
        snapPoints={[...WARD_SHEET_SNAP_POINTS]}
        index={WARD_SHEET_INITIAL_INDEX}
        enablePanDownToClose={false}
        onChange={(index) => {
          if (index >= 0) {
            onSheetIndexChange?.(index);
          }
        }}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}>
          <WardSheetHeader ward={ward} backButton={backButton} actions={actions} />
          {nearbyContent}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);
