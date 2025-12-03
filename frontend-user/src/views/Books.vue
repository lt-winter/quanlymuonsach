<template>
  <div class="books-page">
    <h2 class="mb-4"><i class="fas fa-book"></i> Danh sách sách</h2>

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
        <div v-for="book in filteredBooks" :key="book.maSach" class="col">
          <router-link
            :to="{ name: 'book.detail', params: { id: book.maSach } }"
            custom
            v-slot="{ navigate }"
          >
            <div class="book-card" @click="navigate">
              <div class="book-image-wrapper">
                <img
                  :src="book.anhSach || '/placeholder-book.svg'"
                  class="book-image"
                  :alt="book.tenSach"
                />
                <div class="book-overlay">
                  <span class="view-btn">
                    <i class="fas fa-eye"></i> Xem chi tiết
                  </span>
                </div>
                <span v-if="book.soQuyen <= 0" class="out-of-stock-badge">
                  Hết sách
                </span>
              </div>

              <div class="book-info">
                <h5 class="book-title">{{ book.tenSach }}</h5>
                <p class="book-author">
                  <i class="fas fa-pen-fancy"></i>
                  {{ book.tacGia || "Đang cập nhật" }}
                </p>
                <div class="book-meta">
                  <span class="book-price" v-if="book.donGia">
                    {{ new Intl.NumberFormat("vi-VN").format(book.donGia) }}đ
                  </span>
                  <span class="book-quantity">
                    <i class="fas fa-layer-group"></i>
                    {{ book.soQuyen > 0 ? book.soQuyen : 0 }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
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
.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

.book-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-image {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.9),
    rgba(114, 9, 183, 0.9)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.view-btn {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(4px);
}

.book-info {
  padding: 20px;
}

.book-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
  font-size: 1rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
  line-height: 1.5;
}

.book-author {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-author i {
  color: #9ca3af;
  font-size: 0.75rem;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  font-weight: 700;
  color: #4361ee;
  font-size: 1rem;
}

.book-quantity {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 20px;
}

.book-quantity i {
  font-size: 0.7rem;
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef476f;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}
</style>
