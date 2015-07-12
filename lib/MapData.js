import request from 'request';
import _ from 'lodash';


export default class MapData {

  constructor({markers, trails, groups}) {
    this.markers = markers;
    this.trails = trails;
    this.groups = groups;

    this.associateGroups();
  }

  associateGroups() {
    var indexedGroups = _.indexBy(this.groups, 'id');

    this.allMarkers().forEach((marker) => {
      var groupId = marker.properties.groupId;
      marker.properties.group = indexedGroups[groupId];
    });
    this.allTrails().forEach((trail) => {
      var groupId = trail.properties.groupId;
      trail.properties.group = indexedGroups[groupId];
    });
  }

  allMarkers() {
    return this.markers.features;
  }

  allTrails() {
    return this.trails.features;
  }

  _round(float, precision=4) {
    return parseFloat(float).toFixed(precision);
  }

}
