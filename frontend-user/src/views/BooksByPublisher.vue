<template>
  <div class="books-by-publisher-page">
    <h2 class="mb-4">
      <i class="fas fa-building"></i> Sách theo Nhà xuất bản
    </h2>

    <div class="row">
      <!-- Sidebar Publisher List -->
      <div class="col-lg-3 col-xl-2 mb-4">
        <div
          class="filter-overlay d-lg-none"
          v-if="showMobileFilter"
          @click="showMobileFilter = false"
        ></div>
        <div class="filter-sidebar">
          <div class="filter-header">
            <div class="d-flex align-items-center gap-2">
              <i class="fas fa-building"></i>
              <span>Nhà xuất bản</span>
            </div>
            <button
              class="btn-close d-lg-none"
              @click="showMobileFilter = false"
            ></button>
          </div>

          <!-- Loading publishers -->
          <div v-if="loadingPublishers" class="text-center py-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
          </div>

          <!-- Publisher list -->
          <div v-else class="publisher-list">
            <button
              v-for="publisher in publishers"
              :key="publisher.maNXB"
              class="publisher-item"
              :class="{ active: selectedPublisher?.maNXB === publisher.maNXB }"
              @click="selectPublisher(publisher)"
            >
              <span class="publisher-name">{{ publisher.tenNXB }}</span>
              <i
                class="fas fa-check"
                v-if="selectedPublisher?.maNXB === publisher.maNXB"
              ></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-lg-9 col-xl-10">
        <!-- Selected Publisher Info -->
        <div v-if="selectedPublisher" class="publisher-info-card mb-4">
          <div class="publisher-info-header">
            <div>
              <h4 class="mb-2">
                <i class="fas fa-building"></i>
                {{ selectedPublisher.tenNXB }}
              </h4>
              <p v-if="selectedPublisher.diaChi" class="text-muted mb-0">
                <i class="fas fa-map-marker-alt"></i>
                {{ selectedPublisher.diaChi }}
              </p>
            </div>
            <div class="book-count-badge">
              {{ filteredBooks.length }} sách
            </div>
          </div>
        </div>

        <!-- Search and Sort -->
        <div class="toolbar mb-4" v-if="selectedPublisher">
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
        <div
          v-if="!selectedPublisher"
          class="empty-state text-center py-5"
        >
          <i class="fas fa-building fa-4x mb-3 text-muted"></i>
          <h5 class="text-muted">Chọn nhà xuất bản để xem danh sách sách</h5>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Đang tải...</span>
          </div>
        </div>

        <!-- Book List -->
        <div v-else-if="displayedBooks.length > 0">
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
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
                    <p class="book-author">
                      <i class="fas fa-pen-fancy"></i>
                      {{ book.tacGia || "Đang cập nhật" }}
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
                  <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(page)"
                  >
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
          <h5 class="text-muted">
            Không tìm thấy sách nào của nhà xuất bản này
          </h5>
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
      publishers: [],
      selectedPublisher: null,
      allBooks: [],
      loadingPublishers: false,
      loading: false,
      showMobileFilter: false,
      searchText: "",
      sortBy: "tenSach",
      order: "asc",
      currentPage: 1,
      booksPerPage: 12,
      sortOptions: [
        { value: "tenSach", label: "Tên sách" },
        { value: "tacGia", label: "Tác giả" },
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
    filteredBooks() {
      if (!this.selectedPublisher) return [];

      let books = this.allBooks.filter((book) => {
        // Lọc theo publisher - kiểm tra nhiều khả năng
        const bookMaNXB = book.maNXB;
        const publisherMaNXB = this.selectedPublisher.maNXB;
        const publisherId = this.selectedPublisher._id;
        
        // So sánh maNXB (string hoặc ObjectId)
        const matchByMaNXB = bookMaNXB && publisherMaNXB && 
          (bookMaNXB === publisherMaNXB || 
           bookMaNXB?.toString() === publisherMaNXB?.toString());
        
        // So sánh _id (trường hợp sách lưu _id của publisher)
        const matchById = publisherId && 
          (bookMaNXB === publisherId || 
           bookMaNXB?.toString() === publisherId?.toString());

        const matchPublisher = matchByMaNXB || matchById;

        // Lọc theo search text
        const matchSearch = this.searchText
          ? book.tenSach.toLowerCase().includes(this.searchText.toLowerCase()) ||
            (book.tacGia &&
              book.tacGia.toLowerCase().includes(this.searchText.toLowerCase()))
          : true;

        return matchPublisher && matchSearch;
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
    async loadPublishers() {
      this.loadingPublishers = true;
      try {
        const response = await BookService.getPublishers();
        this.publishers = response.data || [];
      } catch (error) {
        console.error("Error loading publishers:", error);
      } finally {
        this.loadingPublishers = false;
      }
    },
    async loadBooks() {
      this.loading = true;
      try {
        const response = await BookService.getAll({ limit: 1000 });
        this.allBooks = response.data || [];
        console.log("Loaded books:", this.allBooks.length);
        if (this.allBooks.length > 0) {
          console.log("Sample book maNXB:", this.allBooks[0].maNXB);
        }
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        this.loading = false;
      }
    },
    selectPublisher(publisher) {
      this.selectedPublisher = publisher;
      this.currentPage = 1;
      this.showMobileFilter = false;
      console.log("Selected publisher:", publisher);
      console.log("Publisher maNXB:", publisher.maNXB);
      console.log("Publisher _id:", publisher._id);
      console.log("Total books:", this.allBooks.length);
      console.log("Sample book maNXB values:", this.allBooks.slice(0, 3).map(b => ({
        maNXB: b.maNXB,
        tenSach: b.tenSach
      })));
      console.log("Books with this publisher:", this.filteredBooks.length);
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
    await this.loadPublishers();
    await this.loadBooks();
  },
};
</script>

<style scoped>
.books-by-publisher-page {
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

.publisher-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.publisher-item {
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

.publisher-item:hover {
  background: #f8f9fa;
}

.publisher-item.active {
  background: #e8eaf6;
  color: #667eea;
  font-weight: 600;
}

.publisher-name {
  flex: 1;
}

/* Publisher Info Card */
.publisher-info-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.publisher-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.publisher-info-header h4 {
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

.book-author {
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
