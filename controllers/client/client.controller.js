const Categories = require('../../models/Categories.model');

const getHome = async (req, res) => {
  const categories = await Categories.find().limit(9);
  res.render("client/pages/home", {
    categories
  });
}

const getAbout = (req, res) => {
  res.render("client/pages/about");
}

const getCategories = async (req, res) => {
  const categories = await Categories.find()
  res.render("client/pages/categories", {
    categories
  });
}

const getBooks = (req, res) => {
  res.render("client/pages/books");
}

const getContact = (req, res) => {
  res.render("client/pages/contact");
}

module.exports = {
  getHome,
  getAbout,
  getCategories,
  getBooks,
  getContact
}