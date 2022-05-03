const express = require("express");
const router = express.Router();

const { isNotAuth } = require("../middlewares/protectRoutes/authProtect");

const { getDashboard } = require("../controllers/dashboard.controller");


router.get(
  "/",
  isNotAuth,
  getDashboard
);

module.exports = router;