<template>
  <div v-if="reader" class="page">
    <h4>Thêm Độc giả</h4>
    <ReaderForm :reader="reader" @submit:reader="addReader" />

    <div class="d-flex gap-3 mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success" role="alert">
        <p class="text-success m-0 fw-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'readers' }">
        <span v-if="message" class="badge text-bg-primary">
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
  created() {},
};
</script>
