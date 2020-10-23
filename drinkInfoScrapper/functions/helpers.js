const fs = require('fs/promises');
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


exports.createIngredientCSV = async (data, fileName) => {
  const flavors = Object.keys(data).sort((a, b) => a > b).join(',');
  try {
    const writer = await fs.createWriteStream(path.resolve(__dirname, `../output/${filename}.csv`));
    console.log('writer created!')
  } catch (err) {
    console.error('error found ', err.message);
  }

  try {
    await writer.write(flavors);
    writer.on('close', () => {
      console.log('finished!');
      writer.end();
    })
  }

}
