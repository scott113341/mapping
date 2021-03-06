import _ from 'lodash';
import fs from 'fs';
import path from 'path';

import * as config from './config/config.js';

import MapData from './lib/MapData.js';
import * as CalTopoImporter from './lib/importers/CalTopoImporter.js';
import * as util from './lib/util.js';


//var mapId = '602T';
var mapId = '112D';


CalTopoImporter.downloadData(mapId)
  .then((data) => {
    var mapData = CalTopoImporter.importData(data);
    console.log(JSON.stringify(mapData, null, 2));

    return mapData;
  })

  .then((mapData) => {

    console.log(mapData.markers.features);

    var trailhead1 = mapData.markers.features[0];
    var peak1 = mapData.markers.features[1];

    console.log(mapData.pointCache.location(trailhead1.geometry.coordinates));

    mapData.buildGraph();



    //console.log(mapData.route());

  })



  /*
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
  */




  .catch((err) => {
    console.log('error');
    console.log(err);
  });
