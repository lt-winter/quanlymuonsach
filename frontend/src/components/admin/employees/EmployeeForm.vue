<template>
  <Form @submit="submitEmployee" :validation-schema="employeeFormSchema">
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

    <div class="form-group">
      <label for="matKhau">Mật khẩu</label>
      <Field
        name="matKhau"
        type="password"
        class="form-control"
        v-model="employeeLocal.matKhau"
      />
      <ErrorMessage name="matKhau" class="error-feedback" />
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
      matKhau: yup
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
    });
    return {
      employeeLocal: { ...this.employee, vaiTro: "admin" },
      employeeFormSchema,
    };
  },
  methods: {
    submitEmployee() {
      this.$emit("submit:employee", this.employeeLocal);
    },
    deleteEmployee() {
      this.$emit("delete:employee", this.employeeLocal.id);
    },
  },
};
</script>

<style scoped>
@import "@/assets/form.css";
</style>
