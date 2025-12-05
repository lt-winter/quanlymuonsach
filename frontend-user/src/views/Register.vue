<template>
  <div class="register-content">
    <div class="text-center mb-4">
      <h3 class="form-title">Đăng ký tài khoản</h3>
      <p class="text-muted">Trở thành thành viên của thư viện ngay hôm nay</p>
    </div>

    <Form
      :validation-schema="schema"
      @submit="handleRegister"
      class="register-form"
    >
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Họ và tên lót</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-user"></i></span>
            <Field
              name="hoLot"
              class="form-control"
              placeholder="Họ và tên lót"
            />
          </div>
          <ErrorMessage name="hoLot" class="error-feedback" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên</label>
          <div class="input-group">
            <span class="input-group-text"
              ><i class="fas fa-signature"></i
            ></span>
            <Field name="ten" class="form-control" placeholder="Tên" />
          </div>
          <ErrorMessage name="ten" class="error-feedback" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Ngày sinh</label>
          <div class="input-group">
            <span class="input-group-text"
              ><i class="fas fa-calendar-alt"></i
            ></span>
            <Field name="ngaySinh" type="date" class="form-control" />
          </div>
          <ErrorMessage name="ngaySinh" class="error-feedback" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Phái</label>
          <Field name="phai" v-slot="{ field, errorMessage }">
            <CustomSelect
              v-bind="field"
              v-model="field.value"
              :options="phaiOptions"
              placeholder="Chọn phái"
              :class="{ 'is-invalid': errorMessage }"
            />
          </Field>
          <ErrorMessage name="phai" class="error-feedback" />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <div class="input-group">
          <span class="input-group-text"
            ><i class="fas fa-map-marker-alt"></i
          ></span>
          <Field
            name="diaChi"
            class="form-control"
            placeholder="Nhập địa chỉ đầy đủ"
          />
        </div>
        <ErrorMessage name="diaChi" class="error-feedback" />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <div class="input-group">
          <span class="input-group-text"><i class="fas fa-phone"></i></span>
          <Field
            name="dienThoai"
            class="form-control"
            placeholder="Nhập số điện thoại"
          />
        </div>
        <ErrorMessage name="dienThoai" class="error-feedback" />
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Mật khẩu</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-lock"></i></span>
            <Field
              name="password"
              type="password"
              class="form-control"
              placeholder="Mật khẩu"
            />
          </div>
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Xác nhận</label>
          <div class="input-group">
            <span class="input-group-text"
              ><i class="fas fa-check-circle"></i
            ></span>
            <Field
              name="confirmPassword"
              type="password"
              class="form-control"
              placeholder="Nhập lại"
            />
          </div>
          <ErrorMessage name="confirmPassword" class="error-feedback" />
        </div>
      </div>

      <button
        class="btn btn-primary w-100 btn-register mt-2"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
        ></span>
        {{ loading ? "Đang đăng ký..." : "Đăng ký tài khoản" }}
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

    <div
      v-if="success"
      class="alert alert-success mt-3 d-flex align-items-center"
      role="alert"
    >
      <i class="fas fa-check-circle me-2"></i>
      <div>{{ success }}</div>
    </div>

    <div class="text-center mt-4 footer-text">
      Đã có tài khoản?
      <router-link to="/login" class="login-link">Đăng nhập</router-link>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import ReaderService from "@/services/reader.service";
import CustomSelect from "@/components/CustomSelect.vue";

export default {
  components: { Form, Field, ErrorMessage, CustomSelect },

  data() {
    return {
      loading: false,
      error: "",
      success: "",
      phaiOptions: [
        { value: "Nam", label: "Nam" },
        { value: "Nữ", label: "Nữ" },
        { value: "Khác", label: "Khác" },
      ],
      schema: Yup.object({
        hoLot: Yup.string().required("Vui lòng nhập họ và tên lót").min(2),
        ten: Yup.string().required("Vui lòng nhập tên").min(2),
        ngaySinh: Yup.date().required("Vui lòng nhập ngày sinh"),
        phai: Yup.string().required("Vui lòng chọn phái"),
        diaChi: Yup.string().required("Vui lòng nhập địa chỉ"),
        dienThoai: Yup.string()
          .required("Vui lòng nhập số điện thoại")
          .matches(
            /((09|03|07|08|05)+([0-9]{8})\b)/g,
            "Số điện thoại không hợp lệ"
          ),
        password: Yup.string()
          .required("Vui lòng nhập mật khẩu")
          .min(6, "Mật khẩu ít nhất 6 ký tự"),
        confirmPassword: Yup.string()
          .required("Vui lòng xác nhận mật khẩu")
          .oneOf([Yup.ref("password")], "Mật khẩu không khớp"),
      }),
    };
  },

  methods: {
    async handleRegister(values) {
      this.loading = true;
      this.error = "";
      this.success = "";

      try {
        // Chuyển đổi password -> matKhau cho backend
        const payload = {
          ...values,
          matKhau: values.password,
        };
        delete payload.password;
        delete payload.confirmPassword;

        const response = await ReaderService.register(payload);
        
        // Lưu token và user vào localStorage
        if (response.token && response.user) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          
          // Hiển thị thông báo thành công với mã độc giả
          this.success = `Đăng ký thành công! Mã độc giả của bạn là: ${response.user.maDocGia}. Vui lòng lưu lại để đăng nhập lần sau.`;
          
          // Chuyển về trang chủ sau 3 giây
          setTimeout(() => {
            this.$router.push("/");
          }, 3000);
        }
      } catch (err) {
        const serverMessage = err?.response?.data?.message || err?.message;
        this.error = serverMessage || "Đã xảy ra lỗi khi đăng ký";
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

.btn-register {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  border: none;
  padding: 12px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-register:disabled {
  opacity: 0.7;
  transform: none;
}

.login-link {
  color: #4361ee;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link:hover {
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
