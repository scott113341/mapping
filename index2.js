import fs from 'fs';
import qs from 'qs';
import request from 'request';
import xml2js from 'xml2js';

import * as config from './config/config';

import * as Map from './lib/Map';


var mapId = '602T';


Map.getMap(mapId)
  .then((map) => {
    map.roundCoordinates();
    console.log(JSON.stringify(map, null, 2));
  });
