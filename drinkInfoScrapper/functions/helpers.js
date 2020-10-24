const fs = require('fs/promises');
const path = require('path');
const Papa = require('papaparse');


const parseString = (rawData) => {
  return;
}

const formatFlavors = (rawData, modifier) => {
  const flavorArr = JSON.parse(Papa.parse(rawData).data[0][18]);
  modifier(flavorArr);
}

/**
 *
 * @param {string} rawData | string from csv file
 * @param {object} store | stores all flavor data, gets mutated if new flavor is found
 */
exports.extractIngredient = (rawData, store) => {
  // const flavorArr = JSON.parse(parseString(rawData)[18]);
  // flavorArr.forEach((obj) => {
  //   const flavor = obj.sku.slice(8, 20);
  //   if (store[flavor] === undefined) {
  //     store[flavor] = 1;
  //   }
  // });
  formatFlavors(rawData, (flavorArr) => {
    flavorArr.forEach((obj) => {
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

exports.generateDrinkObj = (rawData, store) => {
  const parsedStr = parseString(rawData);
  var sku = parsedStr[0];
  var metaData = {
    name: parsedStr[1],
    ingredients: flavorArr
  }

}

exports.generateDrinkCSV = (drinkData, ingredientsObj, name) => {

}