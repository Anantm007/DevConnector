//jshint esversion: 6

const express = require('express');

const app = express();

app.get('/', function(req, res)
{
    res.send("API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function()
{
  console.log("Server running on port " + PORT);
});
