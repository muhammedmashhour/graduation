const Categories = require("../models/Categories.model");
const validationResult = require("express-validator").validationResult;
const permissions = require("../utilities/permissions");


const getCategories = async (req, res) => {
  const categories = await Categories.find();
  res.render("pages/categories", {
    page_name: "categories",
    successMsg: req.flash("successMsg"),
    categories
  })
};

const getCreateCategory = (req, res) => {
  res.render("pages/categories/create", {
    page_name: "categories",
    permissions,
    validationErrors: req.flash("validationErrors")
  })
};

const postCreateCategory = (req, res) => {

  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect('/admin/categories/create');
  }

  const newRecord = new Categories(req.body)
  newRecord.save()
  .then(response => {
    req.flash('successMsg', `${res.lingua.content.general.item_created}`);
    res.redirect('/admin/categories');
  })
  .catch(err => {
    res.end("there is an error");
  })
};

const getUpdateCategory = async (req, res) => {
  try {
    const category = await Categories.findOne({_id: req.params.categoryId});
    res.render("pages/categories/update", {
      page_name: "categories",
      category,
      permissions,
      validationErrors: req.flash("validationErrors")
    });
  } catch(e) {
    res.end("something went wrong!");
  }
};

const postUpdateCategory = (req, res) => {

  // handle validation errors if exists
  if (!validationResult(req).isEmpty()) {
    req.flash("validationErrors", validationResult(req).array());
    return res.redirect(`/admin/categories/${req.params.categoryId}/update`);
  }


  Categories.findByIdAndUpdate(
    req.params.categoryId,
    {
      updated_at: Date.now(),
      ...req.body
    }
  )
  .then(category => {

    if (req.session.user.category === category.name) return res.redirect('/logout');

    req.flash("successMsg", `${res.lingua.content.general.item_updated}`);
    res.redirect("/admin/categories");
  })
  .catch(err => {
    res.end("something went wrong");
  })
};

const getDeleteCategory = (req, res) => {
  res.render("pages/categories/delete", {
    page_name: "categories",
  });
};

const postDeleteCategory = async (req, res) => {
  try {
    const category = await Categories.findOne({_id: req.params.categoryId});
    category.delete()
    .then(_ => {
      req.flash("successMsg", `${res.lingua.content.general.item_deleted}`);
      res.redirect("/admin/categories");
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
  getCategories,
  getCreateCategory,
  postCreateCategory,
  getUpdateCategory,
  postUpdateCategory,
  getDeleteCategory,
  postDeleteCategory
}