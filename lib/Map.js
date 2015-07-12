import request from 'request';


const CAL_TOPO_URL = 'http://caltopo.com/m/';


export class Map {

  constructor(mapData) {
    this.data = mapData;

    this.shapes = mapData.Shape;
    this.folders = mapData.Folder;
    this.markers = mapData.Marker;
  }

  roundCoordinates(precision=4) {
    // shapes
    this.shapes.forEach((shape) => {
      shape.coordinates = shape.way.coordinates.map((coordinatePair, i) => {
        return {
          lat: this._round(coordinatePair[0], precision),
          lon: this._round(coordinatePair[1], precision)
        };
      });
      delete shape.way;
    });

    // markers
    this.markers = this.markers.map((marker) => {
      marker.position.lat = this._round(marker.position.lat, precision);
      marker.position.lon = this._round(marker.position.lng, precision);
      delete marker.position.lng;
      return marker;
    });
  }

  calculatePrimaryDirections() {
    this.shapes.forEach((shape) => {
      var first = shape.coordinates[0];
      var last = shape.coordinates[shape.coordinates.length - 1];
      var deltaLat = this._round(last.lat - first.lat);
      var deltaLon = this._round(last.lon - first.lon);
      var ns = ['North', 'South'];
      var ew = ['East', 'West'];
      var primaryDelta = (Math.abs(deltaLat) > Math.abs(deltaLon)) ? 'ns' : 'ew';
      shape.primaryDirections = (Math.abs(deltaLat) > Math.abs(deltaLon)) ? ns : ew;

      if (primaryDelta === 'ns') {
        first.end = (deltaLat > 0) ? 'South' : 'North';
        last.end  = (deltaLat > 0) ? 'North' : 'South';
      }
      else {
        first.end = (deltaLon > 0) ? 'West' : 'East';
        last.end  = (deltaLon > 0) ? 'East' : 'West';
      }

      console.log(shape.label, deltaLat, deltaLon, shape.primaryDirections);
    });
  }

  buildPointCache() {
    this.points = {};
    var points = this.points;

    function addIntersection(lat, lon, object) {
      var key = `${lat},${lon}`;
      if (!points[key]) points[key] = [];
      points[key].push(object);
    }

    // shapes
    this.shapes.forEach((shape) => {
      shape.coordinates.forEach((point) => {
        addIntersection(point.lat, point.lon, shape);
      });
    });

    // markers
    this.markers.forEach((marker) => {
      addIntersection(marker.position.lat, marker.position.lon, marker);
    });
  }

  _round(float, precision=4) {
    return parseFloat(float).toFixed(precision);
  }
}


export function getMap(mapId) {
  var url = CAL_TOPO_URL + mapId;
  console.log(url);
  return new Promise((resolve, reject) => {
    request.get(url, (err, res, body) => {
      if (err) return reject(err);
      var data = body.match(/org\.sarsoft\.preload = (\{.+\})\;/);
      data = JSON.parse(data[1]);
      var map = new Map(data);
      resolve(map);
    });
  });
}
