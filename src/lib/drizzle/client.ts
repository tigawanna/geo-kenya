import { ExpoSpatialiteDrizzle } from "@/modules/expo-spatialite";
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema  from './schema';

const spatialiteAdapter = new ExpoSpatialiteDrizzle();

export const db = drizzle(spatialiteAdapter.driver,{
    schema
});

