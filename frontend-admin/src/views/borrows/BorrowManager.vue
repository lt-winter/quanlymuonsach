<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-book-reader"></i>
          Quản lý Mượn sách
        </h2>
        <p class="page-subtitle">Theo dõi tình trạng mượn trả sách</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ stats.total || 0 }}</span>
          <span class="stat-label">Tổng</span>
        </div>
        <div class="stat-item borrowing">
          <span class="stat-number">{{ stats.dangMuon || 0 }}</span>
          <span class="stat-label">Đang mượn</span>
        </div>
        <div class="stat-item overdue">
          <span class="stat-number">{{ stats.quaHan || 0 }}</span>
          <span class="stat-label">Quá hạn</span>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <InputSearch
          v-model="searchText"
          placeholder="Tìm theo tên độc giả hoặc sách..."
        />
      </div>
      <div class="toolbar-right">
        <div class="filter-controls">
          <CustomSelect
            v-model="filterStatus"
            :options="filterOptions"
            placeholder="Lọc trạng thái"
          />
        </div>
        <div class="action-buttons">
          <button class="action-btn refresh" @click="refreshList()">
            <i class="fas fa-redo"></i>
            Làm mới
          </button>
          <button class="action-btn add" @click="goToAddBorrow">
            <i class="fas fa-plus"></i>
            Tạo phiếu mượn
          </button>
          <button class="action-btn delete" @click="removeAllBorrows">
            <i class="fas fa-trash"></i>
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>

    <div class="content-area">
      <BorrowList
        v-if="filteredBorrows.length > 0"
        :borrows="filteredBorrows"
        @return="handleReturn"
        @lost="handleLost"
        @edit="goToEditBorrow"
      />
      <div v-else class="empty-state">
        <i class="fas fa-book-reader"></i>
        <h4>Không có phiếu mượn nào</h4>
        <p>Bấm "Tạo phiếu mượn" để bắt đầu</p>
      </div>
    </div>

    <!-- Return Modal -->
    <div v-if="showReturnModal" class="modal-overlay" @click.self="closeReturnModal">
      <div class="modal-content">
        <h3>Trả sách</h3>
        <p>Xác nhận trả sách: <strong>{{ selectedBorrow?.sach?.tenSach }}</strong></p>
        <div class="form-group">
          <label>Ngày trả</label>
          <DatePicker v-model="returnDate" placeholder="Chọn ngày trả..." />
        </div>
        <div v-if="lateFee > 0" class="fee-warning">
          <i class="fas fa-exclamation-triangle"></i>
          Trả quá hạn {{ daysLate }} ngày - Phạt: {{ formatCurrency(lateFee) }}
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeReturnModal">Hủy</button>
          <button class="btn btn-success" @click="confirmReturn">Xác nhận trả</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import BorrowList from "@/components/borrows/BorrowList.vue";
import DatePicker from "@/components/DatePicker.vue";
import BorrowService from "@/services/borrow.service";

