<script>
export default {
  props: {
    borrows: { type: Array, default: () => [] },
  },
  emits: ["return", "lost", "edit"],
  methods: {
    formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    formatCurrency(amount) {
      if (!amount) return "0đ";
      return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    },
    getStatusClass(borrow) {
      if (borrow.trangThai === "matSach") return "status-lost";
      if (borrow.trangThai === "daTra") return "status-returned";
      if (this.isOverdue(borrow)) return "status-overdue";
      return "status-borrowing";
    },
    getStatusText(borrow) {
      if (borrow.trangThai === "matSach") return "Mất sách";
      if (borrow.trangThai === "daTra") return "Đã trả";
      if (this.isOverdue(borrow)) return "Quá hạn";
      return "Đang mượn";
    },
    isOverdue(borrow) {
      if (borrow.trangThai !== "dangMuon") return false;
      if (!borrow.hanTra) return false;
      const hanTra = new Date(borrow.hanTra);
      return new Date() > hanTra;
    },
    getDaysOverdue(borrow) {
      if (!this.isOverdue(borrow)) return 0;
      const hanTra = new Date(borrow.hanTra);
      const today = new Date();
      return Math.ceil((today - hanTra) / (1000 * 60 * 60 * 24));
    },
    getReaderName(borrow) {
      if (!borrow.docGia) return "Không xác định";
      return `${borrow.docGia.hoLot || ""} ${borrow.docGia.ten || ""}`.trim();
    },
  },
};
</script>

<template>
  <div class="borrow-table-wrapper">
    <table class="borrow-table">
      <thead>
        <tr>
          <th class="col-reader">Độc giả</th>
          <th class="col-book">Sách</th>
          <th>Ngày mượn</th>
          <th>Hạn trả</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Phạt/Bồi thường</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="borrow in borrows" 
          :key="borrow.maMuon"
          class="borrow-row"
          @click="$emit('edit', borrow)"
        >
          <td>
            <div class="reader-info">
              <i class="fas fa-user"></i>
              <span>{{ getReaderName(borrow) }}</span>
            </div>
          </td>
          <td>
            <div class="book-info">
              <i class="fas fa-book"></i>
              <span>{{ borrow.sach?.tenSach || "Không xác định" }}</span>
            </div>
          </td>
          <td>{{ formatDate(borrow.ngayMuon) }}</td>
          <td>
            <span :class="{ 'text-danger': isOverdue(borrow) }">
              {{ formatDate(borrow.hanTra) }}
            </span>
          </td>
          <td>{{ formatDate(borrow.ngayTra) }}</td>
          <td>
            <span class="status-badge" :class="getStatusClass(borrow)">
              {{ getStatusText(borrow) }}
              <span v-if="isOverdue(borrow)" class="overdue-days">
                ({{ getDaysOverdue(borrow) }} ngày)
              </span>
            </span>
          </td>
          <td>
            <div class="fee-info">
              <span v-if="borrow.tienPhat > 0" class="fee-item penalty">
                <i class="fas fa-exclamation-circle"></i>
                Phạt: {{ formatCurrency(borrow.tienPhat) }}
              </span>
              <span
                v-if="borrow.tienBoiThuong > 0"
                class="fee-item compensation"
              >
                <i class="fas fa-money-bill-wave"></i>
                Bồi thường: {{ formatCurrency(borrow.tienBoiThuong) }}
              </span>
              <span v-if="!borrow.tienPhat && !borrow.tienBoiThuong">—</span>
            </div>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.borrow-table-wrapper {
  background: white;
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.borrow-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.borrow-table th,
.borrow-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.borrow-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.col-reader,
.col-book {
  min-width: 200px;
  width: 20%;
}

.reader-info,
.book-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reader-info span,
.book-info span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.reader-info i {
  color: #4361ee;
  flex-shrink: 0;
}

.book-info i {
  color: #06d6a0;
  flex-shrink: 0;
}

.borrow-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.borrow-row:hover {
  background: #f0f4ff;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-borrowing {
  background: #dbeafe;
  color: #1e40af;
}

.status-returned {
  background: #d1fae5;
  color: #065f46;
}

.status-overdue {
  background: #fee2e2;
  color: #991b1b;
}

.status-lost {
  background: #fef3c7;
  color: #92400e;
}

.overdue-days {
  font-size: 0.7rem;
}

.text-danger {
  color: #dc2626;
  font-weight: 600;
}

.fee-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fee-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
}

.fee-item.penalty {
  color: #dc2626;
}

.fee-item.compensation {
  color: #d97706;
}


</style>
