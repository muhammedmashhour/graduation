const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { isNotAuth } = require("../middlewares/protectRoutes/authProtect");
const { checkAuthPermission } = require("../middlewares/protectRoutes/checkPermission");

const {
  getUsers,
  getCreateUser,
  postCreateUser,
  getUpdateUser,
  postUpdateUser,
  getDeleteUser,
  postDeleteUser,
  getChangePassword,
  postChangePassword
} = require('../controllers/users.controller');

router.get(
  '/users',
  isNotAuth,
  checkAuthPermission('read_users'),
  getUsers
);

router.get(
  '/users/create',
  isNotAuth,
  checkAuthPermission('create_users'),
  getCreateUser
);

router.post(
  '/users/create',
  isNotAuth,
  checkAuthPermission('create_users'),
  check('first_name').not().isEmpty().withMessage("first name is required"),
  check('last_name').not().isEmpty().withMessage("last name is required"),
  check('username').not().isEmpty().withMessage("username is required"),
  check('email').isEmail().withMessage("valid email is required"),
  check('job').not().isEmpty().withMessage("job is required"),
  check('role_id').not().isEmpty().withMessage("role is required"),
  check('password').isLength({min: 6}).withMessage("password must be at leat 6 charachters"),
  check('confirm_password').isLength({min: 6}).withMessage("confirm password must be at leat 6 charachters"),
  postCreateUser
);

router.get(
  '/users/:userId/update',
  isNotAuth,
  checkAuthPermission('update_users'),
  getUpdateUser
);

router.post(
  '/users/:userId/update',
  isNotAuth,
  checkAuthPermission('update_users'),
  check('first_name').not().isEmpty().withMessage("first name is required"),
  check('last_name').not().isEmpty().withMessage("last name is required"),
  check('username').not().isEmpty().withMessage("username is required"),
  check('job').not().isEmpty().withMessage("job is required"),
  check('role_id').not().isEmpty().withMessage("role is required"),
  postUpdateUser
);

router.get(
  '/users/:userId/delete',
  isNotAuth,
  checkAuthPermission('delete_users'),
  getDeleteUser
);

router.post(
  '/users/:userId/delete',
  isNotAuth,
  checkAuthPermission('delete_users'),
  postDeleteUser
);

router.get(
  '/users/:userId/change_password',
  isNotAuth,
  checkAuthPermission('update_users'),
  getChangePassword
);

router.post(
  '/users/:userId/change_password',
  isNotAuth,
  checkAuthPermission('update_users'),
  check('new_password').isLength({min: 6}).withMessage("new password must be at least 6 charachters"),
  check('confirm_new_password').isLength({min: 6}).withMessage("confirm new password must be at least 6 charachters"),
  postChangePassword
);

module.exports = router;