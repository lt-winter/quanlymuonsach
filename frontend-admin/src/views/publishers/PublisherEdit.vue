<template>
  <div v-if="publisher" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'publishers' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Hiệu chỉnh Nhà xuất bản</h4>
    </div>
    <PublisherForm
      :publisher="publisher"
      @submit:publisher="updatePublisher"
      @delete:publisher="deletePublisher"
    />

    <div class="d-flex mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success mr-3" role="alert">
        <p class="text-success m-0 font-weight-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'publishers' }">
        <span v-if="message" class="badge badge-primary">
          Trở về trang chủ
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import PublisherForm from "@/components/publishers/PublisherForm.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      publisher: null,
      message: "",
    };
  },
  methods: {
    async getPublisher(id) {
      try {
        const publisher = await PublisherService.get(id);
        this.publisher = publisher;
      } catch (error) {
        console.error("Lỗi lấy nhà xuất bản:", error);
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

    async updatePublisher(data) {
      try {
        await PublisherService.update(this.publisher._id, data);
        this.message = "Nhà xuất bản được cập nhật thành công.";
      } catch (error) {
        console.error("Lỗi cập nhật nhà xuất bản:", error);
      }
    },

    async deletePublisher() {
      if (confirm("Bạn muốn xóa Nhà xuất bản này?")) {
        try {
          await PublisherService.delete(this.publisher._id);
          alert("Xoá nhà xuất bản thành công");
          this.$router.push({ name: "publishers" });
        } catch (error) {
          console.error("Lỗi xoá nhà xuất bản:", error);
        }
      }
    },
  },
  created() {
    this.getPublisher(this.id);
    this.message = "";
  },
};
</script>
