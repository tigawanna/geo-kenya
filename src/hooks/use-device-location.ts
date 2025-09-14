import * as Location from "expo-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission to access location was denied");
  }
  return await Location.getCurrentPositionAsync({});
}

export function useDeviceLocation() {
  const queryClient = useQueryClient();
  
  const { data: location, error, isLoading,isRefetching,refetch } = useQuery({
    queryKey: ["device-location"],
    queryFn: getCurrentLocation,
    retry: false,
  });

  const { mutate: requestLocationAgain, isPending: isRefreshing } = useMutation({
    mutationFn: getCurrentLocation,
    onSuccess: (data) => {
      queryClient.setQueryData(["device-location"], data);
    },
  });

  return {
    location,
    errorMsg: error?.message || null,
    requestLocationAgain,
    isLoading,
    isRefreshing: isRefreshing || isRefetching,
    refetch
  };
}
