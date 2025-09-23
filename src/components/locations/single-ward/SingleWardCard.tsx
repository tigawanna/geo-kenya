import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

interface SingleWardCardProps {
  ward: Partial<KenyaWardsSelect>;
  loc?: { lat: number; lng: number };
  backButton?: boolean;
  actions?: ReactNode;
}

export function SingleWardCard({ ward, loc, backButton, actions }: SingleWardCardProps) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Card style={styles.card}>
      <View style={styles.titleRow}>
        {backButton && <IconButton icon="arrow-left" onPress={() => router.back()} />}
        <Text variant="headlineMedium" style={[styles.wardName, { color: theme.colors.onSurface }]}>
          {ward.ward}
        </Text>
        <Text
          variant="titleMedium"
          style={[styles.idText, { color: theme.colors.onPrimaryContainer }]}>
          #{ward.id}
        </Text>
        <IconButton icon="pencil" onPress={() => {
          console.log('Edit ward:', ward.id)
          router.push(`/ward-by-id/${ward.id}/edit`)
          }} />
      </View>

      <View style={styles.infoSection}>
        <View style={styles.compactRow}>
          <View style={{ minWidth: "50%" }}>
            <Text
              variant="bodyMedium"
              style={[styles.compactValue, { color: theme.colors.onSurface }]}>
              {ward.county} county
            </Text>
            {ward.constituency && (
              <Text
                variant="bodyMedium"
                style={[styles.compactValue, { color: theme.colors.onSurface }]}>
                {ward.constituency} constituency
              </Text>
            )}
          </View>
          {actions}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",

    justifyContent: "space-between",
    // marginBottom: 16,
  },
  wardName: {
    fontWeight: "700",
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    flex:1,
    flexDirection: "row",
    alignContent: "center",
    gap: 24,

  },
  compactItem: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    gap: 8,
  },
  compactLabel: {
    letterSpacing: 0.5,
  },
  compactValue: {
    fontWeight: "500",
  },
  subCounty: {
    fontStyle: "italic",
  },
});
