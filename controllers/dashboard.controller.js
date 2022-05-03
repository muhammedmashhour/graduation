const getDashboard = (req, res) => {
  res.render("pages/dashboard", {
    page_name: "dashboard",
    successMsg: req.flash('successMsg')
  });
};

module.exports = {
  getDashboard
}