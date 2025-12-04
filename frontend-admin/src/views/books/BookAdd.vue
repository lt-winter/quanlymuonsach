<template>
  <div v-if="book" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'books' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Thêm Sách</h4>
    </div>
    <BookForm :book="book" @submit:book="addBook" />

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
        theLoai: [],
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
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 576px;
  margin: auto;
}
</style>
