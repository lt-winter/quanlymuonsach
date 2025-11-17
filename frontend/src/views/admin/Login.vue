<template>
  <div>
    <h3 class="text-center mb-4">Đăng nhập hệ thống</h3>

    <Form :validation-schema="schema" @submit="handleLogin">
      <div class="mb-3">
        <label class="form-label">Tên người dùng</label>
        <Field name="username" class="form-control" />
        <ErrorMessage name="username" class="text-danger small" />
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
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import EmployeeService from "@/services/employee.service";

export default {
  components: { Form, Field, ErrorMessage },

  data() {
    return {
      loading: false,
      error: "",
      schema: Yup.object({
        username: Yup.string().required("Vui lòng nhập tên người dùng"),
        password: Yup.string().required("Vui lòng nhập mật khẩu"),
      }),
    };
  },

  methods: {
    async handleLogin(values) {
      this.loading = true;
      this.error = "";

      try {
        const res = await EmployeeService.login(values);

        if (!res || !res.user) {
          this.error = res?.message || "Sai tên người dùng hoặc mật khẩu";
          return;
        }

        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);

        this.$router.push("/admin");
      } catch (err) {
        console.error("Login error:", err);
        // axios error format
        const serverMessage = err?.response?.data?.message || err?.message;
        this.error = serverMessage || "Đã xảy ra lỗi khi đăng nhập";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
