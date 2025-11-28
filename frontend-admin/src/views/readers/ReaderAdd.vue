<template>
  <div v-if="reader" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'readers' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Thêm Độc giả</h4>
    </div>
    <ReaderForm :reader="reader" @submit:reader="addReader" />

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
  data() {
    return {
      reader: {},
      message: "",
    };
  },
  methods: {
    async addReader(data) {
      try {
        await ReaderService.create(data);
        this.$router.push({ name: "readers" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
