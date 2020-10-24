const { generateIngredients } = require('./functions/scrapDrinks.js');
const { extractIngredient, createIngredientCSV } = require('./functions/helpers.js');

generateIngredients('ingredients', extractIngredient, createIngredientCSV);