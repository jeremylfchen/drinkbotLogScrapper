const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { calculateVolume, formatEntry, formatIngredient } = require('./helpers.js');


exports.parseFile = (folderName, fileName, serial_num, date = false) => {
  let calibration = require(path.resolve(__dirname, `../drinkbotDATA/${folderName}/drinkbot_calibration_parameters.json`));
  let pumpAssignments = require(path.resolve(__dirname, `../drinkbotDATA/${folderName}/drinkbot_user_settings.json`)).pump_to_ingredient;
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
        entry = JSON.parse(line.slice(46, line.length - 1));
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
      fs.appendFile(path.resolve(__dirname, `../output/${folderName}/${fileName}-output.json`),
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

