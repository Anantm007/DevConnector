//jshint esversion: 8

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts
// @desc     Get all post
// @access   Private
router.get("/", auth, async(req, res) => {

  try
  {
      const posts = await Post.find().sort({ date: -1});
      res.json(posts);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get a specific post
// @access   Private
router.get("/:id", auth, async(req, res) => {
  try
  {
      const post = await Post.findById(req.params.id);

      if(!post)
      return res.status(404).json({msg: "Post not found"});

      res.json(post);
  }

  catch (err) {
    // Invalid object id type
    if(err.kind === "ObjectId")
    return res.status(404).json({msg: "Post not found"});

    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    DELETE api/post/id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async(req, res) => {

  try
  {
      const post = await Post.findById(req.params.id);
      // Check that user who owns the post deletes the post
      if(post.user.toString() !== req.user.id)
      return res.status(401).json({msg: "No authorisation"});

      // Post not found
      if(!post)
      return res.status(404).json({msg: "Post not found"});

      // Delete
      await post.remove();
      res.json("post removed");
  }

  catch (err) {


      // Invalid object id type
    if(err.kind === "ObjectId")
    return res.status(404).json({msg: "Post not found"});

    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private

router.put("/like/:id", auth, async(req, res) => {

  try
  {
    const post = await Post.findById(req.params.id);

    // Check if post has already been liked by the user
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0)
    {
      return res.status(400).json({msg: "Post already liked"});
    }

    post.likes.unshift({user: req.user.id});

    await post.save();

    res.json(post.likes);
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});



// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private

router.put("/unlike/:id", auth, async(req, res) => {

  try
  {
    const post = await Post.findById(req.params.id);

    // Check if post has actually been liked by the user
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0)
    {
      return res.status(400).json({msg: "Post not liked yet"});
    }

    // Get remove index
    const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/posts/comment/:id/:comment_id
// @desc     Delete a comment on a post
// @access   Private

router.delete("/comment/:id/:comment_id", auth, async(req, res) =>
{
  try
  {
    const post = await Post.findById(req.params.id);

    // Pull out the comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    // If comment does not exist
    if(!comment)
    {
      res.status(404).json({msg: "Comment does not exist"});
    }

    // Check that the author is deleting the comment
    if(comment.user.toString() !== req.user.id)
    return res.status(401).json({msg: "User not authorised"});

    // Get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id));

    // Delete the comment
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});


module.exports = router;
