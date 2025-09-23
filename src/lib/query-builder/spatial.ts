import { createQueryBuilder } from './index';
import { KenyaWardSchema } from './schemas';

export function spatialQuery() {
  const qb = createQueryBuilder<KenyaWardSchema>('kenya_wards');
  
  return {
    // Find wards by point
    findByPoint: (lng: number, lat: number, limit = 10) => 
      qb.select([
        'id', 'ward', 'county', 'constituency', 'ward_code',
        'county_code', 'sub_county', 'constituency_code'
      ])
      .where(`ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1) < 5000`)
      .orderBy('ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1)')
      .limit(limit)
      .build() + ', AsGeoJSON(geom) AS geometry, ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1) AS distance',

    // Find nearest wards to a ward
    findNearestToWard: (wardId: number, limit = 10) =>
      `SELECT 
        w2.id, w2.ward, w2.county, w2.constituency,
        w2.ward_code AS "wardCode", w2.county_code AS "countyCode",
        w2.sub_county AS "subCounty", w2.constituency_code AS "constituencyCode",
        AsGeoJSON(w2.geom) AS geometry,
        ST_Distance(ST_Centroid(w1.geom), ST_Centroid(w2.geom), 1) AS distance
      FROM kenya_wards w1
      JOIN kenya_wards w2 ON w2.id != w1.id
      WHERE w1.id = ${wardId}
      ORDER BY distance
      LIMIT ${limit}`,

    // Check if point is in Kenya
    isPointInKenya: (lng: number, lat: number) =>
      `SELECT 1 FROM country WHERE ST_Contains(geom, MakePoint(${lng}, ${lat}, 4326)) LIMIT 1`,

    // Get ward with geometry
    getWardWithGeometry: (wardId: number) =>
      qb.select()
      .where(`id = ${wardId}`)
      .build().replace('*', '*, AsGeoJSON(geom) AS geometry')
  };
}