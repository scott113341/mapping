import fs from 'fs';
import qs from 'qs';
import request from 'request';
import xml2js from 'xml2js';

import * as config from './config/config';


var fileName = config.FILE_NAME;
//fileName = 'other.gpx';
var inFileName = `./in/${fileName}`;
var outFileName = `./out/${fileName}`;
var inFile = fs.readFileSync(inFileName, { encoding: 'utf-8' });


xml2js.parseString(inFile, (err, result) => {
  var folders = getFolders(result);
  var waypoints = result.gpx.wpt;
  var routes = result.gpx.rte;

  getElevations(waypoints)
    .then((elevations) => {
      if (!elevations) return;
      waypoints.forEach((wpt, i) => {
        wpt.sym = getSymbol(wpt, folders);
        wpt.ele = Math.round(elevations[i] * config.FEET_IN_METER);
        wpt.$.lat = round(wpt.$.lat);
        wpt.$.lon = round(wpt.$.lon);
        delete wpt.cmt;
        delete wpt.desc;
        return wpt;
      });
    })
    .then(() => {
      routes.forEach((route) => {
        delete route.desc;

        var points = route.rtept;
        points.forEach((point) => {
          delete point.name;
          point.$.lat = round(point.$.lat);
          point.$.lon = round(point.$.lon);
        });
      });
    })
    .then(() => {
      var builder = new xml2js.Builder({ cdata: true });
      var xml = builder.buildObject(result);
      //console.log(xml);
      fs.writeFileSync(outFileName, xml);
    })
    .catch((err) => {
      console.log(err);
    });
});


function getFolders(xml) {
  var folders = {};
  decodeURIComponent(xml.gpx.metadata[0].desc[0])
    .split('&')
    .forEach((folder, i) => {
      if (i === 0) folder = folder.replace('Folder=', '');
      folder = folder.split('=');
      folders[folder[0]] = folder[1];
    });
  return folders;
}

function round(n) {
  return parseFloat(n).toFixed(4);
}

function getSymbol(wpt, folders) {
  var folderId = qs.parse(wpt.desc[0]).folderId;
  var folder = folders[folderId];
  var folderConfig = config.FOLDERS[folder];
  return folderConfig.symbol;
}

function getElevations(waypoints) {
  if (!waypoints) return Promise.resolve(false);
  var getElevationLimited = RateLimit(getElevation, 250);
  var promises = waypoints.map((wpt) => {
    return getElevationLimited(wpt);
  });
  return Promise.all(promises);
}

function getElevation(wpt, resolve, reject) {
  var point = wpt['$'];
  console.log(point);
  var url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${point.lat},${point.lon}&key=${config.GOOGLE_API_KEY}`;
  var options = {
    url: url,
    json: true
  };
  request.get(options, (err, res, body) => {
    if (err) return reject(err);
    resolve(body.results[0].elevation);
  });
}


function RateLimit(fn, delay=0, context=null) {
  var queue = [];
  var timer;
  if (!fn) throw 'Function is required';

  function processQueue() {
    if (queue.length) {
      var fnInstance = queue.shift();
      fn.apply(fnInstance.context, fnInstance.arguments);
    }
    else {
      clearInterval(timer);
    }
  }

  return function() {
    return new Promise((resolve, reject) => {
      queue.push({
        context: context,
        arguments: [].slice.call(arguments).concat([resolve, reject])
      });
      if (!timer) {
        processQueue();
        timer = setInterval(processQueue, delay);
      }
    });
  }
}
