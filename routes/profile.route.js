const express = require("express");
const router = express.Router();

const { isNotAuth } = require("../middlewares/protectRoutes/authProtect");

const {
  getProfile,
  getUpdatePassword,
  postUpdatePassword,
  getUpdateInfo,
  postUpdateInfo
} = require('../controllers/profile.controller');


router.get(
  '/profile',
  isNotAuth,
  getProfile
);

router.get(
  '/profile/update_password',
  isNotAuth,
  getUpdatePassword
);

router.post(
  '/profile/update_password',
  isNotAuth,
  postUpdatePassword
);

router.get(
  '/profile/update_information',
  isNotAuth,
  getUpdateInfo
);

router.post(
  '/profile/update_information',
  isNotAuth,
  postUpdateInfo
);


module.exports = router;