// import ExpoSpatialiteModule from "@/modules/expo-spatialite/src/ExpoSpatialiteModule";

const keyna_wards = `
CREATE TABLE kenya_wards IF NOT EXISTS (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	ward_code text,
	ward text NOT NULL,
	county text NOT NULL,
	county_code integer,
	sub_county text,
	constituency text NOT NULL,
	constituency_code integer,
);

SELECT AddGeometryColumn('kenya_wards', 'geom', 4326, 'MULTIPOLYGON', 'XY');
`
const notes = `
CREATE TABLE notes (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	title text,
	content text NOT NULL,
	type text DEFAULT 'note' NOT NULL,
	value real,
	created_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	updated_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
	-- location GEOMETRY
);

SELECT AddGeometryColumn('notes', 'location', 4326, 'POINT', 'XY');
`

export const migrations = [
    keyna_wards,
    notes
]


// function runMigrations(){
//     ExpoSpatialiteModule.executeTransaction(
//         [
//             {sql}
//         ]
//     )
// }

