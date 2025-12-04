<template>
  <div v-if="book" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'books' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Chỉnh sửa Sách</h4>
    </div>
    <BookForm
      :book="book"
      @submit:book="updateBook"
      @delete:book="deleteBook"
    />

    <div class="d-flex mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success mr-3" role="alert">
        <p class="text-success m-0 font-weight-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'books' }">
        <span v-if="message" class="badge badge-primary">
          Trở về trang chủ
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import BookForm from "@/components/books/BookForm.vue";
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
              book.maNXB = pub._id;
            }
          } catch (err) {
            console.warn("Không tìm thấy nhà xuất bản:", err);
            book.maNXB = "";
          }
        }
        this.book = book;
      } catch (error) {
        console.error("Lỗi lấy sách:", error);
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
        console.error(error);
      }
    },
    async deleteBook() {
      if (confirm("Bạn có chắc muốn xoá sách này không?")) {
        try {
          await BookService.delete(this.book.maSach);
          this.$router.push({ name: "books" });
        } catch (error) {
          console.error(error);
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
