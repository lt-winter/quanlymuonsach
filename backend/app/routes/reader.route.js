const express = require("express");
const readers = require("@/controllers/reader.controller");

const router = express.Router();

// Public routes
router.post("/login", readers.login);
router.post("/register", readers.register);

router
  .route("/")
  .get(readers.findAll)
  .post(readers.create)
  .delete(readers.deleteAll);

router
  .route("/:id")
  .get(readers.findOne)
  .put(readers.update)
  .patch(readers.delete);

module.exports = router;
