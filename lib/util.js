/**
 * Returns a distance magnitude between two points.
 * @param point1
 * @param point2
 * @returns {number}
 */
export function distance(point1, point2) {
  var delLat = Math.pow(point1.lat - point2.lat, 2);
  var delLon = Math.pow(point1.lon - point2.lon, 2);
  return Math.sqrt(delLat + delLon);
}
