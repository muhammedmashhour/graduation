const mongoose = require("mongoose");

const BooksSchema = mongoose.Schema({
  image: {
    type: String
  },
  name: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories'
  },
  description: {
    type: String
  },
  author: {
    type: String,
  },
  price: {
    type: String,
  },
  discount: {
    type: String,
  },
  isbn: {
    type: String,
  },
  colors: {
    type: String,
  },
  pages: {
    type: String,
  },
}, { timestamps: true });


const Books = mongoose.model('book', BooksSchema);

module.exports = Books