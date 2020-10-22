const fs = require('fs');
const readline = require('readline');
const path = require('path');


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
      // fs.writeFile(path.resolve(__dirname, `../ output / ${name} - output.json`),
      //   JSON.stringify({ data }, null, 2),
      //   (err) => {
      //     if (err) {
      //       console.error(err);
      //     }
      //     console.log('done');
      //     // writeStream.end();
      //   });
    });

}