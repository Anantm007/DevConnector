  //jshint esversion: 8

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator/');
const jwt = require('jsonwebtoken');

const User = require("../../models/User");
// @route   GET api/auth
// @desc    Test route
// @access  Protected because we added auth as the second parameter
router.get('/', auth,

async(req, res) => {
  // To return user's data
  try
  {
    // We dont want to send back user's password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }

});


// @route   GET api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post('/',
[
  // Checks on various fields
check('email', 'please enter a valid email')
  .isEmail(),

check('password', 'password is required')
.exists()
],

// async (like callback function)
async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;

  try {

    // See if user exists
    let user = await User.findOne({ email});
    if(!user)
    {
      return res.status(400).json({errors: [ {msg:"Invalid credentials" } ] });
    }

    // Compare for username and password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
    {
      return res.status(400).json({errors: [ {msg:"Invalid credentials" } ] });
    }


    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id //  The user here is the user getting saved and id is mongoDB id
      }
    };

    jwt.sign(payload,
      config.get("jwtSecret"),
      //{expiresIn: 3600000},
      function(err, token)
      {
        if(err)
        throw(err);

        else
        res.json({token});
      }


    );

  }
  catch(err)
  {
    console.log(err.message);
    res.status(500).send("server error");
  }


});


module.exports = router;
