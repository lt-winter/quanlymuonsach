<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-edit"></i>
          Chi tiết phiếu mượn
        </h2>
        <p class="page-subtitle">Xem và cập nhật thông tin mượn sách</p>
      </div>
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <div class="form-container" v-if="borrow">
      <BorrowForm
        :borrow="borrow"
        @submit:borrow="updateBorrow"
        @delete:borrow="deleteBorrow"
        @return:borrow="returnBorrow"
        @lost:borrow="reportLost"
      />
    </div>
    <div v-else class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Đang tải...
    </div>
  </div>
</template>

<script>
import BorrowForm from "@/components/borrows/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";

export default {
  components: { BorrowForm },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      borrow: null,
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "borrows" });
    },
    async loadBorrow() {
      try {
        this.borrow = await BorrowService.get(this.id);
      } catch (error) {
        console.error("Lỗi khi tải phiếu mượn:", error);
        this.goBack();
      }
    },
    async updateBorrow(data) {
      try {
        await BorrowService.update(this.id, data);
        this.goBack();
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật");
      }
    },
    async deleteBorrow() {
      if (confirm("Bạn có chắc muốn xóa phiếu mượn này?")) {
        try {
          await BorrowService.delete(this.id);
          this.goBack();
        } catch (error) {
          console.error("Lỗi khi xóa:", error);
          alert("Có lỗi xảy ra khi xóa");
        }
      }
    },
    async returnBorrow() {
      const ngayTra = prompt("Nhập ngày trả (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
      if (ngayTra) {
        try {
          await BorrowService.returnBook(this.id, ngayTra);
          await this.loadBorrow();
          alert("Đã trả sách thành công!");
        } catch (error) {
          console.error("Lỗi khi trả sách:", error);
          alert("Có lỗi xảy ra khi trả sách");
        }
      }
    },
    async reportLost() {
      const donGia = this.borrow?.sach?.donGia || 0;
      if (confirm(`Xác nhận báo mất sách?\nBồi thường: ${new Intl.NumberFormat("vi-VN").format(donGia)}đ`)) {
        try {
          await BorrowService.reportLost(this.id);
          await this.loadBorrow();
          alert("Đã báo mất sách!");
        } catch (error) {
          console.error("Lỗi khi báo mất:", error);
          alert("Có lỗi xảy ra khi báo mất sách");
        }
      }
    },
  },
  mounted() {
    this.loadBorrow();
  },
};
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
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

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 60px;
  color: #6b7280;
  font-size: 1.1rem;
}

.loading i {
  margin-right: 8px;
}
</style>
