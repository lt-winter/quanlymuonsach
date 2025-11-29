<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-plus-circle"></i>
          Tạo phiếu mượn sách
        </h2>
        <p class="page-subtitle">Cho độc giả mượn sách</p>
      </div>
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <div class="form-container">
      <BorrowForm
        :borrow="borrow"
        @submit:borrow="createBorrow"
      />
    </div>
  </div>
</template>

<script>
import BorrowForm from "@/components/borrows/BorrowForm.vue";
import BorrowService from "@/services/borrow.service";

export default {
  components: { BorrowForm },
  data() {
    return {
      borrow: {
        maDocGia: "",
        maSach: "",
        ngayMuon: new Date().toISOString().split("T")[0],
        ghiChu: "",
      },
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "borrows" });
    },
    async createBorrow(data) {
      try {
        await BorrowService.create(data);
        this.$router.push({ name: "borrows" });
      } catch (error) {
        console.error("Lỗi khi tạo phiếu mượn:", error);
        alert("Có lỗi xảy ra khi tạo phiếu mượn");
      }
    },
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
</style>
