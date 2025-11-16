<template>
  <div v-if="book" class="page">
    <h4>Thêm Sách</h4>
    <BookForm :book="book" @submit:book="addBook" />

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

export default {
  components: {
    BookForm,
  },
  data() {
    return {
      book: {
        tenSach: "",
        donGia: "",
        soQuyen: "",
        namXuatBan: "",
        maNXB: "",
        tacGia: "",
      },
      message: "",
    };
  },
  methods: {
    async addBook(data) {
      try {
        await BookService.create(data);
        this.$router.push({ name: "books" });
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {},
};
</script>

<style scoped>
.page {
  max-width: 576px;
  margin: auto;
}
</style>
