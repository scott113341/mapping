const GEOMETRY_TYPES = [
  'Point',
  'MultiPoint',
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
  'GeometryCollection'
];


export class FeatureCollection {

  constructor(features=[]) {
    this.type = 'FeatureCollection';
    this.features = features;
  }

}


export class Feature {

  constructor(geometry, properties={}) {
    if (!geometry) throw new Error('Must specify geometry');

    this.type = 'Feature';
    this.geometry = geometry;
    this.properties = properties;
  }

}


export class Geometry {

  constructor(type, coordinates) {
    if (GEOMETRY_TYPES.indexOf(type) < 0) throw 'Invalid geometry type';
    if (!coordinates) throw new Error('Must specify coordinates');

    this.type = type;
    this.coordinates = coordinates;
  }

}
