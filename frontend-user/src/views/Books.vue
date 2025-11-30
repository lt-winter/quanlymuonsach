<template>
  <div class="books-page">
    <h2 class="mb-4">
      <i class="fas fa-book"></i> Danh sách sách
    </h2>

    <!-- Search and Filter -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm sách..."
            v-model="searchText"
          />
          <div class="input-group-append">
            <button class="btn btn-primary" @click="search">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <select v-model="sortBy" class="form-control" @change="fetchBooks">
          <option value="">Sắp xếp theo</option>
          <option value="tenSach">Tên sách</option>
          <option value="tacGia">Tác giả</option>
          <option value="namXuatBan">Năm xuất bản</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="order" class="form-control" @change="fetchBooks">
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <!-- Books Grid -->
    <div v-else>
      <div v-if="filteredBooks.length === 0" class="text-center py-5">
        <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">Không tìm thấy sách nào</p>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div v-for="book in filteredBooks" :key="book.maSach" class="col mb-4">
          <div class="card h-100 shadow-sm" :class="{ 'out-of-stock': book.soQuyen <= 0 }">
            <div class="position-relative">
              <img
                :src="book.image || '/placeholder-book.svg'"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
              />
              <span v-if="book.soQuyen <= 0" class="out-of-stock-badge">Hết sách</span>
            </div>
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">{{ book.tenSach }}</h6>
              <p class="card-text text-muted small mb-2">
                <i class="fas fa-user"></i> {{ book.tacGia }}
              </p>
              <p class="card-text small">
                <span :class="book.soQuyen > 0 ? 'badge badge-info' : 'badge badge-danger'">
                  {{ book.soQuyen > 0 ? `Còn ${book.soQuyen} quyển` : 'Hết sách' }}
                </span>
              </p>
              <div class="mt-auto">
                <router-link
                  :to="{ name: 'book.detail', params: { id: book.maSach } }"
                  class="btn btn-sm btn-primary w-100"
                >
                  <i class="fas fa-eye"></i> Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/book.service";

export default {
  data() {
    return {
      books: [],
      searchText: "",
      sortBy: "",
      order: "asc",
      loading: false,
    };
  },
  computed: {
    filteredBooks() {
      if (!this.searchText) return this.books;
      const search = this.searchText.toLowerCase();
      return this.books.filter(
        (book) =>
          book.tenSach?.toLowerCase().includes(search) ||
          book.tacGia?.toLowerCase().includes(search)
      );
    },
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        this.books = await BookService.getAll({
          sortBy: this.sortBy,
          order: this.order,
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },
    search() {
      // Filter is computed, no need to fetch again
    },
  },
  mounted() {
    this.fetchBooks();
  },
};
</script>

<style scoped>
.out-of-stock {
  opacity: 0.7;
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>