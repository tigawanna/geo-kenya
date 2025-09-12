import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { ExpoSpatialiteProvider } from "@/lib/expo-spatialite/ExpoSpatialiteProvider";
import { Suspense } from "react";

export function ExpoSpatialiteWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExpoSpatialiteProvider
        databaseName="lokeshen.db"
        // databaseName="tpp.db"
        // assetSource={{ assetId: require("@/assets/kenya_wards.db"), forceOverwrite: true }}
        // location="test"

        onInit={async ({ executeStatement, executeQuery, executePragmaQuery }) => {
          // await executeStatement("PRAGMA synchronous=NORMAL"); // Faster writes
          // const funs = await executeQuery(
          //   `
          //   SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'spatial_ref_sys'

          //   `
          // ); // Write-Ahead Logging
          // console.log("\n 📝 PRAGMA function_list:", funs);
          // await executeStatement("PRAGMA mmap_size=268435456"); // 256MB memory mapping
          // Performance optimizations
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
