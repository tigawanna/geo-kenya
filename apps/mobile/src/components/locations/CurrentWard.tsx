import {
  checkIsPointInKenyaQueryOptions,
  getWardByLocation,
} from "@/data-access-layer/wards-query-options";
import { hasResolvableCoordinates } from "@/data-access-layer/location-query";
import { useDeviceLocation } from "@/hooks/use-device-location";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { WardWithNeighborsMap } from "./maps/WardWithNeighborsMap.tsx";
import { ClosestWards } from "./proximity/ClosestWards";
import { NotInKenyaMapBanner } from "./proximity/not-in-kenya-map-banner";
import {
  collapseWardInfoSheet,
  WardInfoBottomSheet,
  type WardInfoSheetRef,
} from "./sheets/ward-info-bottom-sheet";

interface CurretWardProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
  homeButton?: boolean;
}

export function CurrentWard({ lat, lng, actions, backButton, homeButton }: CurretWardProps) {
  const theme = useTheme();
  const wardSheetRef = useRef<WardInfoSheetRef>(null);
  const [outsideKenyaDismissed, setOutsideKenyaDismissed] = useState(false);
  const { isLoading: isLocationLoading } = useDeviceLocation();

  const { data, isFetching, isPending } = useQuery(
    getWardByLocation({
      lat,
      lng,
    }),
  );

  const locationResolved = !isLocationLoading && hasResolvableCoordinates(lat, lng);

  const { data: kenyaCheck, isFetching: isKenyaCheckFetching } = useQuery({
    ...checkIsPointInKenyaQueryOptions({ lat, lng }),
    enabled: locationResolved,
  });

  useEffect(() => {
    setOutsideKenyaDismissed(false);
  }, [lat, lng]);

  useEffect(() => {
    if (kenyaCheck?.results === "in_kenya") {
      setOutsideKenyaDismissed(false);
    }
  }, [kenyaCheck?.results]);

  const locationLoading = locationResolved && (isFetching || isPending);
  const showOutsideKenya =
    locationResolved &&
    !isKenyaCheckFetching &&
    kenyaCheck?.results === "outside_kenya" &&
    !outsideKenyaDismissed;

  return (
    <View style={styles.container}>
      <WardWithNeighborsMap
        fillHeight
        wardId={data?.result?.id}
        locationLoading={locationLoading}
        homeButton={homeButton}
        onMapPress={() => collapseWardInfoSheet(wardSheetRef)}
      />

      {showOutsideKenya ? (
        <NotInKenyaMapBanner onDismiss={() => setOutsideKenyaDismissed(true)} />
      ) : null}

      {!locationLoading && !data?.result && locationResolved && kenyaCheck?.results === "in_kenya" ? (
        <View style={styles.emptyHint} pointerEvents="none">
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Tap the map to explore
          </Text>
        </View>
      ) : null}

      <WardInfoBottomSheet
        ref={wardSheetRef}
        ward={data?.result}
        backButton={backButton}
        actions={actions}
        nearbyContent={<ClosestWards lat={lat} lng={lng} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  emptyHint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
});
