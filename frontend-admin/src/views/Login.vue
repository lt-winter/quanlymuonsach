<template>
  <div class="login-form">
    <h3 class="login-title">Đăng nhập</h3>
    <p class="login-subtitle">Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>

    <Form :validation-schema="schema" @submit="handleLogin">
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-user"></i>
          Tên người dùng
        </label>
        <Field 
          name="username" 
          class="form-control custom-input" 
          placeholder="Nhập tên người dùng"
        />
        <ErrorMessage name="username" class="error-message" />
      </div>

      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-lock"></i>
          Mật khẩu
        </label>
        <Field 
          name="password" 
          type="password" 
          class="form-control custom-input" 
          placeholder="Nhập mật khẩu"
        />
        <ErrorMessage name="password" class="error-message" />
      </div>

      <button class="login-btn" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm mr-2"></span>
        <i v-else class="fas fa-sign-in-alt mr-2"></i>
        Đăng nhập
      </button>
    </Form>

    <div v-if="error" class="error-alert">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>
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

        localStorage.setItem("admin_user", JSON.stringify(res.user));
        localStorage.setItem("admin_token", res.token);

        this.$router.push("/");
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
.login-form {
  text-align: center;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.form-label i {
  color: #4361ee;
  font-size: 0.85rem;
}

.custom-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.custom-input:focus {
  outline: none;
  border-color: #4361ee;
  background: white;
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.custom-input::placeholder {
  color: #9ca3af;
}

.error-message {
  color: #ef476f;
  font-size: 0.8rem;
  margin-top: 6px;
  display: block;
}

.login-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-alert {
  margin-top: 20px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #ef476f;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
