const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const FacebookTokenStrategy = require("passport-facebook-token");
const secretKey = process.env.SECRET_KEY;
const config = require("../config");
// make passport use the static authentication fn of passport-local-mongoose
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// make passport use the static  of serializeUser and deserializeUser passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_paylord, done) => {
    console.log("JWT payload: ", jwt_paylord);
    User.findOne({ _id: jwt_paylord._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = function (req, res, next) {
  if (req.user.admin) {
    next();
    return;
  } else {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user !== null) {
          return done(null, user);
        } else {
          user = new User({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.save((err, user) => {
            if (err) return done(err, false);
            else return done(null, user);
          });
        }
      });
    }
  )
);
