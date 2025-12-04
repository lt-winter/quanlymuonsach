<template>
  <div class="borrow-detail-page">
    <div class="page-header">
      <router-link :to="{ name: 'my-borrows' }" class="back-btn">
        <i class="fas fa-arrow-left"></i> Quay lại
      </router-link>
      <h2 class="page-title">
        <i class="fas fa-file-contract"></i> Chi tiết phiếu mượn
      </h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="borrow" class="borrow-detail-container">
      <!-- Thông tin sách -->
      <div class="card card-book-info">
        <div class="card-body">
          <div class="book-header">
            <div class="book-image" v-if="borrow.sach?.anhBia">
              <img :src="borrow.sach.anhBia" :alt="borrow.sach?.tenSach" />
            </div>
            <div v-else class="book-image-placeholder">
              <i class="fas fa-book"></i>
            </div>
            <div class="book-details">
              <div class="status-badge">
                <span :class="getStatusClass(borrow)">{{ getStatusText(borrow) }}</span>
              </div>
              <h3 class="book-title" v-if="borrow.sach">{{ borrow.sach.tenSach }}</h3>
              <p class="book-meta" v-if="borrow.sach?.tacGia">
                <i class="fas fa-user"></i> {{ borrow.sach.tacGia }}
              </p>
              <p class="book-meta" v-if="borrow.sach?.nhaXuatBan">
                <i class="fas fa-building"></i> {{ borrow.sach.nhaXuatBan }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin phiếu mượn -->
      <div class="card card-borrow-info">
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <label>Mã phiếu</label>
              <p>{{ borrow.maMuon }}</p>
            </div>
            <div class="info-item">
              <label>Ngày mượn</label>
              <p>{{ formatDate(borrow.ngayMuon) }}</p>
            </div>
            <div class="info-item">
              <label>Hạn trả</label>
              <p :class="{ 'text-danger': isOverdue(borrow) }">
                {{ formatDate(borrow.ngayTraDuKien) }}
              </p>
            </div>
            <div class="info-item" v-if="borrow.ngayTra">
              <label>Ngày trả</label>
              <p>{{ formatDate(borrow.ngayTra) }}</p>
            </div>
            <div class="info-item" v-if="borrow.tienPhat > 0">
              <label>Tiền phạt</label>
              <p class="text-danger"><strong>{{ formatCurrency(borrow.tienPhat) }}</strong></p>
            </div>
            <div class="info-item" v-if="borrow.tienBoiThuong > 0">
              <label>Bồi thường</label>
              <p class="text-danger"><strong>{{ formatCurrency(borrow.tienBoiThuong) }}</strong></p>
            </div>
          </div>

          <!-- Cảnh báo -->
          <div v-if="isOverdue(borrow) && borrow.trangThai === 'dangMuon'" class="alert alert-warning mt-3">
            <i class="fas fa-exclamation-triangle"></i> Sách đã quá hạn! Vui lòng trả sớm.
          </div>
          <div v-if="borrow.trangThai === 'matSach'" class="alert alert-danger mt-3">
            <i class="fas fa-times-circle"></i> Sách đã báo mất. Liên hệ thư viện để xử lý.
          </div>
        </div>
      </div>

      <!-- Thao tác -->
      <div v-if="canReportLost()" class="card card-actions">
        <div class="card-body">
          <button
            @click="reportLost"
            class="btn btn-warning w-100"
            :disabled="reportingLost"
          >
            <i class="fas fa-exclamation-triangle"></i>
            {{ reportingLost ? "Đang xử lý..." : "Báo mất sách" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h4>Không tìm thấy phiếu mượn</h4>
        <router-link :to="{ name: 'my-borrows' }" class="btn btn-primary mt-3">
          Quay lại danh sách
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";

export default {
  props: {
    maMuon: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      borrow: null,
      loading: false,
      reportingLost: false,
    };
  },
  methods: {
    async fetchBorrow() {
      this.loading = true;
      try {
        const borrows = await BorrowService.getMyBorrows();
        this.borrow = borrows.find((b) => b.maMuon === this.maMuon);
        if (!this.borrow) {
          console.warn("Không tìm thấy phiếu mượn");
        }
      } catch (error) {
        console.error("Error fetching borrow:", error);
        if (error.response?.status === 401) {
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
    formatCurrency(value) {
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
    isOverdue(borrow) {
      if (borrow.ngayTra) return false;
      const now = new Date();
      const dueDate = new Date(borrow.ngayTraDuKien);
      return now > dueDate;
    },
    getStatusText(borrow) {
      if (borrow.trangThai === "choDuyet") {
        return "Chờ duyệt";
      }

      if (borrow.trangThai === "dangMuon") {
        if (this.isOverdue(borrow)) {
          return "Quá hạn";
        }
        return "Đang mượn";
      }

      if (borrow.trangThai === "daTraSach") {
        return "Đã trả";
      }

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
    canReportLost() {
      return this.borrow?.trangThai === "dangMuon";
    },
    async reportLost() {
      if (
        !confirm(
          `Bạn có chắc chắn muốn báo mất sách "${this.borrow.sach?.tenSach}"?`
        )
      ) {
        return;
      }

      this.reportingLost = true;
      try {
        await BorrowService.reportLost(this.borrow.maMuon);
        alert("Báo mất sách thành công. Vui lòng liên hệ thư viện để xử lý.");
        await this.fetchBorrow();
      } catch (error) {
        console.error("Error reporting lost:", error);
        alert(error.response?.data?.message || "Lỗi khi báo mất sách");
      } finally {
        this.reportingLost = false;
      }
    },
  },
  mounted() {
    this.fetchBorrow();
  },
};
</script>

<style scoped>
.borrow-detail-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.back-btn:hover {
  transform: translateX(-2px);
  box-shadow: 0 2px 8px rgba(67, 97, 238, 0.3);
  color: white;
}

.page-title {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
  font-size: 1.1rem;
}

.borrow-detail-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 768px) {
  .borrow-detail-container {
    flex-direction: row;
    align-items: flex-start;
  }

  .card-book-info {
    flex: 0 0 300px;
  }

  .card-borrow-info {
    flex: 1;
  }
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  background: white;
}

.card-body {
  padding: 12px;
}

/* Book Info */
.book-header {
  display: flex;
  gap: 12px;
}

@media (min-width: 768px) {
  .book-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .book-details {
    align-items: center;
  }
}

.book-image {
  flex-shrink: 0;
}

.book-image img {
  width: 80px;
  height: 110px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-image-placeholder {
  width: 80px;
  height: 110px;
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #9ca3af;
}

.book-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
}

.status-badge {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.book-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.book-meta {
  margin: 0;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
}

.book-meta i {
  color: #4361ee;
  width: 12px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.info-item {
  padding: 8px 10px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #4361ee;
}

.info-item label {
  display: block;
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.info-item p {
  font-size: 0.9rem;
  color: #1f2937;
  margin: 0;
  font-weight: 500;
}

/* Alerts */
.alert {
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  border: none;
  font-size: 0.9rem;
}

.alert i {
  font-size: 0.9rem;
  margin-top: 0;
  flex-shrink: 0;
}

.alert-warning {
  background: #fef3c7;
  color: #92400e;
}

.alert-danger {
  background: #fee2e2;
  color: #7f1d1d;
}

/* Actions */
.card-actions {
  margin-top: 10px;
}

.card-actions .btn {
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Empty State */
.empty-state {
  padding: 40px 20px;
}

.empty-state i {
  font-size: 3rem;
  color: #e5e7eb;
  margin-bottom: 15px;
}

.empty-state h4 {
  color: #6b7280;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 480px) {
  .page-header {
    flex-direction: row;
    align-items: center;
  }

  .book-header {
    flex-direction: row;
    text-align: left;
  }
  
  .book-details {
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .page-title {
    font-size: 1rem;
  }
}
</style>
