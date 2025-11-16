<template>
  <div v-if="book" class="page">
    <h4>Chỉnh sửa Sách</h4>
    <BookForm
      :book="book"
      @submit:book="updateBook"
      @delete:book="deleteBook"
    />

    <div class="d-flex gap-3 mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success" role="alert">
        <p class="text-success m-0 fw-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'books' }">
        <span v-if="message" class="badge text-bg-primary">
          Trở về trang chủ
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import BookForm from "@/components/admin/books/BookForm.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    BookForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      book: {},
      message: "",
    };
  },
  methods: {
    async getBook(id) {
      try {
        const book = await BookService.get(id);

        if (book.maNXB) {
          try {
            const pub = await PublisherService.get(book.maNXB);
            if (pub) {
              book.nhaXuatBan = pub._id;
            }
          } catch (err) {
            console.warn("Không tìm thấy nhà xuất bản:", err);
            book.nhaXuatBan = "";
          }
        }
        this.book = book;
      } catch (error) {
        console.error("Lỗi lấy sách:", error);
        // Điều hướng đến NotFound nếu không tìm thấy
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    async updateBook(bookData) {
      try {
        await BookService.update(this.id, bookData);
        this.message = "Cập nhật sách thành công!";
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook() {
      if (confirm("Bạn có chắc muốn xoá sách này không?")) {
        try {
          await BookService.delete(this.book._id);
          this.$router.push({ name: "books" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    this.getBook(this.id);
    this.message = "";
  },
};
</script>

<style scoped>
.page {
  max-width: 576px;
  margin: auto;
}
</style>
