import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useState } from "react";

export function useCustomBottomSheetModal() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = useMemo(() => ["5%", "25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
    //  sheetRef.current?.present();
    setIsOpen(index > 0);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.present();
    // sheetRef.current?.snapToIndex(index);
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

export function useCustomBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = useMemo(() => ["5%", "25%", "50%", "90%"], []);

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
