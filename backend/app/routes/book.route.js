const express = require("express");
const books = require("@/controllers/book.controller");

const router = express.Router();

router.route("/genres").get(books.getGenres);
router.route("/newest").get(books.getNewestBooks);
router.route("/random").get(books.getRandomBooks);
router.route("/").get(books.findAll);
router.route("/:id").get(books.findOne);

module.exports = router;
