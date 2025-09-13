import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";

export function SingleWard({ ward }: { ward: Partial<KenyaWardsSelect> }) {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.contentContainer}>
      <View style={[styles.card]}>
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

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <MaterialIcon name="code" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text
                variant="labelLarge"
                style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                WARD CODE
              </Text>
              <Text
                variant="titleMedium"
                style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {ward.wardCode}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
  },
});
