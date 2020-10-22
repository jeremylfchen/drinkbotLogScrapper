const fs = require('fs');
const path = require('path');

/**
 *
 * @param {string} rawData | string from csv file
 * @param {object} store | stores all flavor data, gets mutated if new flavor is found
 */
exports.extractIngredient = (rawData, store) => {
  const flavorArr = JSON.stringify(rawData.split(',')[18]);
  flavorArr.forEach((obj) => {
    const flavor = obj.sku.slice(8, 20);
    if (store[flavor] === undefined) {
      store[flavor] = 1;
    }
  });
}


exports.createIngredientCSV = (data, fileName) => {
  const flavors = Object.keys(data);
}
