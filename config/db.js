//jshint esversion: 8
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async() => {
  try {
    await mongoose.connect(db, {useNewUrlParser: true});

    console.log("MongoDB Connected");
  } catch(err) {
    console.log(err);
    process.exit(1);
  }

};

module.exports = connectDB;
