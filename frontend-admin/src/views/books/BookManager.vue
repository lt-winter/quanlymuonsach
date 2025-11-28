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
        <InputSearch v-model="searchText" placeholder="Tìm kiếm sách..." />
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

    <div class="content-area">
      <BookList
        v-if="filteredBooksCount > 0"
        :books="filteredBooks"
        v-model:activeIndex="activeIndex"
      />
      <div v-else class="empty-state">
        <i class="fas fa-book-open"></i>
        <h4>Không có sách nào</h4>
        <p>Bắt đầu bằng cách thêm sách mới vào thư viện</p>
        <button class="action-btn add" @click="goToAddBook">
          <i class="fas fa-plus"></i>
          Thêm sách mới
        </button>
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
  },
  computed: {
    bookString() {
      return this.books.map((book) => {
        const { tenSach } = book;
        return [tenSach].join("").toLowerCase();
      });
    },
    filteredBooks() {
      if (!this.searchText) return this.books;
      return this.books.filter((_book, index) =>
        this.bookString[index].includes(this.searchText.toLowerCase())
      );
    },
    activeBook() {
      if (this.activeIndex < 0) return null;
      return this.filteredBooks[this.activeIndex];
    },
    filteredBooksCount() {
      return this.filteredBooks.length;
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
        console.log(error);
      }
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
          console.log(error);
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
