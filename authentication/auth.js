const auth = (req, res, next) => {
  console.log("user details", req.user);

  if (!req.user) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    next(err);
  } else {
    next();
  }
};

module.exports = auth;
