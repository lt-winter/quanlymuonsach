const express = require("express");
const borrows = require("@/controllers/admin/borrow.controller");

const router = express.Router();

router.route("/")
  .get(borrows.findAll)
  .post(borrows.create)
  .delete(borrows.deleteAll);

router.route("/stats")
  .get(borrows.getStats);

router.route("/:id")
  .get(borrows.findOne)
  .put(borrows.update)
  .delete(borrows.delete);

router.route("/:id/return")
  .post(borrows.returnBook);

router.route("/:id/lost")
  .post(borrows.reportLost);

module.exports = router;
