import { NativeModule, registerWebModule } from "expo";
import { PragmaQueryResult, SpatialiteRow } from "./ExpoSpatialiteModule";

class ExpoSpatialiteModule extends NativeModule {
  getSpatialiteVersion(): string {
    throw new Error("ExpoSpatialite is not available on web");
  }

  async executeQuery(): Promise<any[]> {
    throw new Error("ExpoSpatialite is not available on web");
  }

  async executeStatement(): Promise<number> {
    throw new Error("ExpoSpatialite is not available on web");
  }

  async initializeDatabase(): Promise<boolean> {
    throw new Error("ExpoSpatialite is not available on web");
  }

  async testFileHandling(): Promise<any> {
    throw new Error("ExpoSpatialite is not available on web");
  }

  async executePragmaQuery<T extends SpatialiteRow = SpatialiteRow>(
    pragma: string
  ): Promise<PragmaQueryResult<T>> {
    throw new Error("ExpoSpatialite is not available on web");
  }
}

export default registerWebModule(ExpoSpatialiteModule, "ExpoSpatialiteModule");
