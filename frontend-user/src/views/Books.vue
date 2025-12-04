<template>
  <div class="books-page">
    <h2 class="mb-4"><i class="fas fa-book"></i> Thư viện</h2>

    <div class="row">
      <!-- Mobile Filter Toggle -->
      <div class="col-12 d-lg-none mb-3">
        <button
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          @click="showMobileFilter = true"
        >
          <i class="fas fa-filter"></i>
          Lọc theo thể loại
        </button>
      </div>

      <!-- Sidebar Filter -->
      <div
        class="col-lg-3 col-xl-2 mb-4 filter-column"
        :class="{ 'show-mobile': showMobileFilter }"
      >
        <div
          class="filter-overlay d-lg-none"
          v-if="showMobileFilter"
          @click="showMobileFilter = false"
        ></div>
        <div class="filter-sidebar" v-if="availableGenres.length > 0">
          <div class="filter-header">
            <div class="d-flex align-items-center gap-2">
              <i class="fas fa-filter"></i>
              <span>Thể loại</span>
            </div>
            <button
              class="btn-close d-lg-none"
              @click="showMobileFilter = false"
            ></button>
          </div>

          <div class="genre-list">
            <button
              class="genre-item"
              :class="{ active: selectedGenre === null }"
              @click="selectGenre(null)"
            >
              <span class="genre-name">Tất cả</span>
              <i class="fas fa-check" v-if="selectedGenre === null"></i>
            </button>

            <button
              v-for="genre in availableGenres"
              :key="genre"
              class="genre-item"
              :class="{ active: selectedGenre === genre }"
              @click="selectGenre(genre)"
            >
              <span class="genre-name">{{ genre }}</span>
              <i class="fas fa-check" v-if="selectedGenre === genre"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-lg-9 col-xl-10">
        <!-- Search and Sort -->
        <div class="toolbar mb-4">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="search-box">
                <input
                  type="text"
                  class="form-control search-input"
                  placeholder="Tìm kiếm sách..."
                  v-model="searchText"
                />
                <i class="fas fa-search search-icon"></i>
              </div>
            </div>
            <div class="col-md-3">
              <CustomSelect
                v-model="sortBy"
                :options="sortOptions"
                placeholder="Mã sách"
                @update:modelValue="fetchBooks"
              />
            </div>
            <div class="col-md-3">
              <CustomSelect
                v-model="order"
                :options="orderOptions"
                placeholder="Thứ tự"
                @update:modelValue="fetchBooks"
              />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <!-- <div v-if="loading" class="loading-overlay">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Đang tải...</span>
          </div>
        </div> -->

        <!-- Books Grid -->
        <div>
          <div v-if="books.length === 0" class="text-center py-4">
            <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
            <p class="text-muted">Không tìm thấy sách nào</p>
          </div>

          <div
            class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-3"
          >
            <div v-for="book in books" :key="book.maSach" class="col mb-4">
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
                    <span v-else class="quantity-badge">
                      {{ book.soQuyen }}
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
      selectedGenre: null,
      currentPage: 1,
      totalBooks: 0,
      totalPages: 0,
      sortOptions: [
        { value: "", label: "Mã sách" },
        { value: "tenSach", label: "Tên sách" },
        { value: "tacGia", label: "Tác giả" },
        { value: "namXuatBan", label: "Năm xuất bản" },
      ],
      orderOptions: [
        { value: "asc", label: "Tăng dần" },
        { value: "desc", label: "Giảm dần" },
      ],
      allGenres: [], // Lưu tất cả genres từ backend
      showMobileFilter: false,
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
        if (this.selectedGenre) {
          params.theLoai = [this.selectedGenre];
        }

        // Thêm tìm kiếm
        if (this.searchText) {
          params.name = this.searchText;
        }

        const response = await BookService.getAll(params);

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
      this.selectedGenre = genre;
      this.showMobileFilter = false;
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
    selectedGenre() {
      this.currentPage = 1;
      this.fetchBooks();
    },
  },
  mounted() {
    this.fetchGenres();
    this.fetchBooks();
  },
};
</script>

<style scoped>
.filter-sidebar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.filter-header i {
  color: #4361ee;
}

.genre-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 5px;
  flex: 1;
}

/* Custom Scrollbar for genre list */
.genre-list::-webkit-scrollbar {
  width: 6px;
}

.genre-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.genre-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.genre-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.genre-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 10px;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  flex-shrink: 0;
}

/* Mobile Filter Styles */
@media (max-width: 991.98px) {
  .filter-column {
    position: fixed;
    top: 0;
    left: -300px;
    width: 280px;
    height: 100vh;
    z-index: 1050;
    transition: left 0.3s ease;
    padding: 0;
    margin: 0 !important;
  }

  .filter-column.show-mobile {
    left: 0;
  }

  .filter-sidebar {
    height: 100%;
    border-radius: 0;
    max-height: 100vh;
    top: 0;
    z-index: 1060;
    position: relative;
  }

  .filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    backdrop-filter: blur(2px);
  }
}

.genre-item:hover {
  background: #f3f4f6;
  color: #4361ee;
}

.genre-item.active {
  background: linear-gradient(135deg, #4361ee, #3f51b5);
  color: white;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.genre-item i {
  font-size: 0.8rem;
}

.search-box {
  position: relative;
}

.search-input {
  padding-right: 40px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  height: 42px;
}

.search-input:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
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

.quantity-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #4361ee;
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
