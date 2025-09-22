import { isPointInkenya } from "@/data-access-layer/location-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  // console.log("status", status);
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }
  return await Location.getCurrentPositionAsync({
    mayShowUserSettingsDialog: true,
    accuracy: Location.Accuracy.High,
    // timeInterval: 1000 * 1 * 1, // 1 minutes
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
    // refetchInterval: 1000 * 60 * 1, // 1 minutes
    retry: false,
  });

  const { mutate: requestLocationAgain, isPending: isRefreshing } = useMutation({
    mutationFn: getCurrentLocation,
    onSuccess: (data, _, ctx) => {
      queryClient.setQueryData(["device-location"], data);
    },
  });

  async function manuallySetLocation({ lat, lng }: { lat: number; lng: number }) {
    const oldlocation = queryClient.getQueryData<Location.LocationObject>(["device-location"]);
    // logger.log("oldlocation", oldlocation);
    const is_valid_point = await isPointInkenya({ lat, lng });
    if (is_valid_point.results) {
      queryClient.setQueryData(["device-location"], {
        ...oldlocation,
        mocked: true,
        coords: {
          ...oldlocation?.coords,
          latitude: lat,
          longitude: lng,
        },
      });
    }
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
