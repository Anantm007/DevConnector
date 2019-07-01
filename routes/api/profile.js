//jshint esversion: 8

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const { check, validationResult} = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private (auth as second parameter(middleware) )
router.get("/me", auth, async(req, res) => {
  try
  {
      // Grtting user's prodile
      const profile = await Profile.findOne({ user: req.user.id}).populate("user", ["name", "avatar"]);

      if(!profile)
      return res.status(400).json({msg: "No profile found for this user"});

      // Send back the profile
      res.json(profile);
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }

});


// @route   GET api/profile
// @desc    Create or update user Profile
// @access  Private (auth as second parameter)

router.post("/", [auth,[
  check("status", "Status is required").not().isEmpty(),
  check("skills", "Skills is required").not().isEmpty()
] ],

  async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) //  Errors are there
    {
      return res.status(400).json({errors: errors.array() });
    }

    // Destructuring elements
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;


    if(company)
    profileFields.company = company;

    if(website)
    profileFields.website = website;

    if(location)
    profileFields.location = location;

    if(bio)
    profileFields.bio = bio;

    if(status)
    profileFields.status = status;

    if(githubusername)
    profileFields.githubusername = githubusername;

    if(skills)
    {
        profileFields.skills = skills.
                               split(",") // It turns a list to an array
                               .map(skill => skill.trim()); // we need to be independent of number of spaces in the list
    }

    // Build Social Media accounts object
    profileFields.social = {};
      if(youtube)
      profileFields.social.youtube = youtube;

      if(facebook)
      profileFields.social.facebook = facebook;

      if(twitter)
      profileFields.social.twitter = twitter;

      if(instagram)
      profileFields.social.instagram = instagram;

      if(linkedin)
      profileFields.social.linkedin = linkedin;


      // We are now ready to update data
      try
      {
        let profile = await Profile.findOne({ user: req.user.id});

        if(profile)
        {
          // Update
          profile = await Profile.findOneAndUpdate({ user: req.user.id},
            {$set: profileFields}, {new: true}
          );

        return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();

        res.json(profile);
       }

      catch(err)
      {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
});


// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get("/", async(req, res) => {

  try
  {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles); //  Return all the profiles
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", async(req, res) => {

  try
  {
    const profile = await Profile.findOne({user: req.params.user_id}).populate("user", ["name", "avatar"]);

    if(!profile)
    return res.status(400).json({msg: "No profile for this user"});

    res.json(profile);
  }

  catch(err)
  {
    console.log(err.message);

    if(err.kind === 'ObjectID')
    return res.status(400).json({msg: "No profile for this user"});

    res.status(500).send("Server Error");
  }
});

// @route   Delete api/profile
// @desc    Delete profile, user and post
// @access  Private

router.delete("/", auth, async (req, res) => {

  try
  {
      // Remove profile
     await Profile.findOneAndRemove({ user: req.user.id});

     // Remove user
     await User.findOneAndRemove({ _id: req.user.id});

     res.json({msg: "User deleted"});
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put("/experience", [auth, [
  check("title", "title is required").not().isEmpty(),
  check("company", "company is required").not().isEmpty(),
  check("from", "from date is required").not().isEmpty()

] ],

async (req, res) => {

  const errors = validationResult(req);

  if(!errors.isEmpty())
  return res.status(400).json({ errors: errors.array()});

  // Destructuring
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;


  // Create new experience
  const newExp = {
    title,  // Same as title: title(of line 240)
    company,
    location,
    from,
    to,
    current,
    description
  };

  // MongoDB dealing
  try {
    const profile = await Profile.findOne({user: req.user.id});

    profile.experience.unshift(newExp); // push() appends but unshift() adds at the beginning


  await profile.save();
  res.json(profile);

}
  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }

});


// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete profile experience
//@access  Private

router.delete("/experience/:exp_id", auth,
  async (req,res) => {
    try
    {
      const profile = await Profile.findOne({user: req.user.id});

      // Get remove index
      const removeIndex = profile.experience.map(item => item.id)
      .indexOf(req.params.exp_id);

      // Deleting or splicing or taking out from experience array
      profile.experience.splice(removeIndex, 1);

      await profile.save();

      res.json(profile);
    }

    catch(err)
    {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
});

module.exports = router;
