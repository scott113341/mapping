import _ from 'lodash';
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
    map.buildPointCache();

    _.forOwn(map.points, (intersection, key) => {
      if (intersection.length > 1) {
        console.log('point', key, 'is shared by', intersection.map(i => i.label).join(', '));
      }
    });

    return map;
  })

  .then((map) => {
    map.calculatePrimaryDirections();
    return map;
  })

  .then((map) => {
    map.buildPointCache();

    _.forOwn(map.points, (intersection, key) => {
      if (intersection.length > 1) {
        console.log('point', key, 'is shared by', intersection.map(i => {

          if (i.coordinates) {
            var lastIndex = i.coordinates.length - 1;
            if (`${i.coordinates[0].lat},${i.coordinates[0].lon}` === key) {
              return `${i.label} (${i.coordinates[0].end} end)`;
            }
            if (`${i.coordinates[lastIndex].lat},${i.coordinates[lastIndex].lon}` === key) {
              return `${i.label} (${i.coordinates[lastIndex].end} end)`;
            }
          }

          return i.label;
        }).join(', '));
      }
    });

    return map;
  })




  .catch((err) => {
    console.log('error');
    console.log(err);
  });
