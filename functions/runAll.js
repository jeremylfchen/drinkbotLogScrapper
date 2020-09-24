const fs = require('fs');
const path = require('path');
const { parseFile } = require('./scrapDrinks.js');
const { serialNums } = require('../drinkbotData/serialNums.js');

exports.runAll = () => {
  fs.readdir(path.resolve(__dirname, '../data'), (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((user) => {
        fs.readdir(path.resolve(__dirname, `../data/${user}`), (err, files) => {
          if (err) {
            console.error(err);
          } else {
            files.forEach((fileName) => {
              parseFile(user, fileName, serialNums[user]);
            })
          }
        });
      });
    }
  })
}