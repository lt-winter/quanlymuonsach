<template>
  <div v-if="reader" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'readers' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Hiệu chỉnh Độc giả</h4>
    </div>
    <ReaderForm
      :reader="reader"
      @submit:reader="updateReader"
      @delete:reader="deleteReader"
    />

    <div class="d-flex mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success mr-3" role="alert">
        <p class="text-success m-0 font-weight-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'readers' }">
        <span v-if="message" class="badge badge-primary">
          Trở về trang chủ
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import ReaderForm from "@/components/readers/ReaderForm.vue";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    ReaderForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      reader: null,
      message: "",
    };
  },
  methods: {
    async getReader(id) {
      try {
        const reader = await ReaderService.get(id);
        this.reader = {
          ...reader,
          ngaySinh: this.formatDate(reader.ngaySinh),
        };
      } catch (error) {
        console.error("Lỗi lấy độc giả:", error);
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

    async updateReader(data) {
      try {
        await ReaderService.update(this.reader.maDocGia, data);
        this.message = "Độc giả được cập nhật thành công.";
      } catch (error) {
        console.error("Lỗi cập nhật độc giả:", error);
      }
    },

    async deleteReader() {
      if (confirm("Bạn muốn xóa Độc giả này?")) {
        try {
          await ReaderService.delete(this.reader.maDocGia);
          alert("Xoá độc giả thành công");
          this.$router.push({ name: "readers" });
        } catch (error) {
          console.error("Lỗi xoá độc giả:", error);
        }
      }
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const res = `${d.getFullYear()}-${month}-${day}`;
      return res;
    },
  },
  created() {
    this.getReader(this.id);
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
