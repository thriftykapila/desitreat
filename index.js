const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
dotenv.config();
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const url = process.env.URL;
const connect = mongoose.connect(url);
const hostname = process.env.HOSTNAME;
const app = express();
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const auth = require("./authentication/authenticate");
const userRouter = require("./Routes/userRouter");
const leaderRouter = require("./Routes/leaderRouter");
const dishRouter = require("./Routes/dishRouter");
const promoRouter = require("./Routes/promoRouter");
mongoose.Promise = require("bluebird");

app.use(
  session({
    name: "session-id",
    secret: secretKey,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

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

// app.use(cookieParser(secretKey));

app.use("/indexPage", (req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(
    "<html><body><h1>This is Homepage and is accessible to all</h1></body></html>"
  );
});
app.use("/users", userRouter);

app.use(auth);

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send(
      `Error : ${err.message} in ${req.method} ${req.protocol}://${hostname}:${port}${req.originalUrl}`
    );
});

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(
    "<html><body><h1>This is an Express Server</h1><h1>This comes in the last</h1></body></html>"
  );
});

// For any other url other than dishes, it will route it to here

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