export default {
  components: {
    InputSearch,
    CustomSelect,
    BorrowList,
    DatePicker,
  },
  data() {
    return {
      borrows: [],
      stats: {},
      searchText: "",
      filterStatus: "",
      filterOptions: [
        { value: "", label: "Tất cả" },
        { value: "dangMuon", label: "Đang mượn" },
        { value: "quaHan", label: "Quá hạn" },
        { value: "daTra", label: "Đã trả" },
        { value: "matSach", label: "Mất sách" },
      ],
      showReturnModal: false,
      selectedBorrow: null,
      returnDate: new Date().toISOString().split("T")[0],
    };
  },
  computed: {
    filteredBorrows() {
      let result = this.borrows;

      // Filter by status
      if (this.filterStatus) {
        if (this.filterStatus === "quaHan") {
          result = result.filter((b) => {
            if (b.trangThai !== "dangMuon") return false;
            const hanTra = new Date(b.hanTra);
            return new Date() > hanTra;
          });
        } else {
          result = result.filter((b) => b.trangThai === this.filterStatus);
        }
      }

      // Filter by search text
      if (this.searchText) {
        const search = this.searchText.toLowerCase();
        result = result.filter((b) => {
          const readerName = `${b.docGia?.hoLot || ""} ${b.docGia?.ten || ""}`.toLowerCase();
          const bookName = (b.sach?.tenSach || "").toLowerCase();
          return readerName.includes(search) || bookName.includes(search);
        });
      }

      return result;
    },
    daysLate() {
      if (!this.selectedBorrow || !this.returnDate) return 0;
      const hanTra = new Date(this.selectedBorrow.hanTra);
      const ngayTra = new Date(this.returnDate);
      if (ngayTra <= hanTra) return 0;
      return Math.ceil((ngayTra - hanTra) / (1000 * 60 * 60 * 24));
    },
    lateFee() {
      return this.daysLate * 5000; // 5000đ/ngày
    },
  },
  methods: {
    async retrieveBorrows() {
      try {
        this.borrows = await BorrowService.getAll();
        this.stats = await BorrowService.getStats();
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
      }
    },
    refreshList() {
      this.retrieveBorrows();
    },
    goToAddBorrow() {
      this.$router.push({ name: "borrows.add" });
    },
    goToEditBorrow(borrow) {
      this.$router.push({ name: "borrows.edit", params: { id: borrow.maMuon } });
    },
    handleReturn(borrow) {
      this.selectedBorrow = borrow;
      this.returnDate = new Date().toISOString().split("T")[0];
      this.showReturnModal = true;
    },
    closeReturnModal() {
      this.showReturnModal = false;
      this.selectedBorrow = null;
    },
    async confirmReturn() {
      try {
        await BorrowService.returnBook(this.selectedBorrow.maMuon, this.returnDate);
        this.closeReturnModal();
        this.refreshList();
      } catch (error) {
        console.error("Lỗi khi trả sách:", error);
        alert("Có lỗi xảy ra khi trả sách");
      }
    },
    async handleLost(borrow) {
      if (confirm(`Xác nhận báo mất sách "${borrow.sach?.tenSach}"?\nBồi thường: ${this.formatCurrency(borrow.sach?.donGia || 0)}`)) {
        try {
          await BorrowService.reportLost(borrow.maMuon);
          this.refreshList();
        } catch (error) {
          console.error("Lỗi khi báo mất:", error);
          alert("Có lỗi xảy ra khi báo mất sách");
        }
      }
    },
    async removeAllBorrows() {
      if (confirm("Bạn có chắc muốn xóa tất cả phiếu mượn?")) {
        try {
          await BorrowService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.error("Lỗi khi xóa:", error);
        }
      }
    },
    formatCurrency(amount) {
      if (!amount) return "0đ";
      return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  max-width: 1400px;
}

.page-header {
  background: linear-gradient(135deg, #7209b7, #a855f7);
  border-radius: 16px;
  padding: 20px 28px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title i {
  background: rgba(255, 255, 255, 0.2);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1rem;
}

.page-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 0.85rem;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 18px;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-item.borrowing {
  background: rgba(59, 130, 246, 0.3);
}

.stat-item.overdue {
  background: rgba(239, 68, 68, 0.3);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.toolbar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  position: sticky;
  top: 80px;
  z-index: 100;
}

.toolbar-left {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.refresh {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.refresh:hover {
  background: #e5e7eb;
}

.action-btn.add {
  background: linear-gradient(135deg, #06d6a0, #05b384);
  color: white;
}

.action-btn.add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 214, 160, 0.4);
}

.action-btn.delete {
  background: linear-gradient(135deg, #ef476f, #dc3856);
  color: white;
}

.action-btn.delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 71, 111, 0.4);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-state h4 {
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
}

.modal-content .form-group {
  margin-bottom: 16px;
}

.modal-content .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.modal-content .form-control {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
}

.fee-warning {
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-success {
  background: linear-gradient(135deg, #06d6a0, #05b384);
  color: white;
}
</style>
