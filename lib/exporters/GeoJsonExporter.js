import Exporter from './Exporter.js';
import {jsonClone} from '../util.js';


export default class GeoJsonExporter extends Exporter {

  exportData(mapData) {
    var markers = jsonClone(mapData.markers);
    var trails = jsonClone(mapData.trails);
    markers.features = markers.features.concat(trails.features);
    return markers;
  }

}
