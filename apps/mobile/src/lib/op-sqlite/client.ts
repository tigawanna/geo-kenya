import { ANDROID_DATABASE_PATH, IOS_LIBRARY_PATH, open, type DB } from "@op-engineering/op-sqlite";
import { Platform } from "react-native";

export const DATABASE_NAME = "geo_kenya.db";
export const DATABASE_LOCATION = Platform.OS === "ios" ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH;

function createDatabase(): DB {
  const connection = open({
    name: DATABASE_NAME,
    location: DATABASE_LOCATION,
  });
  connection.loadExtension("libspatialite", "sqlite3_modspatialite_init");
  return connection;
}

let database = createDatabase();

export function getOpsqliteDb(): DB {
  return database;
}

export function reopenOpsqliteDb(): DB {
  database = createDatabase();
  return database;
}
