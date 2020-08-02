const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const url = process.env.URL;
const connect = mongoose.connect(url);
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
// const auth = require("./authentication/auth");
const userRouter = require("./Routes/userRouter");
const leaderRouter = require("./Routes/leaderRouter");
const dishRouter = require("./Routes/dishRouter");
const promoRouter = require("./Routes/promoRouter");
const uploadRouter = require("./Routes/uploadRouter");
var favoriteRouter = require("./routes/favoriteRouter");
const passport = require("passport");
const authenticate = require("./authentication/authenticate");
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
secPort = parseInt(port) + 443;

// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const User = require("./models/users");

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// Secure traffic only
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});
connect.then(
  (db) => {
    console.log(`Connected correctly to server at port ${secPort}`);
  },
  (err) => {
    console.log(err);
  }
);

app.use(
  session({
    name: "session-id",
    secret: secretKey,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

// app.use(auth);

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favourites", favoriteRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send(
      `Error : ${err.message} in ${req.method} ${req.protocol}://${hostname}:${port}${req.originalUrl}`
    );
});

app.get("/index", function (req, res) {
  res.sendFile("index.html", { root: __dirname + "/public" });
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

// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

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

module.exports = app;
