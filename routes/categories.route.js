const express = require("express");
const router = express.Router();
const check = require("express-validator").check;

const { isNotAuth } = require("../middlewares/protectRoutes/authProtect");
const { checkAuthPermission } = require("../middlewares/protectRoutes/checkPermission");


const {
  getCategories,
  getCreateCategory,
  postCreateCategory,
  getUpdateCategory,
  postUpdateCategory,
  getDeleteCategory,
  postDeleteCategory
} = require('../controllers/categories.controller');

router.get(
  '/categories',
  isNotAuth,
  checkAuthPermission('read_categories'),
  getCategories
);

router.get(
  '/categories/create',
  isNotAuth,
  checkAuthPermission('create_categories'),
  getCreateCategory
);

router.post(
  '/categories/create',
  isNotAuth,
  checkAuthPermission('create_categories'),
  check("name").not().isEmpty().withMessage("name is required"),
  postCreateCategory
);

router.get(
  '/categories/:categoryId/update',
  isNotAuth,
  checkAuthPermission('update_categories'),
  getUpdateCategory
);

router.post(
  '/categories/:categoryId/update',
  isNotAuth,
  checkAuthPermission('update_categories'),
  check("name").not().isEmpty().withMessage("name is required"),
  postUpdateCategory
);

router.get(
  '/categories/:categoryId/delete',
  isNotAuth,
  checkAuthPermission('delete_categories'),
  getDeleteCategory
);

router.post(
  '/categories/:categoryId/delete',
  isNotAuth,
  checkAuthPermission('delete_categories'),
  postDeleteCategory
);

module.exports = router;