/**
 * Imports CalTopo JSON to internal MapData.
 */
import request from 'request';

import {jsonClone} from '../util.js';
import * as GeoJson from '../GeoJson.js';
import MapData from '../MapData.js';


export function importData(rawData, options) {
  return new MapData({
    markers: getMarkers(rawData),
    trails: getTrails(rawData),
    groups: getGroups(rawData)
  }, options);
}


export function downloadData(mapId) {
  var url = `http://caltopo.com/m/${mapId}`;
  return new Promise((resolve, reject) => {
    request.get(url, (err, res, body) => {
      if (err) return reject(err);
      var data = body.match(/org\.sarsoft\.preload = (\{.+\})\;/);
      data = JSON.parse(data[1]);
      resolve(data);
    });
  });
}


function getMarkers(rawData) {
  var featureCollection = new GeoJson.FeatureCollection();

  rawData.Marker.forEach((marker) => {
    var coordinates = [
      marker.position.lng,
      marker.position.lat
    ];
    var geometry = new GeoJson.Geometry('Point', coordinates);

    var properties = {
      name: marker.label,
        id: String(marker.id),
        groupId: String(marker.folderId)
    };
    var feature = new GeoJson.Feature(geometry, properties);

    featureCollection.features.push(feature);
  });

  return featureCollection;
}


function getTrails(rawData) {
  var featureCollection = new GeoJson.FeatureCollection();

  rawData.Shape.forEach((shape) => {
    var coordinates = shape.way.coordinates.map(c => [c[1], c[0]]);
    var geometry = new GeoJson.Geometry('LineString', coordinates);

    var properties = {
      name: shape.label,
      id: String(shape.id),
      groupId: String(shape.folderId)
    };
    var feature = new GeoJson.Feature(geometry, properties);

    featureCollection.features.push(feature);
  });

  return featureCollection;
}


function getGroups(rawData) {
  return rawData.Folder.map((folder) => {
    return {
      name: folder.label,
      id: String(folder.id)
    };
  });
}
