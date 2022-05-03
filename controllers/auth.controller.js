const Users = require("../models/Users.model.js");
const Roles = require("../models/Roles.model");
const bcrypt = require("bcrypt");

const getAuth = (req, res) => {
  res.render("pages/auth", {
    validationErrors: req.flash("validationErrors")
  });
};

const postAuth = async (req, res) => {
  const user = await Users.findOne({email: req.body.email.toLowerCase()});
  if (!user) {
    req.flash("validationErrors", [{"msg": "invalid data"}]);
    return res.redirect("/login");
  }
  await bcrypt.compare(req.body.password, user.password).then(async (result) => {
    if (!result) {
      req.flash("validationErrors", [{"msg": "invalid data"}])
      return res.redirect("/login");
    }
      
    const role = await Roles.findOne({_id: user.role_id});

    req.session.user = {
      userId: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
      job: user.job,
      avatar: user.avatar,
      role: role.name,
      permissions: role.permissions
    }
    res.redirect('/')
  })
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = {
  getAuth,
  postAuth,
  logout
}