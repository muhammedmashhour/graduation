const router = require("express").Router();

const {
  getHome,
  getAbout,
  getCategories,
  getBooks,
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
  "/books",
  getBooks
);

router.get(
  "/contact",
  getContact
);

module.exports = router;