<template>
  <div class="my-borrows-page">
    <h2 class="page-title mb-4">
      <i class="fas fa-clipboard-list"></i> Sách đã mượn
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="borrows.length === 0" class="text-center py-5">
        <div class="empty-state">
          <i class="fas fa-book-open"></i>
          <h4>Bạn chưa mượn sách nào</h4>
          <p class="text-muted">Hãy khám phá kho sách phong phú của chúng tôi</p>
          <router-link to="/books" class="btn btn-primary">
            <i class="fas fa-search"></i> Tìm sách để mượn
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="filter-bar mb-4">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group shadow-sm">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Tìm kiếm theo tên sách..."
                  v-model="searchQuery"
                />
              </div>
            </div>
            <div class="col-md-4">
              <select class="form-select shadow-sm" v-model="filterStatus">
                <option value="">Tất cả trạng thái</option>
                <option value="choDuyet">Chờ duyệt</option>
                <option value="dangMuon">Đang mượn</option>
                <option value="quaHan">Quá hạn</option>
                <option value="daTra">Đã trả</option>
                <option value="matSach">Mất sách</option>
              </select>
            </div>
          </div>
        </div>

        <div
          v-if="filteredBorrows.length === 0"
          class="text-center py-5 text-muted"
        >
          <i
            class="fas fa-search mb-3"
            style="font-size: 2rem; opacity: 0.5"
          ></i>
          <p>Không tìm thấy phiếu mượn nào phù hợp.</p>
        </div>

        <div v-else class="borrow-table-container">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên sách</th>
                  <th>Ngày mượn</th>
                  <th>Ngày trả dự kiến</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(borrow, index) in filteredBorrows"
                  :key="borrow._id || borrow.maMuon"
                  @click="goToDetail(borrow.maMuon)"
                  class="borrow-row"
                >
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="book-info">
                      <span v-if="borrow.sach" class="book-title">
                        {{ borrow.sach.tenSach }}
                      </span>
                      <span v-else class="text-muted">Không có thông tin sách</span>
                      <small v-if="borrow.sach?.tacGia" class="book-author">
                        <i class="fas fa-user"></i> {{ borrow.sach.tacGia }}
                      </small>
                    </div>
                  </td>
                  <td>{{ formatDate(borrow.ngayMuon) }}</td>
                  <td>
                    <span :class="{ 'text-danger': isOverdue(borrow) }">
                      {{ formatDate(borrow.ngayTraDuKien) }}
                    </span>
                  </td>
                  <td>
                    <span :class="getStatusClass(borrow)">
                      {{ getStatusText(borrow) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";

export default {
  data() {
    return {
      borrows: [],
      loading: false,
      searchQuery: "",
      filterStatus: "",
    };
  },
  computed: {
    filteredBorrows() {
      return this.borrows.filter((borrow) => {
        const bookTitle = borrow.sach?.tenSach?.toLowerCase() || "";
        const matchesSearch = bookTitle.includes(this.searchQuery.toLowerCase());

        let matchesFilter = true;
        if (this.filterStatus) {
          switch (this.filterStatus) {
            case "choDuyet":
              matchesFilter = borrow.trangThai === "choDuyet";
              break;
            case "dangMuon":
              matchesFilter =
                borrow.trangThai === "dangMuon" && !this.isOverdue(borrow);
              break;
            case "quaHan":
              matchesFilter =
                borrow.trangThai === "dangMuon" && this.isOverdue(borrow);
              break;
            case "daTra":
              matchesFilter = borrow.trangThai === "daTraSach";
              break;
            case "matSach":
              matchesFilter = borrow.trangThai === "matSach";
              break;
          }
        }

        return matchesSearch && matchesFilter;
      });
    },
  },
  methods: {
    async fetchBorrows() {
      this.loading = true;
      try {
        const data = await BorrowService.getMyBorrows();
        this.borrows = data;
      } catch (error) {
        console.error("Error fetching borrows:", error);
        if (error.response?.status === 401) {
          alert("Vui lòng đăng nhập để xem sách đã mượn");
          this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    isOverdue(borrow) {
      if (borrow.ngayTra) return false; // Đã trả rồi thì không quá hạn
      const now = new Date();
      const dueDate = new Date(borrow.ngayTraDuKien);
      return now > dueDate;
    },
    goToDetail(maMuon) {
      this.$router.push({ name: 'borrow.detail', params: { maMuon } });
    },
    getStatusText(borrow) {
      // Chờ duyệt
      if (borrow.trangThai === "choDuyet") {
        return "Chờ duyệt";
      }
      
      // Đang mượn
      if (borrow.trangThai === "dangMuon") {
        if (this.isOverdue(borrow)) {
          return "Quá hạn";
        }
        return "Đang mượn";
      }
      
      // Đã trả
      if (borrow.trangThai === "daTraSach") {
        return "Đã trả";
      }
      
      // Mất sách
      if (borrow.trangThai === "matSach") {
        return "Mất sách";
      }
      
      return "Không xác định";
    },
    getStatusClass(borrow) {
      if (borrow.trangThai === "daTraSach") {
        return "badge badge-success";
      }
      
      if (borrow.trangThai === "choDuyet") {
        return "badge badge-warning";
      }
      
      if (borrow.trangThai === "matSach") {
        return "badge badge-danger";
      }
      
      if (borrow.trangThai === "dangMuon") {
        if (this.isOverdue(borrow)) {
          return "badge badge-danger";
        }
        return "badge badge-info";
      }
      
      return "badge badge-secondary";
    },
  },
  mounted() {
    this.fetchBorrows();
  },
};
</script>

<style scoped>
.empty-state {
  padding: 60px 20px;
}

.empty-state i {
  font-size: 5rem;
  color: #e5e7eb;
  margin-bottom: 20px;
}

.empty-state h4 {
  color: #6b7280;
  margin-bottom: 10px;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-title {
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
}

.book-title:hover {
  color: var(--primary-color);
}

.book-author {
  color: #6b7280;
  font-size: 0.85rem;
}

.book-author i {
  font-size: 0.75rem;
}

.borrow-table-container {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

table thead tr {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

table thead th {
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding: 16px;
}

table tbody td {
  padding: 16px;
  vertical-align: middle;
}

.borrow-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.borrow-row:hover {
  background-color: #eff6ff !important;
  box-shadow: inset 0 0 20px rgba(67, 97, 238, 0.15);
}

.borrow-row:active {
  background-color: #dbeafe !important;
}

.badge {
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
