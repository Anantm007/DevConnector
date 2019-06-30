//jshint esversion: 6

const express = require("express");
const router = express.Router();

// @route   GET api/posts
// @desc    Test route
// @access  Public
router.get('/', function(req, res)
{
  res.send("Posts route");
});

module.exports = router;
