<template>
  <div class="login-content">
    <div class="text-center mb-4">
      <h3 class="form-title">Đăng nhập</h3>
      <p class="text-muted">Chào mừng bạn quay trở lại!</p>
    </div>

    <Form :validation-schema="schema" @submit="handleLogin" class="login-form">
      <div class="form-group mb-3">
        <label class="form-label">Mã độc giả</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fas fa-id-card"></i></span>
          <Field
            name="maDocGia"
            class="form-control"
            placeholder="Nhập mã độc giả"
          />
        </div>
        <ErrorMessage name="maDocGia" class="error-feedback" />
      </div>

      <div class="form-group mb-4">
        <label class="form-label">Mật khẩu</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fas fa-lock"></i></span>
          <Field
            name="matKhau"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <ErrorMessage name="matKhau" class="error-feedback" />
      </div>

      <button class="btn btn-primary w-100 btn-login" :disabled="loading">
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
        ></span>
        {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
      </button>
    </Form>

    <div
      v-if="error"
      class="alert alert-danger mt-3 d-flex align-items-center"
      role="alert"
    >
      <i class="fas fa-exclamation-circle me-2"></i>
      <div>{{ error }}</div>
    </div>

    <div class="text-center mt-4 footer-text">
      Chưa có tài khoản?
      <router-link to="/register" class="register-link"
        >Đăng ký ngay</router-link
      >
    </div>
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
        maDocGia: Yup.string().required("Vui lòng nhập mã độc giả"),
        matKhau: Yup.string().required("Vui lòng nhập mật khẩu"),
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
          this.error = res?.message || "Sai mã độc giả hoặc mật khẩu";
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

<style scoped>
.form-title {
  font-weight: 700;
  color: #1f2937;
}

.input-group-text {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-right: none;
  color: #6b7280;
  width: 45px;
  justify-content: center;
}

.form-control {
  border: 1px solid #e5e7eb;
  border-left: none;
  padding: 10px 15px;
  font-size: 0.95rem;
}

.form-control:focus {
  box-shadow: none;
  border-color: #4361ee;
}

.input-group:focus-within .input-group-text {
  border-color: #4361ee;
  color: #4361ee;
  background-color: #eff6ff;
}

.btn-login {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  border: none;
  padding: 12px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  transform: none;
}

.register-link {
  color: #4361ee;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.register-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.error-feedback {
  color: #ef476f;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.footer-text {
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
