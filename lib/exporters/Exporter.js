import fs from 'fs';
import path from 'path';


export default class Exporter {

  constructor(mapData) {
    this.mapData = mapData;
    this.data = this.exportData(mapData);
  }

  exportData() {
    throw new Error('Method not implemented');
    return {
      swag: 'all day'
    };
  }

  exportDataToFile(file) {
    var data = JSON.stringify(this.data, null, 2);


    console.log('wtffffffff');
    console.log(data);

    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

}
