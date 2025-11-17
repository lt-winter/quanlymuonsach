<template>
  <div>
    <h3 class="mb-4">Tạo tài khoản nhân viên</h3>

    <Form :validation-schema="schema" @submit="createEmployee">
      <div class="mb-3">
        <label>Họ tên</label>
        <Field name="hoTenNv" class="form-control" />
        <ErrorMessage name="hoTenNv" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label>Username</label>
        <Field name="username" class="form-control" />
        <ErrorMessage name="username" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label>Mật khẩu</label>
        <Field name="password" type="password" class="form-control" />
        <ErrorMessage name="password" class="text-danger small" />
      </div>

      <div class="mb-3">
        <label>Số điện thoại</label>
        <Field name="soDienThoai" class="form-control" />
        <ErrorMessage name="soDienThoai" class="text-danger small" />
      </div>

      <button class="btn btn-success">Tạo nhân viên</button>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import EmployeeService from "@/services/employee.service";

export default {
  data() {
    return {
      schema: Yup.object({
        hoTenNv: Yup.string().required("Họ tên không được trống"),
        username: Yup.string().required("Username không được trống"),
        password: Yup.string()
          .min(6, "Mật khẩu ít nhất 6 ký tự")
          .required("Mật khẩu không được trống"),
        soDienThoai: Yup.string()
          .matches(/^[0-9]{10}$/, "Số điện thoại phải đủ 10 số")
          .required("Không được trống"),
      }),
    };
  },

  methods: {
    async createEmployee(values) {
      const token = localStorage.getItem("token");
      const payload = { ...values, role: "admin" };

      const res = await EmployeeService.createEmployee(payload, token);

      if (res.success === false) {
        alert("Không thể tạo nhân viên!");
        return;
      }

      alert("Tạo nhân viên thành công!");
      this.$router.push("/admin/employees");
    },
  },
};
</script>
