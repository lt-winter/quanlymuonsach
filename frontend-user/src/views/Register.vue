<template>
  <div>
    <h3 class="text-center mb-4">Đăng ký tài khoản</h3>

    <Form :validation-schema="schema" @submit="handleRegister">
      <div class="mb-3">
        <label class="form-label">Họ và tên lót</label>
        <Field name="hoLot" class="form-control" />
        <ErrorMessage name="hoLot" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Tên</label>
        <Field name="ten" class="form-control" />
        <ErrorMessage name="ten" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Ngày sinh</label>
        <Field name="ngaySinh" type="date" class="form-control" />
        <ErrorMessage name="ngaySinh" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Phái</label>
        <Field name="phai" as="select" class="form-control">
          <option value="">-- Chọn phái --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </Field>
        <ErrorMessage name="phai" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <Field name="diaChi" class="form-control" />
        <ErrorMessage name="diaChi" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <Field name="dienThoai" class="form-control" />
        <ErrorMessage name="dienThoai" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <Field name="password" type="password" class="form-control" />
        <ErrorMessage name="password" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label class="form-label">Xác nhận mật khẩu</label>
        <Field name="confirmPassword" type="password" class="form-control" />
        <ErrorMessage name="confirmPassword" class="text-danger small" />
      </div>

      <button class="btn btn-primary w-100" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm"></span>
        Đăng ký
      </button>
    </Form>

    <p class="text-danger text-center mt-2">{{ error }}</p>
    <p class="text-success text-center mt-2">{{ success }}</p>

    <p class="text-center mt-3">
      Đã có tài khoản?
      <router-link to="/login">Đăng nhập</router-link>
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
      success: "",
      schema: Yup.object({
        hoLot: Yup.string().required("Vui lòng nhập họ và tên lót").min(2),
        ten: Yup.string().required("Vui lòng nhập tên").min(2),
        ngaySinh: Yup.date().required("Vui lòng nhập ngày sinh"),
        phai: Yup.string().required("Vui lòng chọn phái"),
        diaChi: Yup.string().required("Vui lòng nhập địa chỉ"),
        dienThoai: Yup.string()
          .required("Vui lòng nhập số điện thoại")
          .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ"),
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
        await ReaderService.register(values);
        this.success = "Đăng ký thành công! Vui lòng đăng nhập.";
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (err) {
        console.error("Register error:", err);
        const serverMessage = err?.response?.data?.message || err?.message;
        this.error = serverMessage || "Đã xảy ra lỗi khi đăng ký";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
