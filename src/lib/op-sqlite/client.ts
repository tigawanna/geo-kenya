import { ANDROID_DATABASE_PATH, IOS_LIBRARY_PATH, open } from "@op-engineering/op-sqlite";
import { Platform } from "react-native";

export const DATABASE_NAME = "geo_kenya.db";
export const DATABASE_LOCATION = Platform.OS === "ios" ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH;

const db = open({
  name: DATABASE_NAME,
  location: DATABASE_LOCATION,
});

db.loadExtension("libspatialite", "sqlite3_modspatialite_init");

export const opsqliteDb = db;
