import assert from 'assert';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import {importData} from '../../lib/importers/CalTopoImporter.js';
import calTopoData from '../data/calTopoData.json';
import GeoJsonExporter from '../../lib/exporters/GeoJsonExporter.js';


var mapData = importData(calTopoData);
var exporter = new GeoJsonExporter(mapData);
var data = exporter.exportData(mapData);


describe('GeoJsonExporter', () => {

  describe('data structure', () => {
    it("should be a FeatureCollection", () => {
      assert(data.type === 'FeatureCollection');
    });

    it("should have Features", () => {
      assert(data.features.length);
    });

    it("should have Horseshoe Lake", () => {
      var lake = _.find(data.features, (f) => {
        var p = f.properties;
        return p.name === 'Horseshoe Lake' && p.id === '0';
      });
      assert.strictEqual(lake.type, 'Feature');
      assert.strictEqual(lake.geometry.type, 'Point');
      assert(lake.geometry.coordinates[0]);
      assert(lake.geometry.coordinates[1]);
      assert.strictEqual(lake.properties.groupId, '0');
      assert.strictEqual(lake.properties.group.name, 'Water');
      assert.strictEqual(lake.properties.group.id, '0');
    });
  });

});
