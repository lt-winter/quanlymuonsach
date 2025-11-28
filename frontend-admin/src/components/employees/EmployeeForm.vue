<template>
  <Form
    @submit="submitEmployee"
    :validation-schema="employeeFormSchema"
    :validation-schema-params="{ changePassword }"
  >
    <div class="form-group">
      <label for="hoTenNv">Họ tên nhân viên</label>
      <Field
        name="hoTenNv"
        type="text"
        class="form-control"
        v-model="employeeLocal.hoTenNv"
      />
      <ErrorMessage name="hoTenNv" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="chucVu">Chức vụ</label>
      <Field
        name="chucVu"
        type="text"
        class="form-control"
        v-model="employeeLocal.chucVu"
      />
      <ErrorMessage name="chucVu" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="diaChi">Địa chỉ</label>
      <Field
        name="diaChi"
        type="text"
        class="form-control"
        v-model="employeeLocal.diaChi"
      />
      <ErrorMessage name="diaChi" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="soDienThoai">Số điện thoại</label>
      <Field
        name="soDienThoai"
        type="tel"
        class="form-control"
        v-model="employeeLocal.soDienThoai"
      />
      <ErrorMessage name="soDienThoai" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="tenNguoiDung">Tên người dùng</label>
      <Field
        name="tenNguoiDung"
        type="text"
        class="form-control"
        v-model="employeeLocal.tenNguoiDung"
      />
      <ErrorMessage name="tenNguoiDung" class="error-feedback" />
    </div>

    <div class="form-group" v-if="!isEdit">
      <label for="matKhau">Mật khẩu</label>
      <Field
        name="matKhau"
        type="password"
        class="form-control"
        v-model="employeeLocal.matKhau"
      />
      <ErrorMessage name="matKhau" class="error-feedback" />
    </div>

    <div class="form-check mt-3" v-if="isEdit">
      <input
        type="checkbox"
        class="form-check-input"
        id="changePassword"
        v-model="changePassword"
      />
      <label for="changePassword" class="form-check-label">
        Đổi mật khẩu
      </label>
    </div>

    <div v-if="isEdit && changePassword" class="mt-3">
      <div class="form-group">
        <label>Mật khẩu mới</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>

      <div class="form-group mt-2">
        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          class="form-control"
          v-model="confirmPassword"
          required
        />
      </div>

      <p v-if="passwordMismatch" class="text-danger mt-2">
        Mật khẩu xác nhận không khớp
      </p>
    </div>

    <div class="form-group d-flex gap-3 mt-3">
      <button class="btn btn-primary">
        <i class="fa-solid fa-floppy-disk"></i> Lưu
      </button>
      <button
        v-if="employeeLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteEmployee"
      >
        <i class="fa-solid fa-trash"></i> Xoá
      </button>
    </div>
  </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:employee", "delete:employee"],
  props: {
    employee: { type: Object, required: true },
    isEdit: Boolean,
  },
  data() {
    const employeeFormSchema = yup.object().shape({
      hoTenNv: yup
        .string()
        .required("Họ và tên lót phải có giá trị.")
        .min(2, "Họ và tên lót phải ít nhất 2 ký tự.")
        .max(50, "Họ và tên lót có nhiều nhất 50 ký tự."),
      tenNguoiDung: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      matKhau: this.isEdit
        ? yup.string().notRequired()
        : yup
            .string()
            .required("Mật khẩu phải có giá trị.")
            .min(6, "Mật khẩu phải ít nhất 6 ký tự.")
            .max(100, "Mật khẩu có nhiều nhất 100 ký tự.")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt."
            ),
      chucVu: yup
        .string()
        .required("Chức vụ phải có giá trị.")
        .max(50, "Chức vụ có nhiều nhất 50 ký tự."),
      diaChi: yup
        .string()
        .required("Địa chỉ phải có giá trị")
        .max(100, "Địa chỉ tối đa 100 ký tự."),
      soDienThoai: yup
        .string()
        .required("Số điện thoại phải có giá trị.")
        .matches(
          /((09|03|07|08|05)+([0-9]{8})\b)/g,
          "Số điện thoại không hợp lệ."
        ),
      password: yup.string().when("$changePassword", {
        is: true,
        then: (schema) =>
          schema
            .required("Vui lòng nhập mật khẩu mới.")
            .min(6, "Mật khẩu phải ít nhất 6 ký tự.")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt."
            ),
        otherwise: (schema) => schema.notRequired(),
      }),

      confirmPassword: yup.string().when("password", {
        is: (val) => val && val.length > 0,
        then: (schema) =>
          schema
            .required("Vui lòng xác nhận mật khẩu.")
            .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp."),
        otherwise: (schema) => schema.notRequired(),
      }),
    });
    return {
      employeeLocal: { ...this.employee, vaiTro: "admin" },
      changePassword: false,
      password: "",
      confirmPassword: "",
      employeeFormSchema,
    };
  },
  computed: {
    passwordMismatch() {
      return (
        this.changePassword &&
        this.password &&
        this.password !== this.confirmPassword
      );
    },
  },
  methods: {
    submitEmployee() {
      if (this.passwordMismatch) return;

      const payload = { ...this.employeeLocal };

      if (this.isEdit && this.changePassword) payload.matKhau = this.password;

      if (!this.changePassword) delete payload.matKhau;

      this.$emit("submit:employee", payload);
    },
    deleteEmployee() {
      this.$emit("delete:employee", this.employeeLocal._id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
