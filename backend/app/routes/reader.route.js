const express = require("express");
const readers = require("@/controllers/reader.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

// Public routes
router.post("/login", readers.login);
router.post("/register", readers.register);

// Protected routes
router.get("/profile", auth, readers.getProfile);
router.put("/profile", auth, readers.updateProfile);

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
