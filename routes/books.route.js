const express = require("express");
const router = express.Router();

const { isNotAuth } = require("../middlewares/protectRoutes/authProtect");
const { checkAuthPermission } = require("../middlewares/protectRoutes/checkPermission");

const uploadMedia = require("../middlewares/uploadMedia");


const {
  getBooks,
  getCreateBook,
  postCreateBook,
  getUpdateBook,
  postUpdateBook,
  getDeleteBook,
  postDeleteBook
} = require('../controllers/books.controller');

router.get(
  '/books',
  isNotAuth,
  checkAuthPermission('read_books'),
  getBooks
);

router.get(
  '/books/create',
  isNotAuth,
  checkAuthPermission('create_books'),
  getCreateBook
);

router.post(
  '/books/create',
  isNotAuth,
  checkAuthPermission('create_books'),
  uploadMedia("books").fields([
    { name: "image", maxCount: 1 }
  ]),
  postCreateBook
);

router.get(
  '/books/:bookId/update',
  isNotAuth,
  checkAuthPermission('update_books'),
  getUpdateBook
);

router.post(
  '/books/:bookId/update',
  isNotAuth,
  checkAuthPermission('update_books'),
  uploadMedia("books").fields([
    { name: "image", maxCount: 1 }
  ]),
  postUpdateBook
);

router.get(
  '/books/:bookId/delete',
  isNotAuth,
  checkAuthPermission('delete_books'),
  getDeleteBook
);

router.post(
  '/books/:bookId/delete',
  isNotAuth,
  checkAuthPermission('delete_books'),
  postDeleteBook
);

module.exports = router;