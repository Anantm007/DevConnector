//jshint esversion: 6

const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({extended: false})); //  Alternative to body parser

// GET request to the home route
app.get('/', function(req, res)
{
    res.send("API running");
});

// Define routes
app.use('/api/users', require("./routes/api/users"));
app.use('/api/auth', require("./routes/api/auth"));
app.use('/api/profile', require("./routes/api/profile"));
app.use('/api/posts', require("./routes/api/posts"));

// Listening to the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function()
{
  console.log("Server running on port " + PORT);
});
