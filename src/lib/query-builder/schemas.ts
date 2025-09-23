export interface KenyaWardSchema {
  id?: number;
  ward_code?: string | null;
  ward: string;
  county: string;
  county_code?: number | null;
  sub_county?: string | null;
  constituency: string;
  constituency_code?: number | null;
  minx?: number | null;
  miny?: number | null;
  maxx?: number | null;
  maxy?: number | null;
  geom?: unknown;
}