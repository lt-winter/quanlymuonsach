const ReportService = require("@/services/admin/report.service");
const MongoDB = require("@/utils/mongodb.util");
const ApiError = require("@/api-error");

// Lấy thống kê tổng quan
exports.getOverviewStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const reportService = new ReportService(MongoDB.client);
    const stats = await reportService.getOverviewStats(startDate, endDate);
    return res.send(stats);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy thống kê tổng quan: ${error.message}`)
    );
  }
};

// Top sách được mượn nhiều nhất
exports.getTopBorrowedBooks = async (req, res, next) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const reportService = new ReportService(MongoDB.client);
    const books = await reportService.getTopBorrowedBooks(
      startDate,
      endDate,
      parseInt(limit) || 5
    );
    return res.send(books);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy top sách: ${error.message}`)
    );
  }
};

// Thống kê sách quá hạn/mất
exports.getOverdueAndLostStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const reportService = new ReportService(MongoDB.client);
    const stats = await reportService.getOverdueAndLostStats(startDate, endDate);
    return res.send(stats);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy thống kê quá hạn/mất: ${error.message}`)
    );
  }
};

// Phân bố sách theo thể loại
exports.getBooksByCategory = async (req, res, next) => {
  try {
    const reportService = new ReportService(MongoDB.client);
    const categories = await reportService.getBooksByCategory();
    return res.send(categories);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy phân bố thể loại: ${error.message}`)
    );
  }
};

// Biểu đồ xu hướng mượn sách
exports.getBorrowTrend = async (req, res, next) => {
  try {
    const { period, startDate, endDate } = req.query;
    const reportService = new ReportService(MongoDB.client);
    const trend = await reportService.getBorrowTrend(
      period || "day",
      startDate,
      endDate
    );
    return res.send(trend);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy xu hướng mượn sách: ${error.message}`)
    );
  }
};

// Top độc giả tích cực
exports.getTopReaders = async (req, res, next) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const reportService = new ReportService(MongoDB.client);
    const readers = await reportService.getTopReaders(
      startDate,
      endDate,
      parseInt(limit) || 10
    );
    return res.send(readers);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy top độc giả: ${error.message}`)
    );
  }
};

// Thống kê doanh thu từ phạt/bồi thường
exports.getRevenueStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const reportService = new ReportService(MongoDB.client);
    const revenue = await reportService.getRevenueStats(startDate, endDate);
    return res.send(revenue);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy thống kê doanh thu: ${error.message}`)
    );
  }
};
