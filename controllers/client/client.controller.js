const getHome = (req, res) => {
  res.render("client/pages/home");
}

const getAbout = (req, res) => {
  res.render("client/pages/about");
}

const getCategories = (req, res) => {
  res.render("client/pages/categories");
}

const getBlogs = (req, res) => {
  res.render("client/pages/blogs");
}

const getContact = (req, res) => {
  res.render("client/pages/contact");
}

module.exports = {
  getHome,
  getAbout,
  getCategories,
  getBlogs,
  getContact
}