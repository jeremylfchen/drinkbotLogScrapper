const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { calculateVolume, formatEntry, formatIngredient } = require('./helpers.js');


exports.parseFile = (folderName, fileName, serial_num, date = false) => {
  let calibration = require(path.resolve(__dirname, `../drinkbotData/${folderName}/drinkbot_calibration_parameters.json`));
  let pumpAssignments = require(path.resolve(__dirname, `../drinkbotData/${folderName}/drinkbot_user_settings.json`)).pump_to_ingredient;
  let ingredientSkus = require(path.resolve(__dirname, `../drinkbotData/${folderName}/drinkbot_liquid_storage.json`));
  let drinkSkus = require(path.resolve(__dirname, `../drinkbotData/${folderName}/drinkbot_recipe.json`));

  var data = [];
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, `../data/${folderName}/${fileName}`)),
    // output: process.stdout,
    console: false
  });
  let ingredientsArr = [];
  let entry = {};
  let done = true;
  readInterface.on('line', (line) => {
    let dateFilter = date ? true : false;
    if (line.slice(0, 10) === date || !dateFilter) {
      if (line.slice(37, 42) === 'order') {
        let str = line.slice(46, line.length - 1).replace(/'/g, '\"');
        // console.log(str);
        entry = JSON.parse(str);
        entry.timestamp = line.slice(0, 19).split(' ').join('T') + '.000000-07:00';
        formatEntry(entry, folderName, serial_num, drinkSkus);
      } else if (line.includes('Start Serving')) {
        done = false;
      } else if (line.includes('Open') && !done) {

        ingredientsArr.push(formatIngredient(line, pumpAssignments, calibration, ingredientSkus));

      } else if (line.includes('Serving Complete') || line.includes('Serving Stopped')) {

        let totalVol = calculateVolume(ingredientsArr);

        if (line.includes('Serving Complete')) {
          entry.need_to_be_charged = true;
          entry.action = 'order';
        } else {
          entry.need_to_be_charged = false;
          if (line.includes('Dispensing Warning')) {
            entry.action = 'Dispensing Warning';
          } else {
            entry.action = 'canceled (dispensing)';
          }
        }

        entry.amount = totalVol;
        done = true;
        entry.ingredient_usage = ingredientsArr;
        ingredientsArr = [];
        data.push(entry);
        entry = {};
      }
    }
  })
    .on('close', () => {
      console.log(data.length);
      readInterface.close();
      readInterface.removeAllListeners();
      //const writeStream = fs.createWriteStream(path.resolve(__dirname, `output/${fileName}-output.json`));
      if (!fs.existsSync(path.resolve(__dirname, `../output/${folderName}`))) {
        fs.mkdirSync(path.resolve(__dirname, `../output/${folderName}`));
      }
      fs.writeFile(path.resolve(__dirname, `../output/${folderName}/${fileName}-output.json`),
        JSON.stringify({ data }, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
          console.log('done');
          // writeStream.end();
        });
    });

}

let a = {'drink_name': 'Hibiscus Lemonade', 'customize_level': 100, 'cup_size': 355, 'abv': 0, 'image_url': 'https://botrista-image.s3.amazonaws.com/drinks/98-Hibi_Lemn-2.png', 'q_level': {'level': 100, 'name': 'regular'}, 'q_size': {'size': 355, 'name': '355', 'MSRP': 4, 'invoice_price': 1.5, 'nutrition_fact': {'calories': {'value': 81.65000000000002, 'daily': 'None'}, 'total_fat_g': {'value': 0, 'daily': 0}, 'sarutrated_fat_g': {'value': 0, 'daily': 0}, 'trans_fat_g': {'value': 0, 'daily': 'None'}, 'cholesterol_mg': {'value': 0, 'daily': 0}, 'sodium_mg': {'value': 11.5375, 'daily': 0.005016304347826087}, 'total_carbohydrate_g': {'value': 20.412500000000005, 'daily': 0.07422727272727274}, 'dietary_fiber_g': {'value': 0, 'daily': 0}, 'total_sugars_g': {'value': 19.88, 'daily': 'None'}, 'includes_g_added_sugars': {'value': 19.17, 'daily': 0.3834}, 'protein_g': {'value': 0, 'daily': 'None'}, 'vitamin_d_mcg': {'value': 0, 'daily': 0}, 'calcium_mg': {'value': 4.615, 'daily': 0.00355}, 'iron_mg': {'value': 8.9389, 'daily': 0.4966055555555556}, 'potassium_mg': {'value': 14.200000000000001, 'daily': 0.0030212765957446813}}}, 'customize_name': '', 'order_id': 1}

