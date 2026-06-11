import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTheme } from "react-native-paper";
import { WardSheetHeader } from "./ward-sheet-header";

const SNAP_POINTS = ["20%", "30%", "70%"] as const;
const INITIAL_SNAP_INDEX = 1;

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
    const [sheetIndex, setSheetIndex] = useState(-1);

    useImperativeHandle(forwardedRef, () => sheetRef.current as BottomSheetMethods);

    const handleIndexChange = (index: number) => {
      const nextIndex = index < 0 ? 0 : index;
      setSheetIndex(nextIndex);
      onSheetIndexChange?.(nextIndex);
    };

    useEffect(() => {
      if (!ward?.id) {
        handleIndexChange(-1);
        return;
      }

      handleIndexChange(INITIAL_SNAP_INDEX);
      sheetRef.current?.snapToIndex(INITIAL_SNAP_INDEX);
    }, [ward?.id]);

    if (!ward?.id) {
      return null;
    }

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={[...SNAP_POINTS]}
        index={sheetIndex}
        enablePanDownToClose={false}
        onChange={handleIndexChange}
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
