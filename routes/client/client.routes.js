const router = require("express").Router();

const {
  getHome,
  getAbout,
  getCategories,
  getBlogs,
  getContact
} = require("../../controllers/client/client.controller");



router.get(
  "/",
  getHome
);

router.get(
  "/about",
  getAbout
);

router.get(
  "/categories",
  getCategories
);

router.get(
  "/blogs",
  getBlogs
);

router.get(
  "/contact",
  getContact
);

module.exports = router;