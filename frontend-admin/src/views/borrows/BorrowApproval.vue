<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-check-circle"></i>
          Duyệt phiếu mượn
        </h2>
        <p class="page-subtitle">Phê duyệt các yêu cầu mượn sách từ độc giả</p>
      </div>
      <div class="header-stats">
        <div class="stat-item pending">
          <span class="stat-number">{{ pendingCount || 0 }}</span>
          <span class="stat-label">Chờ duyệt</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ approvedCount || 0 }}</span>
          <span class="stat-label">Đã duyệt</span>
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
        <div class="action-buttons">
          <button class="action-btn refresh" @click="loadBorrows">
            <i class="fas fa-redo"></i>
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <div class="approval-container">
      <!-- Chờ duyệt -->
      <div class="approval-section">
        <h3 class="section-title">
          <i class="fas fa-clock"></i>
          Chờ duyệt
          <span class="badge">{{ pendingBorrows.length }}</span>
        </h3>
        <div v-if="pendingBorrows.length > 0" class="borrow-list">
          <div
            v-for="borrow in filteredPendingBorrows"
            :key="borrow._id"
            class="borrow-card pending"
          >
            <div class="card-header">
              <div class="reader-info">
                <h4 class="reader-name">
                  {{ borrow.docGia?.hoLot }} {{ borrow.docGia?.ten }}
                </h4>
                <span class="reader-id">{{ borrow.docGia?.maDocGia }}</span>
              </div>
              <span class="request-date">{{ formatDate(borrow.ngayMuon) }}</span>
            </div>
            <div class="card-body">
              <div class="book-info">
                <div class="book-cover">
                  <img
                    v-if="borrow.sach?.anhBia"
                    :src="borrow.sach.anhBia"
                    :alt="borrow.sach.tenSach"
                  />
                  <div v-else class="no-image">
                    <i class="fas fa-book"></i>
                  </div>
                </div>
                <div class="book-details">
                  <h5 class="book-title">{{ borrow.sach?.tenSach }}</h5>
                  <p class="book-author">{{ borrow.sach?.tacGia }}</p>
                  <p class="book-publisher">{{ borrow.sach?.nhaPhatHanh }}</p>
                  <div class="book-copies">
                    <span class="label">Bản sao còn:</span>
                    <span class="copies">{{ borrow.sach?.soQuyen }}</span>
                  </div>
                </div>
              </div>
              <div class="loan-info">
                <div class="info-item">
                  <span class="label">Hạn trả:</span>
                  <span class="value">{{ formatDate(borrow.hanTra) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Ngày tạo:</span>
                  <span class="value">{{
                    formatDateTime(borrow.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn btn-danger" @click="rejectBorrow(borrow._id)">
                <i class="fas fa-times"></i>
                Từ chối
              </button>
              <button
                class="btn btn-success"
                @click="approveBorrow(borrow._id)"
                :disabled="isApproving"
              >
                <i class="fas fa-check"></i>
                {{ isApproving ? "Đang xử lý..." : "Duyệt" }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="fas fa-check-double"></i>
          <p>Không có phiếu chờ duyệt</p>
        </div>
      </div>

      <!-- Đã duyệt -->
      <div class="approval-section approved">
        <h3 class="section-title">
          <i class="fas fa-check-double"></i>
          Đã duyệt
          <span class="badge">{{ approvedBorrows.length }}</span>
        </h3>
        <div v-if="approvedBorrows.length > 0" class="borrow-list">
          <div
            v-for="borrow in filteredApprovedBorrows"
            :key="borrow._id"
            class="borrow-card approved"
          >
            <div class="card-header">
              <div class="reader-info">
                <h4 class="reader-name">
                  {{ borrow.docGia?.hoLot }} {{ borrow.docGia?.ten }}
                </h4>
                <span class="reader-id">{{ borrow.docGia?.maDocGia }}</span>
              </div>
              <span class="approved-date">{{
                formatDate(borrow.ngayDuyet)
              }}</span>
            </div>
            <div class="card-body">
              <div class="book-info">
                <div class="book-cover">
                  <img
                    v-if="borrow.sach?.anhBia"
                    :src="borrow.sach.anhBia"
                    :alt="borrow.sach.tenSach"
                  />
                  <div v-else class="no-image">
                    <i class="fas fa-book"></i>
                  </div>
                </div>
                <div class="book-details">
                  <h5 class="book-title">{{ borrow.sach?.tenSach }}</h5>
                  <p class="book-author">{{ borrow.sach?.tacGia }}</p>
                  <p class="book-publisher">{{ borrow.sach?.nhaPhatHanh }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>Chưa duyệt phiếu nào</p>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
      <div class="modal-content">
        <h3>{{ confirmAction === 'approve' ? 'Duyệt phiếu mượn' : 'Từ chối phiếu mượn' }}</h3>
        <p v-if="confirmAction === 'approve'">
          Xác nhận duyệt phiếu mượn sách <strong>{{ selectedBorrow?.sach?.tenSach }}</strong> cho
          <strong>{{ selectedBorrow?.docGia?.hoLot }} {{ selectedBorrow?.docGia?.ten }}</strong>?
        </p>
        <p v-else>
          Bạn có chắc chắn muốn từ chối phiếu mượn này không?
        </p>
        <div v-if="confirmAction === 'approve'" class="form-group">
          <label>Ghi chú (tùy chọn)</label>
          <textarea v-model="approvalNote" placeholder="Nhập ghi chú..." rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showConfirm = false">Hủy</button>
          <button
            :class="[
              'btn',
              confirmAction === 'approve' ? 'btn-success' : 'btn-danger',
            ]"
            @click="confirmApproval"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Đang xử lý...' : (confirmAction === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import BorrowService from "@/services/borrow.service";

export default {
  components: {
    InputSearch,
  },
  data() {
    return {
      pendingBorrows: [],
      approvedBorrows: [],
      searchText: "",
      isApproving: false,
      isProcessing: false,
      showConfirm: false,
      confirmAction: null, // 'approve' or 'reject'
      selectedBorrowId: null,
      selectedBorrow: null,
      approvalNote: "",
    };
  },
  computed: {
    pendingCount() {
      return this.pendingBorrows.length;
    },
    approvedCount() {
      return this.approvedBorrows.length;
    },
    filteredPendingBorrows() {
      return this.filterBorrows(this.pendingBorrows);
    },
    filteredApprovedBorrows() {
      return this.filterBorrows(this.approvedBorrows);
    },
  },
  methods: {
    async loadBorrows() {
      try {
        const response = await BorrowService.getAll({
          filter: "choDuyet",
        });
        this.pendingBorrows = response || [];

        // Load approved borrows too
        const approvedResponse = await BorrowService.getAll({
          filter: "dangMuon",
        });
        this.approvedBorrows = approvedResponse || [];
      } catch (error) {
        console.error("Error loading borrows:", error);
        this.$notify?.error?.("Lỗi tải dữ liệu phiếu mượn");
      }
    },
    filterBorrows(borrows) {
      if (!this.searchText) return borrows;
      const search = this.searchText.toLowerCase();
      return borrows.filter((b) => {
        const readerName = `${b.docGia?.hoLot || ""} ${b.docGia?.ten || ""}`.toLowerCase();
        const bookName = (b.sach?.tenSach || "").toLowerCase();
        return readerName.includes(search) || bookName.includes(search);
      });
    },
    approveBorrow(borrowId) {
      this.selectedBorrowId = borrowId;
      this.selectedBorrow = this.pendingBorrows.find((b) => b._id === borrowId);
      this.confirmAction = "approve";
      this.approvalNote = "";
      this.showConfirm = true;
    },
    rejectBorrow(borrowId) {
      this.selectedBorrowId = borrowId;
      this.selectedBorrow = this.pendingBorrows.find((b) => b._id === borrowId);
      this.confirmAction = "reject";
      this.showConfirm = true;
    },
    async confirmApproval() {
      this.isProcessing = true;
      try {
        if (this.confirmAction === "approve") {
          await BorrowService.approve(this.selectedBorrowId, {
            note: this.approvalNote,
          });
          this.$notify?.success?.("Duyệt phiếu mượn thành công");
        } else {
          await BorrowService.reject(this.selectedBorrowId);
          this.$notify?.success?.("Từ chối phiếu mượn");
        }
        this.showConfirm = false;
        await this.loadBorrows();
      } catch (error) {
        console.error("Error:", error);
        this.$notify?.error?.(
          error?.response?.data?.message || "Có lỗi xảy ra"
        );
      } finally {
        this.isProcessing = false;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    formatDateTime(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN");
    },
  },
  mounted() {
    this.loadBorrows();
  },
};
</script>

<style scoped>
.page {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h2 {
  font-size: 28px;
  color: #333;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content h2 i {
  color: #4361ee;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-item.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.toolbar-left {
  flex: 1;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.approval-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.approval-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #4361ee;
}

.badge {
  background: #4361ee;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.approval-section.approved .badge {
  background: #28a745;
}

.borrow-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.borrow-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
}

.borrow-card.pending {
  border-left: 4px solid #f5576c;
  background: #fff9f9;
}

.borrow-card.pending:hover {
  border-color: #f5576c;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.15);
}

.borrow-card.approved {
  border-left: 4px solid #28a745;
  background: #f8fff9;
}

.borrow-card.approved:hover {
  border-color: #28a745;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.reader-info {
  flex: 1;
}

.reader-name {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.reader-id {
  display: block;
  font-size: 12px;
  color: #999;
}

.request-date,
.approved-date {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.card-body {
  margin-bottom: 16px;
}

.book-info {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.book-cover {
  flex-shrink: 0;
  width: 60px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
}

.book-details {
  flex: 1;
  font-size: 13px;
}

.book-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.book-author,
.book-publisher {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.book-copies {
  margin-top: 6px;
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
}

.book-copies .label {
  color: #666;
}

.book-copies .copies {
  font-weight: 600;
  color: #333;
}

.loan-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 12px;
  margin-top: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.info-item .label {
  color: #666;
}

.info-item .value {
  font-weight: 600;
  color: #333;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.modal-content p {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.modal-actions .btn {
  flex: 1;
  padding: 10px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .toolbar {
    flex-direction: column;
  }

  .borrow-list {
    grid-template-columns: 1fr;
  }

  .loan-info {
    grid-template-columns: 1fr;
  }
}
</style>
