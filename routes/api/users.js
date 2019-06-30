//jshint esversion: 8

const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require("config");
const { check, validationResult } = require('express-validator/');

const User = require("../../models/User");

// @route   GET api/users
// @desc    Register user
// @access  Public
router.post('/',
[
  // Checks on various fields
check('name', 'name is required')
  .not()
  .isEmpty(),

check('email', 'please enter a valid email')
  .isEmail(),

check('password', 'please enter a password with 6 or more characters')
.isLength({min: 6})
],

// async (like callback function)
async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }

  const {name, email, password} = req.body;

  try {

    // See if user exists
    let user = await User.findOne({ email});
    if(user)
    {
      return res.status(400).json({errors: [ {msg:"User already exists" } ] });
    }

    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: "200", //  Size
      r: "pg",  // rating
      d: "mm"   // default
    });

    // Create new instance of user
    user = new User({
      name,
      email,
      avatar,
      password
    });

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Saving user to the Database
    await user.save();

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
