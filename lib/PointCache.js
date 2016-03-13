export default class PointCache {

  constructor(points, precision) {
    this.cache = {};
    this.precision = precision;
    var cache = this.cache;

    points.forEach((p) => {
      var key = toKey(p, precision);
      if (!cache[key]) cache[key] = {
        features: [],
        coordinates: []
      };
      cache[key].features.push(p.feature);
      cache[key].coordinates.push(p);
    });
  }

  location(point) {
    var key = toKey(point, this.precision);
    return this.cache[key];
  }

}


function toKey(point, precision) {
  return `${point[0].toFixed(precision)},${point[1].toFixed(precision)}`;
}
