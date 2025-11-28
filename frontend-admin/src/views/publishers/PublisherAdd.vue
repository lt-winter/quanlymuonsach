<template>
  <div v-if="publisher" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'publishers' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Thêm Nhà xuất bản</h4>
    </div>
    <PublisherForm :publisher="publisher" @submit:publisher="addPublisher" />

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
