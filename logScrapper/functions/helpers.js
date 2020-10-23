const path = require('path');


exports.calculateVolume = (ingredients) => {
  let sum = 0;
  for (let i = 0; i < ingredients.length; i++) {
    sum += ingredients[i].volume;
  }
  return sum;
}

exports.formatEntry = (entry, user_name, serial_num, drinkSkus) => {
  entry.user_type = 'Staff';
  entry.user_name = user_name;
  entry.serial_num = serial_num;
  entry.ice_level = "N/A";
  entry.amount = entry.cup_size;
  entry.ingredient_usage = [];
  entry.alcohol_level = 0;
  entry.MSRP = 0;
  entry.sku = drinkSkus[entry.drink_name].sku;
  delete entry.abv;
  delete entry.image_url;
  delete entry.q_level;
  delete entry.q_size;
  delete entry.order_id;
  delete entry.customize_name;
  delete entry.cup_size;
}

exports.formatIngredient = (line, pumpAssignments, calibration, ingredientSkus) => {
  let result = {};
  let data = line.slice(37, line.length - 1).split(',');
  let vol = parseInt(data[2]);
  let pump = data[1].slice(2, 9);
  let num = data[1].slice(6, 9);

  result.pump = pump;
  result.ingredient_name = pumpAssignments[pump];
  result.volume = calibration[`flowmeter${num}`].ratio * vol;
  result.ingredient_sku = ingredientSkus[pump].current_sku;
  // console.log(result);
  return result;
}
