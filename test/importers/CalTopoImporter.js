import assert from 'assert';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import {importData} from '../../lib/importers/CalTopoImporter.js';
import calTopoData from '../data/calTopoData.json';


var data = importData(calTopoData);


describe('CalTopoImporter', () => {

  describe('data structure', () => {
    it("should have markers, trails, and groups", () => {
      assert(data.markers);
      assert(data.trails);
      assert(data.groups);
    });
  });


  describe('markers', () => {
    describe('FeatureCollection', () => {
      it("should exist", () => {
        assert(data.markers);
        assert(data.markers.type === 'FeatureCollection');
      });

      it("should have features", () => {
        assert(data.markers.features.length);
      });

      describe('first Feature', () => {
        var feature = data.markers.features[0];
        var lake = _.find(calTopoData.Marker, { label: 'Horseshoe Lake', folderId: 0 });

        it("should be a Feature", () => {
          assert.strictEqual(feature.type, 'Feature');
        });

        it("should be Horseshoe Lake", () => {
          assert.strictEqual(feature.geometry.type, 'Point');
          assert.strictEqual(feature.geometry.coordinates[0], lake.position.lng);
          assert.strictEqual(feature.geometry.coordinates[1], lake.position.lat);
          assert.strictEqual(feature.properties.name, lake.label);
          assert.strictEqual(feature.properties.id, '0');
        });

        it("should belong to the Water group", () => {
          assert.strictEqual(feature.properties.groupId, '0');
          assert.strictEqual(feature.properties.group.name, 'Water');
          assert.strictEqual(feature.properties.group.id, '0');
        });
      });
    });
  });

  describe('trails', () => {
    describe('FeatureCollection', () => {
      it("should exist", () => {
        assert(data.trails);
        assert(data.trails.type === 'FeatureCollection');
      });

      it("should have features", () => {
        assert(data.trails.features.length);
      });

      describe('first Feature', () => {
        var feature = data.trails.features[0];
        var trail = _.find(calTopoData.Shape, { label: 'Bear Creek Trail', folderId: 6 });

        it("should be a Feature", () => {
          assert.strictEqual(feature.type, 'Feature');
        });

        it("should be Bear Creek Trail", () => {
          assert.strictEqual(feature.geometry.type, 'LineString');
          assert.strictEqual(feature.geometry.coordinates[0][0], trail.way.coordinates[0][1]);
          assert.strictEqual(feature.geometry.coordinates[0][1], trail.way.coordinates[0][0]);
          assert.strictEqual(feature.properties.name, trail.label);
          assert.strictEqual(feature.properties.id, '7');
        });

        it("should belong to the Trails group", () => {
          assert.strictEqual(feature.properties.groupId, '6');
          assert.strictEqual(feature.properties.group.name, 'Trails');
          assert.strictEqual(feature.properties.group.id, '6');
        });
      });
    });
  });

});
