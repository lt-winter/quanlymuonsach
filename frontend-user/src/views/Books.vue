<template>
  <div class="books-page">
    <h2 class="mb-4"><i class="fas fa-book"></i> Thư viện</h2>

    <!-- Search and Filter -->
    <div class="row mb-2">
      <div class="col-md-6 mb-2">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm sách..."
            v-model="searchText"
          />
        </div>
      </div>
      <div class="col-md-3 mb-2">
        <CustomSelect
          v-model="sortBy"
          :options="sortOptions"
          placeholder="Sắp xếp theo"
          @update:modelValue="fetchBooks"
        />
      </div>
      <div class="col-md-3 mb-2">
        <CustomSelect
          v-model="order"
          :options="orderOptions"
          placeholder="Thứ tự"
          @update:modelValue="fetchBooks"
        />
      </div>
    </div>

    <!-- Genre Filter -->
    <div class="row mb-2" v-if="availableGenres.length > 0">
      <div class="col-12">
        <div class="genre-filter">
          <label class="filter-label">
            <i class="fas fa-filter"></i> Lọc theo thể loại:
          </label>

          <!-- Hiển thị các thể loại đã chọn -->
          <div v-if="selectedGenres.length > 0" class="selected-genres mb-3">
            <span class="selected-label">Thể loại đã chọn:</span>
            <span
              v-for="genre in selectedGenres"
              :key="'selected-' + genre"
              class="selected-genre-badge"
            >
              {{ genre }}
              <i class="fas fa-times" @click="removeGenre(genre)"></i>
            </span>
            <button class="btn-clear-all" @click="selectGenre(null)">
              <i class="fas fa-times-circle"></i> Xóa tất cả
            </button>
          </div>

          <div class="genre-tags">
            <button
              class="genre-tag"
              :class="{ active: selectedGenres.length === 0 }"
              @click="selectGenre(null)"
            >
              <i class="fas fa-th"></i> Tất cả
            </button>
            <button
              v-for="genre in availableGenres"
              :key="genre"
              class="genre-tag"
              :class="{ active: selectedGenres.includes(genre) }"
              @click="selectGenre(genre)"
            >
              {{ genre }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <!-- Books Grid -->
    <div>
      <div v-if="books.length === 0" class="text-center py-4">
        <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">Không tìm thấy sách nào</p>
      </div>

      <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5">
        <div v-for="book in books" :key="book.maSach" class="col mb-4 p-2">
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

              <div class="book-info p-3">
                <h5 class="book-title">{{ book.tenSach }}</h5>
                <p class="book-author">
                  <i class="fas fa-pen-fancy"></i>
                  {{ book.tacGia || "Đang cập nhật" }}
                </p>

                <!-- Thể loại -->
                <div
                  class="book-genres"
                  v-if="book.theLoai && book.theLoai.length > 0"
                >
                  <span
                    v-for="genre in book.theLoai"
                    :key="genre"
                    class="genre-badge"
                  >
                    {{ genre }}
                  </span>
                </div>

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

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-wrapper mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button
                class="page-link"
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>

            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">
                {{ page }}
              </button>
            </li>

            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <button
                class="page-link"
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>

        <div class="pagination-info text-center mt-2">
          <small class="text-muted">
            Trang {{ currentPage }} / {{ totalPages }} - Tổng số:
            {{ totalBooks }} sách
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/book.service";
import CustomSelect from "@/components/CustomSelect.vue";

export default {
  components: {
    CustomSelect,
  },
  data() {
    return {
      books: [],
      searchText: "",
      sortBy: "",
      order: "asc",
      loading: false,
      selectedGenres: [],
      currentPage: 1,
      totalBooks: 0,
      totalPages: 0,
      sortOptions: [
        { value: "", label: "Sắp xếp theo" },
        { value: "tenSach", label: "Tên sách" },
        { value: "tacGia", label: "Tác giả" },
        { value: "namXuatBan", label: "Năm xuất bản" },
      ],
      orderOptions: [
        { value: "asc", label: "Tăng dần" },
        { value: "desc", label: "Giảm dần" },
      ],
      allGenres: [], // Lưu tất cả genres từ backend
    };
  },
  computed: {
    availableGenres() {
      return this.allGenres;
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const params = {
          sortBy: this.sortBy,
          order: this.order,
          page: this.currentPage,
          limit: 40,
        };

        // Thêm filter thể loại
        if (this.selectedGenres.length > 0) {
          params.theLoai = this.selectedGenres;
        }

        // Thêm tìm kiếm
        if (this.searchText) {
          params.name = this.searchText;
        }

        console.log('Fetching books with params:', params);
        const response = await BookService.getAll(params);
        console.log('Response:', response);

        // Xử lý response có pagination
        if (response.data && response.pagination) {
          this.books = response.data;
          this.totalBooks = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
        } else {
          // Fallback nếu backend chưa cập nhật
          this.books = response;
          this.totalBooks = response.length;
          this.totalPages = 1;
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },
    selectGenre(genre) {
      console.log('selectGenre called with:', genre);
      if (genre === null) {
        // Click "Tất cả" - bỏ chọn tất cả
        this.selectedGenres = [];
      } else {
        // Toggle thể loại
        const index = this.selectedGenres.indexOf(genre);
        if (index > -1) {
          this.selectedGenres.splice(index, 1);
        } else {
          this.selectedGenres.push(genre);
        }
      }
      console.log('selectedGenres after update:', this.selectedGenres);
    },
    removeGenre(genre) {
      const index = this.selectedGenres.indexOf(genre);
      if (index > -1) {
        this.selectedGenres.splice(index, 1);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchBooks();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    async fetchGenres() {
      try {
        const response = await BookService.getGenres();
        this.allGenres = response.data || [];
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    },
  },
  watch: {
    searchText() {
      this.currentPage = 1;
      this.fetchBooks();
    },
    sortBy() {
      this.currentPage = 1;
      this.fetchBooks();
    },
    order() {
      this.currentPage = 1;
      this.fetchBooks();
    },
    selectedGenres: {
      handler() {
        console.log('watch selectedGenres triggered');
        this.currentPage = 1;
        this.fetchBooks();
      },
      deep: true
    },
  },
  mounted() {
    this.fetchGenres();
    this.fetchBooks();
  },
};
</script>

<style scoped>
.genre-filter {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-label {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  display: block;
  font-size: 0.95rem;
}

.filter-label i {
  color: #4361ee;
  margin-right: 6px;
}

.selected-genres {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
}

.selected-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.selected-genre-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  color: white;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
}

.selected-genre-badge i {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.selected-genre-badge i:hover {
  opacity: 1;
}

.btn-clear-all {
  padding: 6px 12px;
  background: #ef476f;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-clear-all:hover {
  background: #dc2f55;
  transform: translateY(-1px);
}

.btn-clear-all i {
  font-size: 0.875rem;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.genre-tag {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.genre-tag:hover {
  border-color: #4361ee;
  color: #4361ee;
  transform: translateY(-2px);
}

.genre-tag.active {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  border-color: #4361ee;
  color: white;
  box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
}

.genre-tag i {
  margin-right: 4px;
  font-size: 0.75rem;
}

.book-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-content: flex-start;
}

.genre-badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  font-weight: 500;
}

.genre-more {
  font-size: 0.7rem;
  padding: 4px 6px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 12px;
  font-weight: 600;
}

.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.book-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  font-size: 1rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 48px;
  line-height: 1.5;
}

.book-author {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 24px;
  line-height: 1.5;
}

.book-author i {
  color: #9ca3af;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
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

.pagination-wrapper {
  margin-top: 2rem;
}

.pagination {
  gap: 8px;
}

.page-item .page-link {
  border: 2px solid #e5e7eb;
  color: #6b7280;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.page-item .page-link:hover {
  background: #f3f4f6;
  border-color: #4361ee;
  color: #4361ee;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  border-color: #4361ee;
  color: white;
  box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(1px);
}
</style>
