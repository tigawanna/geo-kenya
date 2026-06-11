import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

interface WardSheetHeaderProps {
  ward: Partial<KenyaWardsSelect>;
  backButton?: boolean;
  actions?: ReactNode;
}

export function WardSheetHeader({ ward, backButton, actions }: WardSheetHeaderProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {backButton ? <IconButton icon="arrow-left" onPress={() => router.back()} /> : null}
        <Text
          variant="headlineSmall"
          style={[styles.wardName, { color: theme.colors.onSurface }]}
          numberOfLines={2}>
          {ward.ward}
        </Text>
        <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
          #{ward.id}
        </Text>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => router.push(`/ward-by-id/${ward.id}/edit`)}
        />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaText}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {ward.county} county
          </Text>
          {ward.constituency ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {ward.constituency} constituency
            </Text>
          ) : null}
          {ward.subCounty ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {ward.subCounty}
            </Text>
          ) : null}
        </View>
        {actions}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  wardName: {
    flex: 1,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  metaText: {
    flex: 1,
    gap: 2,
  },
});
