import fs from 'fs';
import qs from 'qs';
import request from 'request';
import xml2js from 'xml2js';

import * as config from './config/config';

import * as Map from './lib/Map';
import * as util from './lib/util';


var mapId = '602T';


Map.getMap(mapId)
  .then((map) => {
    map.roundCoordinates();
    console.log(JSON.stringify(map, null, 2));
    return map;
  })

  .then((map) => {
    map.shapes.forEach((shape) => {
      shape.way.coordinates.forEach((point) => {
        map.markers.forEach((marker) => {
          if (point.lat === marker.position.lat && point.lon === marker.position.lon) console.log('Marker', marker.label, 'lies on', shape.label);
        });
      });
    });
  });
