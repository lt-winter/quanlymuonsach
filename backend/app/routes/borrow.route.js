const express = require("express");
const borrows = require("../controllers/borrow.controller");
const auth = require("@/middlewares/auth");

const router = express.Router();

// Tất cả routes đều yêu cầu auth (dành cho user đã đăng nhập)
router.use(auth);

// GET / - Lấy danh sách sách đã mượn của user hiện tại
router.get("/", borrows.getMyBorrows);

// POST /borrow - Đăng ký mượn sách (tạo phiếu chờ duyệt)
router.post("/", borrows.borrowBook);

// PUT /:maMuon/report-lost - Báo mất sách
router.put("/:maMuon/report-lost", borrows.reportLost);

module.exports = router;
