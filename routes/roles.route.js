const express = require("express");
const router = express.Router();
const check = require("express-validator").check;

const { isNotAuth } = require("../middlewares/protectRoutes/authProtect");
const { checkAuthPermission } = require("../middlewares/protectRoutes/checkPermission");


const {
  getRoles,
  getCreateRole,
  postCreateRole,
  getUpdateRole,
  postUpdateRole,
  getDeleteRole,
  postDeleteRole
} = require('../controllers/roles.controller');

router.get(
  '/roles',
  isNotAuth,
  checkAuthPermission('read_roles'),
  getRoles
);

router.get(
  '/roles/create',
  isNotAuth,
  checkAuthPermission('create_roles'),
  getCreateRole
);

router.post(
  '/roles/create',
  isNotAuth,
  checkAuthPermission('create_roles'),
  check("name").not().isEmpty().withMessage("name is required"),
  postCreateRole
);

router.get(
  '/roles/:roleId/update',
  isNotAuth,
  checkAuthPermission('update_roles'),
  getUpdateRole
);

router.post(
  '/roles/:roleId/update',
  isNotAuth,
  checkAuthPermission('update_roles'),
  check("name").not().isEmpty().withMessage("name is required"),
  postUpdateRole
);

router.get(
  '/roles/:roleId/delete',
  isNotAuth,
  checkAuthPermission('delete_roles'),
  getDeleteRole
);

router.post(
  '/roles/:roleId/delete',
  isNotAuth,
  checkAuthPermission('delete_roles'),
  postDeleteRole
);

module.exports = router;