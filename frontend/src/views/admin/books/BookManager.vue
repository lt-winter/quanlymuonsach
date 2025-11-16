<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <div class="mt-3 col-md-12">
      <div class="d-flex justify-content-between align-items-center">
        <h4>
          Quản lý Sách
          <i class="fas fa-book"></i>
        </h4>

        <div class="d-flex align-items-center m-4">
          <span class="fw-bold mx-4">Sắp xếp: </span>

          <!-- Chọn danh mục sắp xếp -->
          <select
            v-model="sortBy"
            class="form-select form-select-sm w-auto mx-4"
          >
            <option value="">Mặc định</option>
            <option value="tenSach">Tên</option>
          </select>

          <!-- Nút đổi thứ tự sắp xếp -->
          <button
            class="btn btn-outline-secondary btn-sm d-flex align-items-center"
            @click="toggleOrder"
          >
            <i
              :class="
                order === 'asc'
                  ? 'fas fa-sort-amount-up'
                  : 'fas fa-sort-amount-down'
              "
            ></i>
          </button>
        </div>
      </div>
      <div class="my-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddBook">
          <i class="fas fa-plus"></i> Thêm mới
        </button>

        <button class="btn btn-sm btn-danger" @click="removeAllBooks">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
      <BookList
        v-if="filteredBooksCount > 0"
        :books="filteredBooks"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có sách nào.</p>
    </div>
  </div>
</template>

<script>
import InputSearch from "@/components/admin/InputSearch.vue";
import BookList from "@/components/admin/books/BookList.vue";
import BookService from "@/services/book.service";

export default {
  components: {
    InputSearch,
    BookList,
  },
  data() {
    return {
      books: [],
      activeIndex: -1,
      searchText: "",
      sortBy: "",
      order: "asc",
    };
  },
  watch: {
    // Giám sát các thay đổi của biến searchText.
    // Bỏ chọn phần tử đang được chọn trong danh sách.
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
    // Chuyển các đối tượng độc giả thành chuỗi để tiện cho tìm kiếm.
    bookString() {
      return this.books.map((book) => {
        const { tenSach } = book;
        return [tenSach].join("").toLowerCase();
      });
    },
    // Trả về các độc giả có chứa thông tin cần tìm kiếm.
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
      if (confirm("Bạn muốn xóa tất cả Độc giả?")) {
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
page {
  width: 100%;
  max-width: 1024px;
}
</style>
