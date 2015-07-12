/**
 * Imports CalTopo JSON to internal MapData.
 */
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


function getMarkers(rawData) {
  var featureCollection = new GeoJson.FeatureCollection();

  rawData.Marker.forEach((marker) => {
    //if(marker.label !== 'Horseshoe Lake') return;

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
    //if(shape.label !== 'Bear Creek Trail') return;

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
