const express = require("express");
const router = express.Router();
const reportController = require("@/controllers/admin/report.controller");
const auth = require("@/middlewares/auth");
const superadmin = require("@/middlewares/superadmin");

// Áp dụng middleware xác thực cho tất cả routes
router.use(auth);
router.use(superadmin);

// Thống kê tổng quan
router.get("/overview", reportController.getOverviewStats);

// Top sách được mượn nhiều nhất
router.get("/top-books", reportController.getTopBorrowedBooks);

// Thống kê sách quá hạn/mất
router.get("/overdue-lost", reportController.getOverdueAndLostStats);

// Phân bố sách theo thể loại
router.get("/books-by-category", reportController.getBooksByCategory);

// Xu hướng mượn sách theo thời gian
router.get("/borrow-trend", reportController.getBorrowTrend);

// Top độc giả tích cực
router.get("/top-readers", reportController.getTopReaders);

// Thống kê doanh thu
router.get("/revenue", reportController.getRevenueStats);

module.exports = router;
