const express = require("express");
const router = express.Router();

const { isNotAuth, isAuth } = require("../middlewares/protectRoutes/authProtect");

const {
  getAuth,
  postAuth,
  logout
} = require("../controllers/auth.controller");

router.get(
  "/login",
  isAuth,
  getAuth
);

router.post(
  "/login",
  isAuth,
  postAuth
);

router.all(
  '/logout',
  isNotAuth,
  logout
)

module.exports = router;