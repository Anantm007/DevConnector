//jshint esversion: 6

const express = require("express");
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public
router.get('/', function(req, res)
{
  res.send("Profile route");
});

module.exports = router;
