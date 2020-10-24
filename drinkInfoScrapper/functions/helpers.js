const fs = require('fs/promises');
const path = require('path');
const Papa = require('papaparse');

/**
 * Used as a higher order function to modify parsed csv string
 * @param {string} rawData | csv string you want to parse
 * @param {function} modifier | function to be used on parsed csv string
 */
const formatFlavors = (rawData, modifier) => {
  const flavorArr = Papa.parse(rawData).data[0];
  modifier(flavorArr);
}

/**
 *
 * @param {string} rawData | string from csv file
 * @param {object} store | stores all flavor data, gets mutated if new flavor is found
 */
exports.extractIngredient = (rawData, store) => {
  formatFlavors(rawData, (parsedStr) => {
    JSON.parse(parsedStr[18]).forEach((obj) => {
      const flavor = obj.sku.slice(8, 20);
      if (store[flavor] === undefined) {
        store[flavor] = 1;
      }
    });
  })
}


exports.createIngredientCSV = async (data, fileName) => {
  const flavors = Object.keys(data).sort().join(',');
  try {
    await fs.writeFile(path.resolve(__dirname, `../output/${fileName}.csv`), flavors);
    console.log('writing done!');
  } catch (err) {
    console.error('error found ', err.message);
  }
}

/**
 *
 * @param {string} rawData | string from csv file
 * @param {object} store | stores all drinks and their ingredient data
 */
exports.generateDrinkObj = (rawData, store) => {
  var sku;
  var metaData = {};
  formatFlavors(rawData, (parsedStr) => {
    sku = parsedStr[0];
    metaData.name = parsedStr[1];
    metaData.ingredients = parsedStr[18].map((obj) => {
      const flavor = obj.sku.slice(8, 20);
      return flavor;
    });
  });
  store[sku] = metaData;
}

exports.generateDrinkCSV = (drinkData, ingredientsObj, name) => {

}