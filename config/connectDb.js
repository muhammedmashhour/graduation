const mongoose = require("mongoose");
require("dotenv").config();
const DB_HOST = process.env.DB_HOST;

module.exports = mongoose.connect(
  DB_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
  err ? console.log(err) : '';
  console.log("DB HOST CONNECTED!");
})