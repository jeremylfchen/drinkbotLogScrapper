const fs = require('fs');
const util = require('util');
const readline = require('readline');
const path = require('path');


const getTime = (fileName, date) => {
  const writeStream = fs.createWriteStream(path.resolve(__dirname, `output/${fileName}-blackout.txt`));
  const readInterface = readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, `data/${fileName}.txt`)),
    // output: process.stdout,
    console: false
  });

  let prevTime = '';

  writeStream.write('Blackouts:\n');

  readInterface.on('line', (line) => {

    let timeStr = new Date(line.slice(0, 16).split(' ').join('T'));
    let time = timeStr.getTime();

    if (prevTime === '') {
      prevTime = timeStr;
    } else {
      let delta = (time - prevTime.getTime()) / 60000;
      if (delta > 3) {
        writeStream.write(`DELTA: ${delta}min FROM: ${prevTime} TO ${timeStr}\n`);
      }
      prevTime = timeStr;
    }

  })
    .on('close', () => {
    });

}

getTime('0921');