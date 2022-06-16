const jwt = require("jsonwebtoken");
const config = require("config");
// const dotenv = require('dotenv')
// dotenv.config();
const jwtSecret = config.get("jwtSecret");

module.exports = function (req, res, next) {
  // Get Token from Header
  const token = req.header("x-auth-token");
  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token ,Authorization Denied " });
  }
  // Verify token
  try {
    var decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid " });
  }
};
