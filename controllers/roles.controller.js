const Roles = require("../models/Roles.model");
const validationResult = require("express-validator").validationResult;
const permissions = require("../utilities/permissions");


const getRoles = async (req, res) => {
  const roles = await Roles.find();
  res.render("pages/roles", {
    page_name: "roles",
    successMsg: req.flash("successMsg"),
    roles
  })
};

const getCreateRole = (req, res) => {
  res.render("pages/roles/create", {
    page_name: "roles",
    permissions,
    validationErrors: req.flash("validationErrors")
  })
};

const postCreateRole = (req, res) => {

  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect('/admin/roles/create');
  }

  const newRecord = new Roles(req.body)
  newRecord.save()
  .then(response => {
    req.flash('successMsg', `${res.lingua.content.general.item_created}`);
    res.redirect('/admin/roles');
  })
  .catch(err => {
    res.end("there is an error");
  })
};

const getUpdateRole = async (req, res) => {
  try {
    const role = await Roles.findOne({_id: req.params.roleId});
    res.render("pages/roles/update", {
      page_name: "roles",
      role,
      permissions,
      validationErrors: req.flash("validationErrors")
    });
  } catch(e) {
    res.end("something went wrong!");
  }
};

const postUpdateRole = (req, res) => {

  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect(`/admin/roles/${req.params.roleId}/update`);
  }


  Roles.findByIdAndUpdate(
    req.params.roleId,
    {
      updated_at: Date.now(),
      ...req.body
    }
  )
  .then(role => {

    if (req.session.user.role === role.name) return res.redirect('/logout');

    req.flash("successMsg", `${res.lingua.content.general.item_updated}`);
    res.redirect("/admin/roles");
  })
  .catch(err => {
    res.end("something went wrong");
  })
};

const getDeleteRole = (req, res) => {
  res.render("pages/roles/delete", {
    page_name: "roles",
  });
};

const postDeleteRole = async (req, res) => {
  try {
    const role = await Roles.findOne({_id: req.params.roleId});
    role.delete()
    .then(_ => {
      req.flash("successMsg", `${res.lingua.content.general.item_deleted}`);
      res.redirect("/admin/roles");
    })
    .catch(err => {
      res.end("something went wrong");
    })
  }
  catch(e) {
    res.end("something went wrong!");
  }
};


module.exports = {
  getRoles,
  getCreateRole,
  postCreateRole,
  getUpdateRole,
  postUpdateRole,
  getDeleteRole,
  postDeleteRole
}