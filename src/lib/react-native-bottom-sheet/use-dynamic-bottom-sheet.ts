import type { BottomSheetMethods } from "@expo/ui/community/bottom-sheet";
import { useRef, useMemo, useCallback, useState } from "react";

interface UseDynamicBottomSheetProps {
  minSnapindex?: number;
  maxSnapindex?: number;
}
export function useDynamicBottomSheet({
  maxSnapindex = 7,
  minSnapindex = 0,
}: UseDynamicBottomSheetProps = {}) {
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [isOpen, setIsOpen] = useState(false);
  const allSnapPoints = useMemo(() => ["5%", "15%", "30%", "50%", "70%", "85%", "100%"], []);
  const snapPoints = useMemo(
    () => allSnapPoints.slice(minSnapindex, maxSnapindex + 1),
    [minSnapindex, maxSnapindex, allSnapPoints]
  );

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    setIsOpen(index >= 0);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return {
    sheetRef,
    snapPoints,
    isOpen,
    handleSheetChange,
    handleSnapPress,
    handleClosePress,
  };
}
