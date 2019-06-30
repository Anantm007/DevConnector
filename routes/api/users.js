//jshint esversion: 6

const express = require("express");
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', function(req, res)
{
  res.send("User route");
});

module.exports = router;
