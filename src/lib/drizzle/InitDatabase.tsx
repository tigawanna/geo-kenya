import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import migrations from "@/drizzle/migrations";
import { bootstrapSyncData } from "@/lib/sync/bootstrap-sync-data";
import { migrate } from "drizzle-orm/op-sqlite/migrator";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { db, ensureSpatialMetadata, resetLocalDatabase } from "./client";

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

        await migrate(db, migrations);
        await ensureSpatialMetadata();
        await bootstrapSyncData(db);

        if (!cancelled) {
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text>Database initialization failed: {error.message}</Text>
      </View>
    );
  }

  if (!ready) {
    return <LoadingFallback />;
  }

  return children;
}
