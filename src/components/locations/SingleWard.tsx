import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";

interface SingleWardProps {
  ward: Partial<KenyaWardsSelect>;
  loc?: { lat: number; lng: number };
}

export function SingleWard({ ward,loc }: SingleWardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text
            variant="headlineLarge"
            style={[styles.wardName, { color: theme.colors.onSurface }]}>
            {ward.ward}
          </Text>
          <MaterialIcon
            name="location-on"
            size={32}
            color={theme.colors.primary}
            style={styles.locationIcon}
          />
        </View>
        <View style={[styles.idBadge, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text
            variant="headlineSmall"
            style={[styles.idText, { color: theme.colors.onPrimaryContainer }]}>
            #{ward.id}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="map" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text
              variant="labelLarge"
              style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
              COUNTY
            </Text>
            <Text
              variant="titleMedium"
              style={[styles.infoValue, { color: theme.colors.onSurface }]}>
              {ward.county}
            </Text>
          </View>
        </View>

        {ward.subCounty && (
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <MaterialIcon name="location-city" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text
                variant="labelLarge"
                style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                SUB-COUNTY
              </Text>
              <Text
                variant="titleMedium"
                style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {ward.subCounty}
              </Text>
            </View>
          </View>
        )}

        {ward.constituency && (
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <MaterialIcon name="account-balance" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text
                variant="labelLarge"
                style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                CONSTITUENCY
              </Text>
              <Text
                variant="titleMedium"
                style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {ward.constituency}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 26,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  wardName: {
    fontWeight: "700",
    marginRight: 12,
  },
  locationIcon: {
    marginTop: 4,
  },
  idBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  idText: {
    fontWeight: "700",
  },
  infoSection: {
    gap: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    paddingTop: 4,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    marginBottom: 4,
    letterSpacing: 1.5,
  },
  infoValue: {
    fontWeight: "500",
  },
});
