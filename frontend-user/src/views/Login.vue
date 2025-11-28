<template>
  <div>
    <h3 class="text-center mb-4">Đăng nhập</h3>

    <Form :validation-schema="schema" @submit="handleLogin">
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <Field name="dienThoai" class="form-control" />
        <ErrorMessage name="dienThoai" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label>Mật khẩu</label>
        <Field name="password" type="password" class="form-control" />
        <ErrorMessage name="password" class="text-danger small" />
      </div>

      <button class="btn btn-primary w-100" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
        Đăng nhập
      </button>
    </Form>

    <p class="text-danger text-center mt-2">{{ error }}</p>

    <p class="text-center mt-3">
      Chưa có tài khoản?
      <router-link to="/register">Đăng ký ngay</router-link>
    </p>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import ReaderService from "@/services/reader.service";

export default {
  components: { Form, Field, ErrorMessage },

  data() {
    return {
      loading: false,
      error: "",
      schema: Yup.object({
        dienThoai: Yup.string().required("Vui lòng nhập số điện thoại"),
        password: Yup.string().required("Vui lòng nhập mật khẩu"),
      }),
    };
  },

  methods: {
    async handleLogin(values) {
      this.loading = true;
      this.error = "";

      try {
        const res = await ReaderService.login(values);

        if (!res || !res.user) {
          this.error = res?.message || "Sai số điện thoại hoặc mật khẩu";
          return;
        }

        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);

        this.$router.push("/");
        // Reload để cập nhật header
        window.location.reload();
      } catch (err) {
        console.error("Login error:", err);
        const serverMessage = err?.response?.data?.message || err?.message;
        this.error = serverMessage || "Đã xảy ra lỗi khi đăng nhập";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
