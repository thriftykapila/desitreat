const Dishes = require("../models/dishes");

const dishesData = () => {
  return new Promise((resolve, reject) => {
    Dishes.find({})
      .then((dishes) => {
        // console.log(dishes);
        resolve(dishes);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = dishesData;
