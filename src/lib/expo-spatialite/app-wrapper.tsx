import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { ExpoSpatialiteProvider } from "@/lib/expo-spatialite/ExpoSpatialiteProvider";
import { Suspense } from "react";

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
