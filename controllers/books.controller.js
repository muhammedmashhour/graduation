const Books = require("../models/Books.model");
const Categories = require("../models/Categories.model");
const validationResult = require("express-validator").validationResult;

const { uploadMedia, editMedia } = require("../utilities/uploadSingleMedia");


const getBooks = async (req, res) => {
  const books = await Books.find().populate({path: 'category', model: 'categories'});
  res.render("pages/books", {
    page_name: "books",
    successMsg: req.flash("successMsg"),
    books
  })
};

const getCreateBook = async (req, res) => {
  const categories = await Categories.find();
  res.render("pages/books/create", {
    page_name: "books",
    categories,
    validationErrors: req.flash("validationErrors")
  })
};

const postCreateBook = (req, res) => {
  const newRecord = new Books({
    ...req.body,
    image: uploadMedia(req, "image")
  })
  newRecord.save()
  .then(response => {
    req.flash('successMsg', `${res.lingua.content.general.item_created}`);
    res.redirect('/admin/books');
  })
  .catch(err => {
    res.end("there is an error");
  })
};

const getUpdateBook = async (req, res) => {
  try {
    const book = await Books.findOne({_id: req.params.bookId});
    const categories = await Categories.find();
    res.render("pages/books/update", {
      page_name: "books",
      book,
      categories,
      validationErrors: req.flash("validationErrors")
    });
  } catch(e) {
    res.end("something went wrong!");
  }
};

const postUpdateBook = (req, res) => {

  Books.findByIdAndUpdate(
    req.params.bookId,
    {
      ...req.body,
      image: editMedia(req, "image", "edited_image")
    }
  )
  .then(book => {

    req.flash("successMsg", `${res.lingua.content.general.item_updated}`);
    res.redirect("/admin/books");
  })
  .catch(err => {
    res.end("something went wrong");
  })
};

const getDeleteBook = (req, res) => {
  res.render("pages/books/delete", {
    page_name: "books",
  });
};

const postDeleteBook = async (req, res) => {
  try {
    const book = await Books.findOne({_id: req.params.bookId});
    book.delete()
    .then(_ => {
      req.flash("successMsg", `${res.lingua.content.general.item_deleted}`);
      res.redirect("/admin/books");
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
  getBooks,
  getCreateBook,
  postCreateBook,
  getUpdateBook,
  postUpdateBook,
  getDeleteBook,
  postDeleteBook
}