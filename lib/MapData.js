import request from 'request';
import _ from 'lodash';
import {Graph} from 'graphlib';

import PointCache from './PointCache.js';


const defaultRoundingPrecision = 4;


export default class MapData {

  constructor({markers, trails, groups}) {
    this.markers = markers;
    this.trails = trails;
    this.groups = groups;

    this.pointCache = {};

    this
      .associateGroups()
      .roundCoordinates()
      .buildPointCache();
  }


  associateGroups() {
    var indexedGroups = _.indexBy(this.groups, 'id');
    this.allFeatures().forEach((feature) => {
      var groupId = feature.properties.groupId;
      feature.properties.group = indexedGroups[groupId];
    });
    return this;
  }


  allMarkers() {
    return this.markers.features;
  }


  allTrails() {
    return this.trails.features;
  }


  allFeatures() {
    return [].concat(this.allMarkers()).concat(this.allTrails());
  }


  allCoordinatePairs() {
    var coordinatePairs = [];
    this.allFeatures().forEach((feature) => {
      var coordinates = feature.geometry.coordinates;
      if (Array.isArray(coordinates[0])) {
        coordinates.forEach(cp => {
          cp.feature = feature;
          coordinatePairs.push(cp);
        });
      }
      else {
        coordinates.feature = feature;
        coordinatePairs.push(coordinates);
      }
    });
    return coordinatePairs;
  }


  roundCoordinates(precision=defaultRoundingPrecision) {
    this.allCoordinatePairs().forEach((cp) => {
      cp.forEach((c, i) => cp[i] = round(c, precision));
    });
    return this;
  }


  buildPointCache() {
    var cps = this.allCoordinatePairs();
    this.pointCache = new PointCache(cps, defaultRoundingPrecision);
    return this;
  }


  /**
   * A Node is defined as a shared coordinate where:
   *   1) a trail meets a marker
   *   2) two trails meet
   */
  buildGraph() {
    var g = new Graph();
    this.graph = g;


    const TRAIL_MARKER = 'TRAIL_MARKER';
    const TRAIL_TRAIL = 'TRAIL_TRAIL';

    console.log('\n\n\n');
    console.log('#################################################################');



    _.forOwn(this.pointCache.cache, (point, key) => {

      // if there are multiple features at this point, it could be a node
      if (point.features.length > 1) {

        // assume not a node
        point.isNode = false;
        console.log('\n\nlocation', key, 'has', point.features.length, 'things:');

        // for each feature at this coordinate
        point.features.forEach((f, i, features) => {
          console.log('  ', f.properties.name);

          // if it's a Point
          if (f.geometry.type === 'Point') {
            console.log('     is Point', 'YES');
            return point.isNode = true;
          }

          // if it's the first or last point in a LineString
          if (isLineString(f)) {
            console.log('     is LineString');
            var first = f.geometry.coordinates[0];
            var last = f.geometry.coordinates[f.geometry.coordinates.length - 1];
            if (this.pointCache.location(first) === this.pointCache.location(point.coordinates[0])) {
              console.log('     is first YES');
              return point.isNode = true;
            }
            if (this.pointCache.location(last) === this.pointCache.location(point.coordinates[0])) {
              console.log('     is last YES');
              return point.isNode = true;
            }
          }

          // if it's the first point where two LineStrings meet
          if (isLineString(f)) {

            // this point's index
            var thisIndex = _.indexOf(f.geometry.coordinates, point.coordinates[i]);

            features.forEach((otherFeature, ii) => {
              if (otherFeature === f || !isLineString(otherFeature)) return;
              console.log('     checking against', otherFeature.properties.name);

              // not if this feature's previous point intersects with otherFeature
              //console.log(f.geometry.coordinates);
              console.log('       ', 'thisIndex', thisIndex);
              var thisPrevious = f.geometry.coordinates[thisIndex - 1];

              console.log('       ', 'i', i);
              console.log('       ', 'ii', ii);
              var otherIndex = _.indexOf(otherFeature.geometry.coordinates, point.coordinates[ii]);
              console.log('       ', 'otherIndex', otherIndex);
              var otherPrevious = otherFeature.geometry.coordinates[otherIndex - 1];

              if (this.pointCache.location(thisPrevious) === this.pointCache.location(otherPrevious)) {
                console.log('       ', `previous point on ${f.properties.name} intersects with ${otherPrevious.feature.properties.name}`);
                return;
              }
            });
          }

        });

        console.log('isNode', point.isNode);
        console.log(point);
      }
    });

    function isLineString(feature) {
      return Array.isArray(feature.geometry.coordinates[0]);
    }
  }




  identifyEdges() {

  }







  route(from, to) {

  }










}


function roundCoordinatePair(cp, precision) {
  return cp.map(c => round(c, precision));
}

function round(float, precision=defaultRoundingPrecision) {
  return parseFloat(float.toFixed(precision));
  //return float.toFixed(precision);
}
