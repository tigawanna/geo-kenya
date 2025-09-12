import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { AppState, AppStateStatus, Platform } from "react-native";
import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

export function useOnlineManager() {
    if(Platform.OS === "web") return
    // For Expo Go
    // React Query already supports in web browser refetch on window focus by default 
 onlineManager.setEventListener((setOnline) => {
   const eventSubscription = Network.addNetworkStateListener((state) => {
     setOnline(!!state.isConnected);
   });
   return eventSubscription.remove;
 });
}

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}



export function useAppState(onChange: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onChange);
    return () => {
      subscription.remove();
    };
  }, [onChange]);
}



export function useRefreshByUser(refetch: () => Promise<unknown>) {
  const [isRefetchingByUser, setIsRefetchingByUser] = React.useState(false);

  async function refetchByUser() {
    setIsRefetchingByUser(true);

    try {
      await refetch();
    } finally {
      setIsRefetchingByUser(false);
    }
  }

  return {
    isRefetchingByUser,
    refetchByUser,
  };
}


