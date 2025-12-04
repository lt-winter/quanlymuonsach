<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-book"></i>
          Quản lý Sách
        </h2>
        <p class="page-subtitle">Quản lý tất cả sách trong thư viện</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredBooksCount }}</span>
          <span class="stat-label">Sách</span>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <InputSearch
          v-model="searchText"
          placeholder="Nhập tên sách hoặc tác giả..."
        />
      </div>
      <div class="toolbar-right">
        <div class="sort-controls">
          <CustomSelect
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Sắp xếp"
          />
          <button class="sort-order-btn" @click="toggleOrder">
            <i
              :class="
                order === 'asc'
                  ? 'fas fa-sort-amount-up'
                  : 'fas fa-sort-amount-down'
              "
            ></i>
          </button>
        </div>
        <div class="action-buttons">
          <button class="action-btn refresh" @click="refreshList()">
            <i class="fas fa-redo"></i>
            Làm mới
          </button>
          <button class="action-btn add" @click="goToAddBook">
            <i class="fas fa-plus"></i>
            Thêm mới
          </button>
          <button class="action-btn delete" @click="removeAllBooks">
            <i class="fas fa-trash"></i>
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>

    <!-- Genre Filter -->
    <div class="genre-filter-section" v-if="availableGenres.length > 0">
      <label class="filter-label">
        <i class="fas fa-filter"></i> Lọc theo thể loại:
      </label>

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
          <i 
            v-if="selectedGenres.includes(genre)"
            class="fas fa-times"
            @click.stop="removeGenre(genre)"
          ></i>
        </button>
      </div>
    </div>

    <div class="content-area">
      <BookList
        v-if="filteredBooksCount > 0"
        :books="filteredBooks"
        v-model:activeIndex="activeIndex"
      />
      <div v-else class="empty-state">
        <i class="fas fa-book-open"></i>
        <h4>Không có sách nào</h4>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import BookList from "@/components/books/BookList.vue";
import BookService from "@/services/book.service";

export default {
  components: {
    InputSearch,
    CustomSelect,
    BookList,
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
      sortBy: "",
      order: "asc",
      sortOptions: [
        { value: "", label: "Mặc định" },
        { value: "tenSach", label: "Tên sách" },
      ],
      allGenres: [],
      selectedGenres: [],
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
    sortBy() {
      this.retrieveBooks();
    },
    order() {
      this.retrieveBooks();
    },
    selectedGenres: {
      handler() {
        this.activeIndex = -1;
      },
      deep: true,
    },
  },
  computed: {
    bookString() {
      return this.books.map((book) => {
        const { tenSach, tacGia } = book;
        return [tenSach, tacGia].join("").toLowerCase();
      });
    },
    filteredBooks() {
      let result = this.books;

      // Filter by genre
      if (this.selectedGenres.length > 0) {
        result = result.filter((book) =>
          this.selectedGenres.every((genre) =>
            book.theLoai && book.theLoai.includes(genre)
          )
        );
      }

      // Filter by search text
      if (!this.searchText) return result;
      return result.filter((_book, index) => {
        const bookIdx = this.books.indexOf(_book);
        return this.bookString[bookIdx].includes(this.searchText.toLowerCase());
      });
    },
    activeBook() {
      if (this.activeIndex < 0) return null;
      return this.filteredBooks[this.activeIndex];
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
    },
    availableGenres() {
      const genres = new Set();
      this.books.forEach((book) => {
        if (book.theLoai && Array.isArray(book.theLoai)) {
          book.theLoai.forEach((genre) => genres.add(genre));
        }
      });
      return Array.from(genres).sort();
    },
  },
  methods: {
    toggleOrder() {
      this.order = this.order === "asc" ? "desc" : "asc";
      this.retrieveBooks();
    },
    async retrieveBooks() {
      try {
        this.books = await BookService.getAll({
          sortBy: this.sortBy,
          order: this.order,
        });
      } catch (error) {
        console.error(error);
      }
    },
    selectGenre(genre) {
      if (genre === null) {
        // "Tất cả" button clicked
        this.selectedGenres = [];
      } else if (this.selectedGenres.includes(genre)) {
        // Deselect if already selected
        this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
      } else {
        // Select genre
        this.selectedGenres.push(genre);
      }
    },
    removeGenre(genre) {
      this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
    },
    refreshList() {
      this.retrieveBooks();
      this.activeIndex = -1;
    },
    async removeAllBooks() {
      if (confirm("Bạn muốn xóa tất cả Sách?")) {
        try {
          await BookService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.error(error);
        }
      }
    },
    goToAddBook() {
      this.$router.push({ name: "books.add" });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  max-width: 1400px;
}

.page-header {
  background: linear-gradient(135deg, #0891b2, #06b6d4);
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

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 18px;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.toolbar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  position: sticky;
  top: 80px;
  z-index: 100;
}

.toolbar-left {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-order-btn {
  width: 42px;
  height: 42px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.sort-order-btn:hover {
  border-color: #4361ee;
  color: #4361ee;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.refresh {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.refresh:hover {
  background: #e5e7eb;
}

.action-btn.add {
  background: linear-gradient(135deg, #4361ee, #3f51b5);
  color: white;
}

.action-btn.add:hover {
  background: linear-gradient(135deg, #3f4fd9, #3845a3);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fecaca;
}

/* Genre Filter Styles */
.genre-filter-section {
  margin: 0 0 20px 0;
  background: white;
  border-radius: 12px;
  padding: 15px 20px;
  border: 1px solid #e5e7eb;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.filter-label i {
  color: #4361ee;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.genre-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 2px solid #d1d5db;
  border-radius: 20px;
  background: white;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.genre-tag:hover {
  border-color: #4361ee;
  color: #4361ee;
  background: #f0f4ff;
}

.genre-tag.active {
  background: linear-gradient(135deg, #4361ee, #3f51b5);
  color: white;
  border-color: #4361ee;
}

.genre-tag.active:hover {
  background: linear-gradient(135deg, #3f4fd9, #3845a3);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.genre-tag i {
  font-size: 0.7rem;
  opacity: 0.8;
}

.genre-tag.active i {
  cursor: pointer;
}

.genre-tag.active i:hover {
  opacity: 1;
}
.action-btn.add {
  background: linear-gradient(135deg, #06d6a0, #05b384);
  color: white;
}

.action-btn.add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 214, 160, 0.4);
}

.action-btn.delete {
  background: linear-gradient(135deg, #ef476f, #dc3856);
  color: white;
}

.action-btn.delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 71, 111, 0.4);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-state h4 {
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 24px 0;
}
</style>
