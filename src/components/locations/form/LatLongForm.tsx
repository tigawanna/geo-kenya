import { getMaterialIconName } from "@/components/default/ui/icon-symbol";
import { useDeviceLocation } from "@/hooks/use-device-location";

import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Searchbar, Text, useTheme } from "react-native-paper";

interface LatLongFormProps {
  action?: React.ReactNode;
  initLat?: number;
  initLng?: number;
}
export function LatLongForm({ action, initLat, initLng }: LatLongFormProps) {
  const { location, manuallySetLocation, isLoading } = useDeviceLocation();
  const [latLong, setLatLong] = useState({
    lat: location?.coords.latitude ?? initLat ?? 0,
    lng: location?.coords.longitude ?? initLng ?? 0,
  });
  const [inputValue, setInputValue] = useState(`${latLong.lat}, ${latLong.lng}`);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const [lat, lng] = text.split(",").map((val) => parseFloat(val.trim()) || 0);
    setLatLong({ lat, lng });
  };

  const theme = useTheme();

  return (
    <View style={{ width: "100%", height: "100%", flex: 1 }}>
      <View style={{ flexDirection: "row", gap: 4, width: "100%" }}>
        <Searchbar
          placeholder="-1.2921, 36.8219"
          style={{ flex: 1 }}
          onChangeText={handleInputChange}
          value={inputValue}
          right={() => {
            return (
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <IconButton
                  onPress={() => {
                    manuallySetLocation(latLong);
                  }}
                  mode="contained-tonal"
                  icon={getMaterialIconName("arrow-right")}
                  loading={isLoading}
                />
                {action}
              </View>
            );
          }}
        />
        {/* <TextInput
          label="Coordinates"
          mode="outlined"
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="-1.2921, 36.8219"
          style={{ flex: 1 }}
        /> */}
        {/* <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <IconButton
            onPress={() => {
              manuallySetLocation(latLong);
            }}
            mode="contained-tonal"
            icon={getMaterialIconName("arrow-right")}
          />
          {action}
        </View> */}
      </View>
      <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
        latitude, longitude (comma separated)
      </Text>
    </View>
  );
}
