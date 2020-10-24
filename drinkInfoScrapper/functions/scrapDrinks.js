const fs = require('fs/promises');
const lineReader = require('line-reader');
const path = require('path');
const Promise = require('bluebird');

/**
 *
 * @param {*} name | name of file to be saved as
 * @param {*} processer | function to extract data from csv
 * @param {*} writer | writer function to make new csv
 */
exports.generateIngredients = async (name, processor, writer) => {
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

exports.generateCSV = async (name, processor, writer) => {
  var ingredientsObj = {};
  var ingredientsArr = [];
  var drinkData = {};
  //init sorted ingredients array
  try {
    var eachLine = Promise.promisify(lineReader.eachLine);
    await eachLine(path.resolve(__dirname, '../output/ingredients.csv'), (line) => {
      ingredientsArr = line.split(',');
      ingredientsArr.forEach((ingredient, idx) => {
        ingredientsObj[ingredient] = idx;
      });
    });
  } catch (err) {
    console.error('error found: ', err.message);
  }
  //create csv
  try {
    files = await fs.readdir(path.resolve(__dirname, '../data'), 'utf-8');
    var eachLine = Promise.promisify(lineReader.eachLine);
    await eachLine(path.resolve(__dirname, `../data/${files[1]}`), (line) => {
      processor(line, drinkData);
    });
    writer(drinkData, ingredientsObj, name);
  } catch (err) {
    console.error('error found: ', err.message);
  }
}