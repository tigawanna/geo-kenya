export function calculateBBox(geometry: any): [number, number, number, number] | null {
  if (!geometry || !geometry.coordinates) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const processCoords = (coords: any) => {
    if (typeof coords[0] === 'number') {
      const [x, y] = coords;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    } else {
      coords.forEach(processCoords);
    }
  };

  processCoords(geometry.coordinates);

  return isFinite(minX) ? [minX, minY, maxX, maxY] : null;
}