const fs = require('fs/promises');
const lineReader = require('line-reader');
const path = require('path');
const Promise = require('bluebird');
// const headers = 'sku,name,version,description,item_type,super_owner,creator,drink_type,drink_class,photo,country,process_order,blender,unit_cost_per_ml,invoice_price,status,fixed_level,default_volume,ingredient';

/**
 *
 * @param {*} name | name of file to be saved as
 * @param {*} processer | function to extract data from csv
 * @param {*} writer | writer function to make new csv
 */
exports.parseFile = async (name, processor, writer = (data, name) => { }) => {
  var files = [];
  var data = {};
  try {
    files = await fs.readdir(path.resolve(__dirname, '../data'), 'utf-8');
    var eachLine = Promise.promisify(lineReader.eachLine);
    await eachLine(path.resolve(__dirname, `../data/${files[1]}`), (line) => {
      processor(line, data);
    });
    writer(data, name);
  } catch (err) {
    console.error('error found: ', err.message);
  }
}