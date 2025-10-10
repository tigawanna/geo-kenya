import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useState } from "react";

interface UseDynamicBottomSheetProps {
  minSnapindex?: number;
  maxSnapindex?: number;
}
export function useDynamicBottomSheet({
  maxSnapindex = 7,
  minSnapindex = 0,
}: UseDynamicBottomSheetProps = {}) {
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const allSnapPoints = useMemo(() => ["5%", "15%", "30%", "50%", "70%", "85%", "100%"], []);
  const snapPoints = useMemo(
    () => allSnapPoints.slice(minSnapindex, maxSnapindex + 1),
    [minSnapindex, maxSnapindex, allSnapPoints]
  );

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
    setIsOpen(index > 0);
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
