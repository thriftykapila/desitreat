const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
dotenv.config();
const url = process.env.URL;
const connect = mongoose.connect(url);
const leaderRouter = require("./Routes/leaderRouter");
const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const hostname = process.env.HOSTNAME;
const app = express();

const port = process.env.PORT;

mongoose.Promise = require("bluebird");

app.use(morgan("dev"));

app.use(bodyParser.json());

connect.then(
  (db) => {
    console.log(`Connected correctly to server at port ${port}`);
  },
  (err) => {
    console.log(err);
  }
);

app.use(cookieParser("12345-67890-09876-54321"));

function auth(req, res, next) {
  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
      return;
    }
    var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    var user = auth[0];
    var pass = auth[1];
    if (user == "admin" && pass == "password") {
      res.cookie("user", "admin", { signed: true });
      next(); // authorized
    } else {
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      next(err);
    }
  } else {
    if (req.signedCookies.user === "admin") {
      next();
    } else {
      var err = new Error("You are not authenticated!");
      err.status = 401;
      next(err);
    }
  }
}

app.use(auth);

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

// For any other url other than dishes, it will route it to here
app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><h1>This is an Express Server</h1></body></html>");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// const rect = require("./rectangle");
// function solveRect(l, b) {
//   console.log("Solving for rectangle with l = " + l + " and b = " + b);
//   rect(l, b, (err, rectangle) => {
//     if (err) {
//       console.log("ERROR: ", err.message);
//     } else {
//       console.log(
//         `The area of the rectangle of dimensions l = ${l} and b = ${b} is ${rectangle.area()}`
//       );
//       console.log(
//         `The area of the perimeter of dimensions l = ${l} and b = ${b} is ${rectangle.perimeter()}`
//       );
//     }
//   });
//   console.log("This statement after the call to rect()");
// }

// // solveRect(3, 4);
