import { useDeviceLocation } from "@/hooks/use-device-location";
import { useDebouncedState } from "@tanstack/react-pacer";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Searchbar, Text, useTheme } from "react-native-paper";

interface LatLongFormProps {
  action?: React.ReactNode;
  initLat?: number;
  initLng?: number;
}
export function LatLongForm({ action, initLat, initLng }: LatLongFormProps) {
  const theme = useTheme();
  const { location, manuallySetLocation } = useDeviceLocation();

  const lat = location?.coords.latitude ?? initLat ?? 0;
  const lng = location?.coords.longitude ?? initLng ?? 0;
  const defaultValue = `${lat}, ${lng}`;

  // const debouncedSearchTerm = useDebounce(inputValue, 3000);

  const [searchTerm, setSearchTerm, debouncer] = useDebouncedState(
    defaultValue,
    { wait: 3000 },
    (state) => ({
      isPending: state.isPending,
      lastArgs: state.lastArgs?.[0] as string,
    })
  );

  const handleInputChange = (text: string) => {
    // setImmediateValue(text);
    setSearchTerm(text);
  };
  useEffect(() => {
    if (searchTerm.includes(",")) {
      const [lat, lng] = searchTerm.split(",").map((val) => parseFloat(val.trim()) || 0);
      manuallySetLocation({ lat, lng });
    }
  }, [manuallySetLocation, searchTerm]);

  return (
    <View style={{ width: "100%", height: "100%", flex: 1 }}>
      <Searchbar
        placeholder="-1.2921, 36.8219"
        clearIcon={"close"}
        style={{ flex: 1 }}
        loading={debouncer.state.isPending}
        onChangeText={handleInputChange}
        value={debouncer.state.lastArgs ?? defaultValue}
      />

      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.onSurfaceVariant,
            paddingBottom: 4,
          }}>
          latitude, longitude (comma separated)
        </Text>
      </View>
    </View>
  );
}
