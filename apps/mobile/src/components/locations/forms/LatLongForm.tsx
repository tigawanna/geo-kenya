import { useDeviceLocation } from "@/hooks/use-device-location";
import { useDebouncedState } from "@tanstack/react-pacer";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";

interface LatLongFormProps {
  action?: React.ReactNode;
  initLat?: number;
  initLng?: number;
}

export function LatLongForm({ initLat, initLng }: LatLongFormProps) {
  const { location, manuallySetLocation } = useDeviceLocation();
  const [inputValue, setInputValue] = React.useState("");

  const lat = location?.coords.latitude ?? initLat ?? -1.2921;
  const lng = location?.coords.longitude ?? initLng ?? 36.8219;
  const placeholder = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  const [searchTerm, setSearchTerm, debouncer] = useDebouncedState("", { wait: 3000 }, (state) => ({
    isPending: state.isPending,
    lastArgs: state.lastArgs?.[0] as string,
  }));

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setSearchTerm(text);
  };

  useEffect(() => {
    if (searchTerm.includes(",")) {
      const [nextLat, nextLng] = searchTerm.split(",").map((val) => parseFloat(val.trim()) || 0);
      manuallySetLocation(nextLat, nextLng);
    }
  }, [manuallySetLocation, searchTerm]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        inputStyle={styles.input}
        style={styles.searchbar}
        clearIcon="close"
        loading={debouncer.state.isPending}
        onChangeText={handleInputChange}
        onClearIconPress={() => {
          setInputValue("");
          setSearchTerm("");
        }}
        value={inputValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchbar: {
    minHeight: 52,
    borderRadius: 12,
  },
  input: {
    minHeight: 24,
    fontSize: 15,
  },
});
