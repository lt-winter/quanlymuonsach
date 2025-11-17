const express = require("express");
const books = require("@/controllers/admin/book.controller");

const router = express.Router();

router.route("/").get(books.findAll).post(books.create).delete(books.deleteAll);

router.route("/:id").get(books.findOne).put(books.update).patch(books.delete);

module.exports = router;
