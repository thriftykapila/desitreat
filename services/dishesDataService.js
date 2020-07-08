const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const { resolve } = require("bluebird");
dishRouter.use(bodyParser.json());

module.exports.dishesData = () => {
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

module.exports.createDishes = () => {
  return new Promise((resolve, reject) => {
    Dishes.create(req.body)
      .then((dish) => {
        resolve(dish);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.deleteDishes = () => {
  return new Promise((resolve, reject) => {
    Dishes.remove({})
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
