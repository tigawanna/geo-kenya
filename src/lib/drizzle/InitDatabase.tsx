import { MaterialIcon } from "@/components/default/ui/icon-symbol";
import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { bootstrapSyncData } from "@/lib/sync/bootstrap-sync-data";
import {
  ensureKenyaWardGeometriesReady,
  registerGeometryColumn,
} from "@/lib/sync/apply-sync-events";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";
import { db, ensureSpatialMetadata, resetLocalDatabase } from "./client";
import { runMigrations } from "./run-migrations";

function normalizeBootstrapError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

function logBootstrapError(err: unknown): Error {
  const error = normalizeBootstrapError(err);
  console.error("[InitDatabase] Database initialization failed");
  console.error("[InitDatabase] message:", error.message);
  if (error.stack) {
    console.error("[InitDatabase] stack:", error.stack);
  }
  console.error("[InitDatabase] raw error:", err);
  return error;
}

interface InitDatabaseProps {
  children?: React.ReactNode;
}

export function InitDatabase({ children }: InitDatabaseProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (process.env.EXPO_PUBLIC_RESET_DATABASE === "1") {
          resetLocalDatabase();
        }

        await ensureSpatialMetadata();
        await runMigrations();
        await registerGeometryColumn(db);
        await bootstrapSyncData(db);
        await ensureKenyaWardGeometriesReady(db);

        if (!cancelled) {
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(logBootstrapError(err));
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <DatabaseInitError error={error} />;
  }

  if (!ready) {
    return <LoadingFallback />;
  }

  return children;
}

interface DatabaseInitErrorProps {
  error: Error;
}

function DatabaseInitError({ error }: DatabaseInitErrorProps) {
  const { colors } = useTheme();

  return (
    <Surface style={[styles.errorContainer, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.errorContent}>
        <View style={styles.errorIcon}>
          <MaterialIcon name="error-outline" color={colors.error} size={72} />
        </View>

        <Text variant="headlineSmall" style={[styles.errorTitle, { color: colors.error }]}>
          Database setup failed
        </Text>

        <Text variant="bodyLarge" style={[styles.errorSubtitle, { color: colors.onSurface }]}>
          The app could not initialize its local database.
        </Text>

        <Card style={[styles.errorCard, { backgroundColor: colors.surfaceContainerHigh }]}>
          <Card.Content style={styles.errorCardContent}>
            <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
              Error details
            </Text>
            <Text
              selectable
              variant="bodyMedium"
              style={[styles.errorMessage, { color: colors.onSurface }]}>
              {error.message}
            </Text>
          </Card.Content>
        </Card>

        <Text variant="bodySmall" style={[styles.errorHint, { color: colors.onSurfaceVariant }]}>
          Full logs are printed in the Metro terminal. If this keeps happening, restart with
          EXPO_PUBLIC_RESET_DATABASE=1.
        </Text>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
  },
  errorContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  errorIcon: {
    alignItems: "center",
    marginBottom: 8,
  },
  errorTitle: {
    textAlign: "center",
    fontWeight: "700",
  },
  errorSubtitle: {
    textAlign: "center",
    lineHeight: 24,
  },
  errorCard: {
    marginTop: 8,
  },
  errorCardContent: {
    gap: 8,
  },
  errorMessage: {
    lineHeight: 22,
  },
  errorHint: {
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});
