import { useDeviceLocation } from "@/hooks/use-device-location";

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput, Text, useTheme } from "react-native-paper";

interface LatLongFormProps {
  action?: React.ReactNode;
}
export function LatLongForm({ action }: LatLongFormProps) {
  const { location, manuallySetLocation } = useDeviceLocation();
  const [latLong, setLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const [inputValue, setInputValue] = useState("0,0");

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const [lat, lng] = text.split(',').map(val => parseFloat(val.trim()) || 0);
    setLatLong({ lat, lng });
  };

  const theme = useTheme();

  return (
    <View style={{ gap: 16, padding: 16, width: "100%", height: "100%", flex: 1 }}>
      <View>
        <TextInput
          label="Coordinates"
          mode="outlined"
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="-1.2921, 36.8219"
        />
        <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
          Enter coordinates as: latitude, longitude (comma separated)
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Button
          mode="contained-tonal"
          onPress={() => {
            if (!location) {
              setLatLong({ lat: 0, lng: 0 });
              setInputValue("0,0");
              return;
            }
            const lat = location.coords.latitude;
            const lng = location.coords.longitude;
            setLatLong({ lat, lng });
            setInputValue(`${lat},${lng}`);
          }}>
          Reset
        </Button>

        <Button
          mode="contained-tonal"
          onPress={() => {
            manuallySetLocation(latLong);
          }}>
          Set
        </Button>
        {action}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
