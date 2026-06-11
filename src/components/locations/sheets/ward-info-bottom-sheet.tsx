import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheet as BottomSheetType,
} from "@gorhom/bottom-sheet";
import { forwardRef, type RefObject, ReactNode, useImperativeHandle, useMemo, useRef } from "react";
import { Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WardSheetHeader } from "./ward-sheet-header";

export const WARD_SHEET_SNAP_POINTS = ["10%", "30%", "50%", "70%", "90%"] as const;
export const WARD_SHEET_MIN_INDEX = 0;
export const WARD_SHEET_INITIAL_INDEX = 1;

const TAB_BAR_HEIGHT = 56;

export type WardInfoSheetRef = BottomSheetType;

interface WardInfoBottomSheetProps {
  ward: Partial<KenyaWardsSelect> | null | undefined;
  backButton?: boolean;
  actions?: ReactNode;
  nearbyContent: ReactNode;
  onSheetIndexChange?: (index: number) => void;
}

export const WardInfoBottomSheet = forwardRef<WardInfoSheetRef, WardInfoBottomSheetProps>(
  function WardInfoBottomSheet(
    { ward, backButton, actions, nearbyContent, onSheetIndexChange },
    forwardedRef,
  ) {
    const theme = useTheme();
    const sheetRef = useRef<BottomSheetType>(null);
    const insets = useSafeAreaInsets();
    const bottomInset = Platform.OS === "ios" ? TAB_BAR_HEIGHT + insets.bottom : 0;
    const snapPoints = useMemo(() => [...WARD_SHEET_SNAP_POINTS], []);

    useImperativeHandle(forwardedRef, () => sheetRef.current as BottomSheetType);

    if (!ward?.id) {
      return null;
    }

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={WARD_SHEET_INITIAL_INDEX}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        bottomInset={bottomInset}
        onChange={(index) => {
          if (index >= 0) {
            onSheetIndexChange?.(index);
          }
        }}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}>
          <WardSheetHeader ward={ward} backButton={backButton} actions={actions} />
          {nearbyContent}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

export function collapseWardInfoSheet(ref: RefObject<WardInfoSheetRef | null>) {
  ref.current?.snapToIndex(WARD_SHEET_MIN_INDEX);
}
