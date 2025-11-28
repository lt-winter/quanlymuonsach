<template>
  <div v-if="publisher" class="page">
    <h4>Thêm Nhà xuất bản</h4>
    <PublisherForm :publisher="publisher" @submit:publisher="addPublisher" />

    <div class="d-flex gap-3 mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success" role="alert">
        <p class="text-success m-0 fw-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'publishers' }">
        <span v-if="message" class="badge text-bg-primary">
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
  data() {
    return {
      publisher: {},
      message: "",
    };
  },
  methods: {
    async addPublisher(data) {
      try {
        await PublisherService.create(data);
        this.$router.push({ name: "publishers" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
