export const KENYA_CENTER: [number, number] = [37.9, 0.2];

export const KENYA_DEFAULT_ZOOM = 5.5;

export const KENYA_BBOX = {
  minLng: 33.9,
  maxLng: 41.9,
  minLat: -4.7,
  maxLat: 5.0,
};

export function isPointInKenyaBounds(lat: number, lng: number): boolean {
  return (
    lng >= KENYA_BBOX.minLng &&
    lng <= KENYA_BBOX.maxLng &&
    lat >= KENYA_BBOX.minLat &&
    lat <= KENYA_BBOX.maxLat
  );
}
