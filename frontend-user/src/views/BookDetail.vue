<template>
  <div class="book-detail-page">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else-if="book" class="row">
      <div class="col-md-4">
        <img
          :src="book.image || '/placeholder-book.svg'"
          class="img-fluid rounded shadow"
          :alt="book.tenSach"
        />
      </div>
      <div class="col-md-8">
        <h2>{{ book.tenSach }}</h2>
        <hr />
        <table class="table table-borderless">
          <tr>
            <th style="width: 150px"><i class="fas fa-user"></i> Tác giả:</th>
            <td>{{ book.tacGia }}</td>
          </tr>
          <tr>
            <th><i class="fas fa-building"></i> Nhà xuất bản:</th>
            <td>{{ book.publisher?.tenNXB || "Chưa cập nhật" }}</td>
          </tr>
          <tr>
            <th><i class="fas fa-calendar"></i> Năm xuất bản:</th>
            <td>{{ book.namXuatBan }}</td>
          </tr>
          <tr>
            <th><i class="fas fa-money-bill"></i> Đơn giá:</th>
            <td>{{ formatCurrency(book.donGia) }} VNĐ</td>
          </tr>
          <tr>
            <th><i class="fas fa-layer-group"></i> Số quyển:</th>
            <td>
              <span :class="book.soQuyen > 0 ? 'text-success' : 'text-danger'">
                {{ book.soQuyen }} quyển
              </span>
            </td>
          </tr>
        </table>

        <div class="mt-4">
          <button
            v-if="user && book.soQuyen > 0"
            class="btn btn-success btn-lg"
            @click="borrowBook"
            :disabled="borrowing"
          >
            <span v-if="borrowing" class="spinner-border spinner-border-sm"></span>
            <i v-else class="fas fa-hand-holding"></i> Mượn sách này
          </button>
          <router-link
            v-else-if="!user"
            to="/login"
            class="btn btn-primary btn-lg"
          >
            <i class="fas fa-sign-in-alt"></i> Đăng nhập để mượn sách
          </router-link>
          <span v-else class="badge badge-danger p-2">
            <i class="fas fa-times"></i> Sách đã hết
          </span>
        </div>

        <div v-if="message" class="alert alert-info mt-3">
          {{ message }}
        </div>

        <router-link to="/books" class="btn btn-outline-secondary mt-3">
          <i class="fas fa-arrow-left"></i> Quay lại danh sách
        </router-link>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
      <p class="text-muted">Không tìm thấy sách</p>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/book.service";
import BorrowService from "@/services/borrow.service";

export default {
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      book: null,
      loading: false,
      borrowing: false,
      message: "",
      user: JSON.parse(localStorage.getItem("user")) || null,
    };
  },
  methods: {
    async fetchBook() {
      this.loading = true;
      try {
        this.book = await BookService.get(this.id);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        this.loading = false;
      }
    },
    async borrowBook() {
      this.borrowing = true;
      this.message = "";
      try {
        await BorrowService.borrow(this.id);
        this.message = "Mượn sách thành công! Vui lòng đến thư viện để nhận sách.";
        this.book.soQuyen--;
      } catch (error) {
        console.error("Error borrowing book:", error);
        this.message = error?.response?.data?.message || "Không thể mượn sách";
      } finally {
        this.borrowing = false;
      }
    },
    formatCurrency(value) {
      if (!value) return "0";
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  mounted() {
    this.fetchBook();
  },
};
</script>
