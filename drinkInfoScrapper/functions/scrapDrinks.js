const fs = require('fs');
const readline = require('readline');
const path = require('path');

const headers = 'sku,name,version,description,item_type,super_owner,creator,drink_type,drink_class,photo,country,process_order,blender,unit_cost_per_ml,invoice_price,status,fixed_level,default_volume,ingredient';

/**
 *
 * @param {*} name | name of file to be saved as
 * @param {*} processer | function to extract data from csv
 * @param {*} writer | writer function to make new csv
 */
exports.parseFile = (name, processer, writer) => {

  var fileName = fs.readdir(path.resolve(__dirname, '../data'), 'utf-8', (err, names) => {
    if (err) {
      console.error(err);
    }
    return names[0];
  });

  const writer = fs.createWriteStream(path.resolve(__dirname, `../output/${name}`));

  var data = [];
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, `../data/${fileName}`)),
    // output: process.stdout,
    console: false
  });

  readInterface.on('line', (line) => {
    processer(line);
  })
    .on('close', () => {
      readInterface.close();
      readInterface.removeAllListeners();
      writer(data, name);

    });

}