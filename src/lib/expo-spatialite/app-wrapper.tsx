import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { ExpoSpatialiteProvider } from "@/lib/expo-spatialite/ExpoSpatialiteProvider";
import { logger } from "@/utils/logger";
import { Suspense } from "react";
import { syncWardDb } from "./sync/sync_ward_updates";
import { executeRawQuery } from "@/modules/expo-spatialite";

export function ExpoSpatialiteWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExpoSpatialiteProvider
        databaseName="geo_kenya.db"
        // databaseName="tpp.db"
        checkTableName="kenya_wards"
        assetSource={{ assetId: require("@/assets/geo_kenya.db"), forceOverwrite: true }}
        // location="test"

        onInit={async ({ executeStatement, executeQuery, executePragmaQuery }) => {
          // const wardEventsColumns = await executeRawQuery(`PRAGMA table_info(kenya_ward_events)`);
          // logger.log("📝 kenya_ward_events columns:", wardEventsColumns);

          const wardEventsColumns = await executeRawQuery(`PRAGMA table_info(kenya_ward_events)`);
          logger.log(
            "📝 kenya_ward_updates columns:",
            wardEventsColumns.data.map((t) => t.name)
          );         
          const wardUpdatesColumns = await executeRawQuery(`PRAGMA table_info(kenya_ward_updates)`);
          logger.log("📝 kenya_ward_updates columns:", wardUpdatesColumns.data.map((t)=>t.name));
        }}
        onError={(error) => {
          console.error("\n ❌ Spatialite database error:", error);
          // Log to crash reporting service
          // Show user-friendly error message
        }}>
        {children}
      </ExpoSpatialiteProvider>
    </Suspense>
  );
}
