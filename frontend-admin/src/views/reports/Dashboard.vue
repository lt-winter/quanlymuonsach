<template>
  <div class="dashboard-page">
    <div class="container-fluid py-4">
      <h1 class="mb-4">
        <i class="fas fa-chart-line"></i> Báo cáo và Thống kê
      </h1>

      <!-- Date Range Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row align-items-end">
            <div class="col-md-3">
              <label class="form-label">Từ ngày</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.startDate"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Đến ngày</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.endDate"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Chu kỳ biểu đồ</label>
              <select class="form-select" v-model="filters.period">
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
            </div>
            <div class="col-md-3">
              <button class="btn btn-primary me-2" @click="loadAllData">
                <i class="fas fa-sync-alt"></i> Tải lại
              </button>
              <button class="btn btn-secondary" @click="resetFilters">
                <i class="fas fa-times"></i> Xóa lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Overview Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-book-reader stat-icon text-primary"></i>
              <h3 class="stat-number">{{ overview.tongLuotMuon }}</h3>
              <p class="stat-label">Tổng lượt mượn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-hourglass-half stat-icon text-warning"></i>
              <h3 class="stat-number">{{ overview.dangMuon }}</h3>
              <p class="stat-label">Đang mượn</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-users stat-icon text-success"></i>
              <h3 class="stat-number">{{ overview.tongDocGia }}</h3>
              <p class="stat-label">Tổng độc giả</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-book stat-icon text-info"></i>
              <h3 class="stat-number">{{ overview.tongSach }}</h3>
              <p class="stat-label">Tổng đầu sách</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-check-circle stat-icon text-success"></i>
              <h3 class="stat-number">{{ overview.daTraSach }}</h3>
              <p class="stat-label">Đã trả sách</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-exclamation-circle stat-icon text-danger"></i>
              <h3 class="stat-number">{{ overview.sachMat }}</h3>
              <p class="stat-label">Sách mất</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-money-bill-wave stat-icon text-warning"></i>
              <h3 class="stat-number">
                {{ formatCurrency(overview.tongTienPhat) }}
              </h3>
              <p class="stat-label">Tổng tiền bồi thường</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card card text-center">
            <div class="card-body">
              <i class="fas fa-dollar-sign stat-icon text-success"></i>
              <h3 class="stat-number">
                {{ formatCurrency(revenue.tongDoanhThu) }}
              </h3>
              <p class="stat-label">Tổng tiền phạt</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row mb-4">
        <!-- Borrow Trend Chart -->
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-chart-line"></i> Xu hướng mượn sách</h5>
            </div>
            <div class="card-body">
              <Line :data="borrowTrendData" :options="lineChartOptions" />
            </div>
          </div>
        </div>

        <!-- Books by Category Chart -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-chart-pie"></i> Phân bố theo thể loại</h5>
            </div>
            <div class="card-body">
              <Pie :data="categoryData" :options="pieChartOptions" />
            </div>
          </div>
        </div>
      </div>

      <!-- Top Books Table -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h5>
                <i class="fas fa-trophy"></i> Top 5 sách được mượn nhiều nhất
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã sách</th>
                      <th>Tên sách</th>
                      <th>Tác giả</th>
                      <th>Số lượt mượn</th>
                      <th>Số quyển hiện tại</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(book, index) in topBooks" :key="book._id">
                      <td>{{ index + 1 }}</td>
                      <td>{{ book.maSach }}</td>
                      <td>{{ book.tenSach }}</td>
                      <td>{{ book.tacGia }}</td>
                      <td>
                        <span class="badge bg-primary">{{
                          book.soLuotMuon
                        }}</span>
                      </td>
                      <td>{{ book.soQuyen }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Readers Table -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h5><i class="fas fa-star"></i> Top 10 độc giả tích cực</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã độc giả</th>
                      <th>Họ tên</th>
                      <th>Điện thoại</th>
                      <th>Số lượt mượn</th>
                      <th>Tổng tiền phạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(reader, index) in topReaders" :key="reader._id">
                      <td>{{ index + 1 }}</td>
                      <td>{{ reader.maDocGia }}</td>
                      <td>{{ reader.hoLot }} {{ reader.ten }}</td>
                      <td>{{ reader.dienThoai }}</td>
                      <td>
                        <span class="badge bg-success">{{
                          reader.soLuotMuon
                        }}</span>
                      </td>
                      <td>{{ formatCurrency(reader.tongTienPhat) }} VNĐ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue and Lost Books -->
      <div class="row mb-4">
        <!-- Overdue Books -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>
                <i class="fas fa-clock"></i> Sách quá hạn ({{
                  overdueAndLost.overdue.length
                }})
              </h5>
            </div>
            <div class="card-body">
              <div
                class="table-responsive"
                style="max-height: 400px; overflow-y: auto"
              >
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Mã mượn</th>
                      <th>Tên sách</th>
                      <th>Độc giả</th>
                      <th>Số ngày quá hạn</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in overdueAndLost.overdue" :key="item._id">
                      <td>{{ item.maMuon }}</td>
                      <td>{{ item.book?.tenSach || "N/A" }}</td>
                      <td>{{ item.reader?.hoLot }} {{ item.reader?.ten }}</td>
                      <td>
                        <span class="badge bg-danger"
                          >{{ item.soNgayQuaHan }} ngày</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Lost Books -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>
                <i class="fas fa-ban"></i> Sách mất ({{
                  overdueAndLost.lost.length
                }})
              </h5>
            </div>
            <div class="card-body">
              <div
                class="table-responsive"
                style="max-height: 400px; overflow-y: auto"
              >
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Mã mượn</th>
                      <th>Tên sách</th>
                      <th>Độc giả</th>
                      <th>Ngày mượn</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in overdueAndLost.lost" :key="item._id">
                      <td>{{ item.maMuon }}</td>
                      <td>{{ item.book?.tenSach || "N/A" }}</td>
                      <td>{{ item.reader?.hoLot }} {{ item.reader?.ten }}</td>
                      <td>{{ formatDate(item.ngayMuon) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Line, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import reportService from "@/services/report.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default {
  name: "Dashboard",
  components: {
    Line,
    Pie,
  },
  data() {
    return {
      filters: {
        startDate: null,
        endDate: null,
        period: "day",
      },
      overview: {
        tongLuotMuon: 0,
        dangMuon: 0,
        daTraSach: 0,
        sachMat: 0,
        tongTienPhat: 0,
        tongDocGia: 0,
        tongSach: 0,
      },
      topBooks: [],
      topReaders: [],
      overdueAndLost: {
        overdue: [],
        lost: [],
      },
      borrowTrend: [],
      categories: [],
      revenue: {
        tongTienPhat: 0,
        tongTienBoiThuong: 0,
        tongDoanhThu: 0,
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
          },
        },
      },
    };
  },
  computed: {
    borrowTrendData() {
      const labels = this.borrowTrend.map((item) => item._id);
      const data = this.borrowTrend.map((item) => item.soLuotMuon);

      return {
        labels,
        datasets: [
          {
            label: "Số lượt mượn",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            data,
            tension: 0.4,
          },
        ],
      };
    },
    categoryData() {
      // Sắp xếp và gộp các thể loại nhỏ
      let sortedCategories = [...this.categories].sort(
        (a, b) => b.soLuong - a.soLuong
      );

      // Lấy top 5 thể loại
      const topCategories = sortedCategories.slice(0, 5);
      const otherCategories = sortedCategories.slice(5);

      // Gộp phần còn lại vào "Khác"
      if (otherCategories.length > 0) {
        const otherCount = otherCategories.reduce(
          (sum, item) => sum + item.soLuong,
          0
        );
        topCategories.push({ _id: "Khác", soLuong: otherCount });
      }

      const labels = topCategories.map((item) => item._id || "Chưa phân loại");
      const data = topCategories.map((item) => item.soLuong);

      return {
        labels,
        datasets: [
          {
            label: "Số lượng sách",
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#C9CBCF", // Màu cho mục Khác
            ],
            data,
          },
        ],
      };
    },
  },
  methods: {
    async loadAllData() {
      try {
        const { startDate, endDate, period } = this.filters;

        // Load all data in parallel
        const [
          overviewRes,
          topBooksRes,
          topReadersRes,
          overdueRes,
          trendRes,
          categoriesRes,
          revenueRes,
        ] = await Promise.all([
          reportService.getOverviewStats(startDate, endDate),
          reportService.getTopBorrowedBooks(startDate, endDate, 5),
          reportService.getTopReaders(startDate, endDate, 10),
          reportService.getOverdueAndLostStats(startDate, endDate),
          reportService.getBorrowTrend(period, startDate, endDate),
          reportService.getBooksByCategory(),
          reportService.getRevenueStats(startDate, endDate),
        ]);

        this.overview = overviewRes;
        this.topBooks = topBooksRes;
        this.topReaders = topReadersRes;
        this.overdueAndLost = overdueRes;
        this.borrowTrend = trendRes;
        this.categories = categoriesRes;
        this.revenue = revenueRes;
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu báo cáo. Vui lòng thử lại!");
      }
    },
    resetFilters() {
      this.filters = {
        startDate: null,
        endDate: null,
        period: "day",
      };
      this.loadAllData();
    },
    formatCurrency(value) {
      if (!value) return "0";
      return new Intl.NumberFormat("vi-VN").format(value);
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    },
  },
  mounted() {
    this.loadAllData();
  },
};
</script>

<style scoped>
.dashboard-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.stat-label {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #fff;
  border-bottom: 2px solid #f8f9fa;
  font-weight: 600;
}

.table-responsive {
  border-radius: 0.25rem;
}

.badge {
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
}
</style>
