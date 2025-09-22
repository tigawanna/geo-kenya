import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

interface SingleWardCardProps {
  ward: Partial<KenyaWardsSelect>;
  loc?: { lat: number; lng: number };
  backButton?: boolean;
}

export function SingleWardCard({ ward, loc, backButton }: SingleWardCardProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        {backButton ? (
          <Text
            variant="headlineMedium"
            style={[styles.wardName, { color: theme.colors.onSurface }]}>
            {ward.ward}
          </Text>
        ) : null}
        <View style={[styles.idBadge, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text
            variant="titleMedium"
            style={[styles.idText, { color: theme.colors.onPrimaryContainer }]}>
            #{ward.id}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.compactRow}>
          <View style={styles.compactItem}>
            <Text
              variant="labelSmall"
              style={[styles.compactLabel, { color: theme.colors.onSurfaceVariant }]}>
              COUNTY
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.compactValue, { color: theme.colors.onSurface }]}>
              {ward.county}
            </Text>
          </View>
          {ward.constituency && (
            <View style={styles.compactItem}>
              <Text
                variant="labelSmall"
                style={[styles.compactLabel, { color: theme.colors.onSurfaceVariant }]}>
                CONSTITUENCY
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.compactValue, { color: theme.colors.onSurface }]}>
                {ward.constituency}
              </Text>
            </View>
          )}
        </View>
        {ward.subCounty && (
          <Text
            variant="bodySmall"
            style={[styles.subCounty, { color: theme.colors.onSurfaceVariant }]}>
            Sub-County: {ward.subCounty}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  wardName: {
    fontWeight: "700",
    flex: 1,
  },
  idBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  idText: {
    fontWeight: "600",
  },
  infoSection: {
    gap: 8,
  },
  compactRow: {
    flexDirection: "row",
    gap: 24,
  },
  compactItem: {
    flex: 1,
  },
  compactLabel: {
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  compactValue: {
    fontWeight: "500",
  },
  subCounty: {
    fontStyle: "italic",
  },
});
