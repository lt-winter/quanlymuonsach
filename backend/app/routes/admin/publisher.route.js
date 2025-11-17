const express = require("express");
const publishers = require("@/controllers/admin/publisher.controller");

const router = express.Router();

router
  .route("/")
  .get(publishers.findAll)
  .post(publishers.create)
  .delete(publishers.deleteAll);

router
  .route("/:id")
  .get(publishers.findOne)
  .put(publishers.update)
  .patch(publishers.delete);

module.exports = router;
