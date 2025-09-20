import * as Location from "expo-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logger } from "@/utils/logger";

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  // console.log("status", status);
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }
  return await Location.getCurrentPositionAsync({
    mayShowUserSettingsDialog: true,
    accuracy: Location.Accuracy.High,
    timeInterval: 1000 * 1 * 1, // 1 minutes
  });
}

export function useDeviceLocation() {
  const queryClient = useQueryClient();

  const {
    data: location,
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["device-location"],
    queryFn: getCurrentLocation,
    refetchInterval: 1000 * 60 * 1, // 1 minutes
    retry: false,
  });

  const { mutate: requestLocationAgain, isPending: isRefreshing } = useMutation({
    mutationFn: getCurrentLocation,
    onSuccess: (data, _, ctx) => {
      queryClient.setQueryData(["device-location"], data);
    },
  });

  function manuallySetLocation({ lat, lng }: { lat: number; lng: number }) {
    const oldlocation = queryClient.getQueryData<Location.LocationObject>(["device-location"]);
    logger.log("oldlocation", oldlocation);
    queryClient.setQueryData(["device-location"], {
      ...oldlocation,
      coords: {
        ...oldlocation?.coords,
        latitude: lat,
        longitude: lng,
      },
    });
    
  }

  return {
    location,
    errorMsg: error?.message || null,
    requestLocationAgain,
    manuallySetLocation,
    isLoading,
    isRefreshing: isRefreshing || isRefetching,
    refetch,
  };
}
