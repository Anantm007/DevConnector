//jshint esversion: 6

const jwt = require("jsonwebtoken");
const config = require("config");


// Middleware function
module.exports = function(req, res, next) {
    //  Get token from header
    const token = req.header("x-auth-token");

    // If no token
    if(!token)
    {
      return res.status(401).json({msg: "No token, authorisation denied"});
    }

    // Verify token
    try
    {
      const decoded = jwt.verify(token, config.get('jwtSecret'));

      req.user = decoded.user;
      next();
    }

    catch(err)
    {
      res.status(401).json({msg: "Token not valid"});
    }
};
