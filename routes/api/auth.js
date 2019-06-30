//jshint esversion: 6

const express = require("express");
const router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', function(req, res)
{
  res.send("auth route");
});

module.exports = router;
