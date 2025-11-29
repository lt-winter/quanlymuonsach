const express = require("express");
const borrows = require("@/controllers/admin/borrow.controller");

const router = express.Router();

router.route("/")
  .get(borrows.findAll)
  .post(borrows.create)
  .delete(borrows.deleteAll);

router.route("/stats")
  .get(borrows.getStats);

router.route("/pending")
  .get(borrows.findPending);

router.route("/:id")
  .get(borrows.findOne)
  .put(borrows.update)
  .delete(borrows.delete);

router.route("/:id/return")
  .post(borrows.returnBook);

router.route("/:id/lost")
  .post(borrows.reportLost);

router.route("/:id/approve")
  .post(borrows.approve);

router.route("/:id/reject")
  .post(borrows.reject);

module.exports = router;
