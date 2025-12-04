import createApiClient from "./api.service";

class ReportService {
  constructor(baseUrl = "/api/admin/reports") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy thống kê tổng quan
  async getOverviewStats(startDate = null, endDate = null) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return (await this.api.get("/overview", { params })).data;
  }

  // Top sách được mượn nhiều nhất
  async getTopBorrowedBooks(startDate = null, endDate = null, limit = 5) {
    const params = { limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return (await this.api.get("/top-books", { params })).data;
  }

  // Thống kê sách quá hạn/mất
  async getOverdueAndLostStats(startDate = null, endDate = null) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return (await this.api.get("/overdue-lost", { params })).data;
  }

  // Phân bố sách theo thể loại
  async getBooksByCategory() {
    return (await this.api.get("/books-by-category")).data;
  }

  // Xu hướng mượn sách
  async getBorrowTrend(period = "day", startDate = null, endDate = null) {
    const params = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return (await this.api.get("/borrow-trend", { params })).data;
  }

  // Top độc giả tích cực
  async getTopReaders(startDate = null, endDate = null, limit = 10) {
    const params = { limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return (await this.api.get("/top-readers", { params })).data;
  }

  // Thống kê doanh thu
  async getRevenueStats(startDate = null, endDate = null) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return (await this.api.get("/revenue", { params })).data;
  }
}

export default new ReportService();
