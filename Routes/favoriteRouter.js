const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favourites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favourites) => {
          if (favourites) {
            user_favourites = favourites.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
            if (!user_favourites) {
              var err = new Error("You have no favourites!");
              err.status = 404;
              return next(err);
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user_favourites);
          } else {
            var err = new Error("There are no favourites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then((favourites) => {
        var user;
        if (favourites)
          user = favourites.filter(
            (fav) => fav.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new Favourites({ user: req.user.id });
        for (let i of req.body) {
          if (
            user.dishes.find((d_id) => {
              if (d_id._id) {
                return d_id._id.toString() === i._id.toString();
              }
            })
          )
            continue;
          user.dishes.push(i._id);
        }
        user
          .save()
          .then(
            (userFavs) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(userFavs);
              console.log("Favourite Added");
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /favorite");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorites.remove({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favourites) => {
          if (favourites) {
            const favs = favourites.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
            const dish = favs.dishes.filter(
              (dish) => dish.id === req.params.dishId
            )[0];
            if (dish) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            } else {
              var err = new Error("You do not have dish " + req.params.dishId);
              err.status = 404;
              return next(err);
            }
          } else {
            var err = new Error("You do not have any favourites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then((favourites) => {
        var user;
        if (favourites)
          user = favourites.filter(
            (fav) => fav.user._id.toString() === req.user.id.toString()
          )[0];
        if (!user) user = new Favourites({ user: req.user.id });
        if (
          !user.dishes.find((d_id) => {
            if (d_id._id)
              return d_id._id.toString() === req.params.dishId.toString();
          })
        )
          user.dishes.push(req.params.dishId);
        user
          .save()
          .then(
            (userFavs) => {
              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.json(userFavs);
              console.log("Favourites Created");
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /favourites/:dishId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
      .populate("user")
      .populate("dishes")
      .then(
        (favourites) => {
          var user;
          if (favourites)
            user = favourites.filter(
              (fav) => fav.user._id.toString() === req.user.id.toString()
            )[0];
          if (user) {
            user.dishes = user.dishes.filter(
              (dishid) => dishid._id.toString() !== req.params.dishId
            );
            user.save().then(
              (result) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(result);
              },
              (err) => next(err)
            );
          } else {
            var err = new Error("You do not have any favourites");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
