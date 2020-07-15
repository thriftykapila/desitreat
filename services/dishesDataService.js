const express = require("express");
const bodyParser = require("body-parser");
const Dishes = require("../models/dishes");

module.exports = {
  dishesData: function () {
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
  },
  createDishes: function () {
    return new Promise((resolve, reject) => {
      Dishes.create(req.body)
        .then((dish) => {
          resolve(dish);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteDishes: async function () {
    try {
      return await Dishes.remove({});
    } catch (error) {
      console.log(error);
    }
  },
};
