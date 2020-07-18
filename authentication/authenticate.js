function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    const err = new Error("You are not authenticated here!");
    err.status = 403;
    return next(err);
  } else {
    if (req.session.user === "authenticated") {
      next();
    } else {
      const err = new Error(
        "Authenticated Error : user stored in session is different"
      );
      err.status = 403;
      return next(err);
    }
  }
}

module.exports = auth;
