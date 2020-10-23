const { parseFile } = require('/functions/scrapDrinks.js');
const { extractIngredient, createIngredientCSV } = require('/functions/helpers.js');

parseFile('ingredients', extractIngredient, createIngredientCSV);