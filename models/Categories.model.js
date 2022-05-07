const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String
  }
}, { timestamps: true });


const Categories = mongoose.model('categories', CategoriesSchema);

module.exports = Categories