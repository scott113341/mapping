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
      shape.way.coordinates = shape.way.coordinates.map((coordinatePair, i) => {
        return {
          lat: this._round(coordinatePair[0], precision),
          lon: this._round(coordinatePair[1], precision)
        };
      });
    });

    // markers
    this.markers = this.markers.map((marker) => {
      marker.position.lat = this._round(marker.position.lat, precision);
      marker.position.lon = this._round(marker.position.lng, precision);
      delete marker.position.lng;
      return marker;
    });
  }

  _round(float, precision) {
    return parseFloat(float).toFixed(precision);
  }
}


export function getMap(mapId) {
  var url = CAL_TOPO_URL + mapId;
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
