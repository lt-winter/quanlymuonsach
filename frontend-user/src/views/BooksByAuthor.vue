<template>
  <div class="books-by-author-page">
    <h2 class="mb-4">
      <i class="fas fa-user-edit"></i> Sách theo Tác giả
    </h2>

    <div class="row">
      <!-- Sidebar Author List -->
      <div class="col-lg-3 col-xl-2 mb-4">
        <div
          class="filter-overlay d-lg-none"
          v-if="showMobileFilter"
          @click="showMobileFilter = false"
        ></div>
        <div class="filter-sidebar">
          <div class="filter-header">
            <div class="d-flex align-items-center gap-2">
              <i class="fas fa-user-edit"></i>
              <span>Tác giả</span>
            </div>
            <button
              class="btn-close d-lg-none"
              @click="showMobileFilter = false"
            ></button>
          </div>

          <!-- Search authors -->
          <div class="author-search p-3">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Tìm tác giả..."
              v-model="authorSearch"
            />
          </div>

          <!-- Loading authors -->
          <div v-if="loadingAuthors" class="text-center py-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
          </div>

          <!-- Author list -->
          <div v-else class="author-list">
            <button
              v-for="author in filteredAuthors"
              :key="author"
              class="author-item"
              :class="{ active: selectedAuthor === author }"
              @click="selectAuthor(author)"
            >
              <span class="author-name">{{ author }}</span>
              <i class="fas fa-check" v-if="selectedAuthor === author"></i>
            </button>

            <div
              v-if="filteredAuthors.length === 0"
              class="text-center py-3 text-muted"
            >
              Không tìm thấy tác giả
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-lg-9 col-xl-10">
        <!-- Mobile filter toggle -->
        <div class="d-lg-none mb-3">
          <button
            class="btn btn-primary w-100"
            @click="showMobileFilter = true"
          >
            <i class="fas fa-filter"></i> Chọn tác giả
          </button>
        </div>

        <!-- Selected Author Info -->
        <div v-if="selectedAuthor" class="author-info-card mb-4">
          <div class="author-info-header">
            <div>
              <h4 class="mb-1">
                <i class="fas fa-user-edit"></i>
                {{ selectedAuthor }}
              </h4>
              <p class="text-muted mb-0">Tác giả</p>
            </div>
            <div class="book-count-badge">
              {{ filteredBooks.length }} sách
            </div>
          </div>
        </div>

        <!-- Search and Sort -->
        <div class="toolbar mb-4" v-if="selectedAuthor">
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
                placeholder="Sắp xếp"
              />
            </div>
            <div class="col-md-3">
              <CustomSelect
                v-model="order"
                :options="orderOptions"
                placeholder="Thứ tự"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!selectedAuthor" class="empty-state text-center py-5">
          <i class="fas fa-user-edit fa-4x mb-3 text-muted"></i>
          <h5 class="text-muted">Chọn tác giả để xem danh sách sách</h5>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Đang tải...</span>
          </div>
        </div>

        <!-- Book List -->
        <div v-else-if="displayedBooks.length > 0">
          <div
            class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4"
          >
            <div v-for="book in displayedBooks" :key="book.maSach" class="col">
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
                    <span class="quantity-badge">{{ book.soQuyen }}</span>
                  </div>

                  <div class="book-info">
                    <h5 class="book-title">{{ book.tenSach }}</h5>
                    <p class="book-publisher" v-if="book.publisher">
                      <i class="fas fa-building"></i>
                      {{ book.publisher.tenNXB }}
                    </p>
                    <div class="book-meta">
                      <span class="book-year" v-if="book.namXuatBan">
                        <i class="fas fa-calendar"></i>
                        {{ book.namXuatBan }}
                      </span>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-wrapper mt-5">
            <nav>
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(currentPage - 1)"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </li>

                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <a class="page-link" href="#" @click.prevent="goToPage(page)">
                    {{ page }}
                  </a>
                </li>

                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(currentPage + 1)"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- No books found -->
        <div v-else class="empty-state text-center py-5">
          <i class="fas fa-book-open fa-4x mb-3 text-muted"></i>
          <h5 class="text-muted">Không tìm thấy sách nào của tác giả này</h5>
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
      authors: [],
      selectedAuthor: null,
      allBooks: [],
      loadingAuthors: false,
      loading: false,
      showMobileFilter: false,
      searchText: "",
      authorSearch: "",
      sortBy: "tenSach",
      order: "asc",
      currentPage: 1,
      booksPerPage: 12,
      sortOptions: [
        { value: "tenSach", label: "Tên sách" },
        { value: "namXuatBan", label: "Năm xuất bản" },
        { value: "donGia", label: "Đơn giá" },
      ],
      orderOptions: [
        { value: "asc", label: "Tăng dần" },
        { value: "desc", label: "Giảm dần" },
      ],
    };
  },
  computed: {
    filteredAuthors() {
      if (!this.authorSearch) return this.authors;

      return this.authors.filter((author) =>
        author.toLowerCase().includes(this.authorSearch.toLowerCase())
      );
    },
    filteredBooks() {
      if (!this.selectedAuthor) return [];

      let books = this.allBooks.filter((book) => {
        // Lọc theo author
        const matchAuthor = book.tacGia === this.selectedAuthor;

        // Lọc theo search text
        const matchSearch = this.searchText
          ? book.tenSach.toLowerCase().includes(this.searchText.toLowerCase())
          : true;

        return matchAuthor && matchSearch;
      });

      // Sắp xếp
      books = this.sortBooks(books);

      return books;
    },
    displayedBooks() {
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      return this.filteredBooks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    searchText() {
      this.currentPage = 1;
    },
    sortBy() {
      this.currentPage = 1;
    },
    order() {
      this.currentPage = 1;
    },
  },
  methods: {
    async loadAuthors() {
      this.loadingAuthors = true;
      try {
        const response = await BookService.getAuthors();
        this.authors = response.data || [];
      } catch (error) {
        console.error("Error loading authors:", error);
      } finally {
        this.loadingAuthors = false;
      }
    },
    async loadBooks() {
      this.loading = true;
      try {
        const response = await BookService.getAll({ limit: 1000 });
        this.allBooks = response.data || [];
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        this.loading = false;
      }
    },
    selectAuthor(author) {
      this.selectedAuthor = author;
      this.currentPage = 1;
      this.showMobileFilter = false;
    },
    sortBooks(books) {
      return [...books].sort((a, b) => {
        let valueA = a[this.sortBy];
        let valueB = b[this.sortBy];

        // Handle null/undefined
        if (valueA == null) valueA = "";
        if (valueB == null) valueB = "";

        // Compare
        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (this.order === "asc") {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  },
  async mounted() {
    await this.loadAuthors();
    await this.loadBooks();
  },
};
</script>

<style scoped>
.books-by-author-page {
  padding: 20px 0;
}

/* Filter Sidebar */
.filter-sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: sticky;
  top: 20px;
}

.filter-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-search {
  border-bottom: 1px solid #f0f0f0;
}

.author-list {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.author-item {
  width: 100%;
  padding: 15px 20px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-item:hover {
  background: #f8f9fa;
}

.author-item.active {
  background: #e8eaf6;
  color: #667eea;
  font-weight: 600;
}

.author-name {
  flex: 1;
}

/* Author Info Card */
.author-info-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.author-info-header h4 {
  color: #1f2937;
  margin: 0;
}

.book-count-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  white-space: nowrap;
}

/* Toolbar */
.toolbar {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
}

.search-input {
  padding-left: 40px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
}

/* Book Card */
.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.book-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
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
    rgba(102, 126, 234, 0.9),
    rgba(118, 75, 162, 0.9)
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

.book-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
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
}

.book-publisher {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-meta {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.book-year {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Pagination */
.pagination {
  gap: 5px;
}

.page-link {
  border: 1px solid #e5e7eb;
  color: #667eea;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.page-link:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-item.active .page-link {
  background: #667eea;
  border-color: #667eea;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile */
@media (max-width: 991px) {
  .filter-column {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    z-index: 1050;
    transition: left 0.3s ease;
  }

  .filter-column.show-mobile {
    left: 0;
  }

  .filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
  }

  .filter-sidebar {
    position: relative;
    height: 100vh;
    border-radius: 0;
    z-index: 1051;
  }
}
</style>
