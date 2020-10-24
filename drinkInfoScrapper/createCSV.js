const { generateCSV } = require('./functions/scrapDrinks.js');
const { generateDrinkObj, generateDrinkCSV } = require('./functions/helpers.js');

generateCSV('ingredients', generateDrinkObj, generateDrinkCSV);