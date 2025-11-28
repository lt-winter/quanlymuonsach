<template>
  <div v-if="employee" class="page">
    <h4>Chỉnh sửa thông tin Nhân viên</h4>
    <EmployeeForm
      :employee="employee"
      :isEdit="true"
      @submit:employee="updateEmployee"
      @delete:employee="deleteEmployee"
    />

    <div class="d-flex gap-3 mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success" role="alert">
        <p class="text-success m-0 fw-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'employees' }">
        <span v-if="message" class="badge text-bg-primary">
          Trở về trang chủ
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import EmployeeForm from "@/components/employees/EmployeeForm.vue";
import EmployeeService from "@/services/employee.service";

export default {
  components: {
    EmployeeForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      employee: null,
      message: "",
    };
  },
  methods: {
    async getEmployee(id) {
      try {
        const employee = await EmployeeService.get(id);
        this.employee = {
          ...employee,
          ngaySinh: this.formatDate(employee.ngaySinh),
        };
      } catch (error) {
        console.error("Lỗi lấy nhân viên:", error);
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },

    async updateEmployee(data) {
      try {
        await EmployeeService.update(this.employee._id, data);
        this.message = "Nhân viên được cập nhật thành công.";
      } catch (error) {
        console.error("Lỗi cập nhật nhân viên:", error);
      }
    },

    async deleteEmployee() {
      if (confirm("Bạn muốn xóa Nhân viên này?")) {
        try {
          await EmployeeService.delete(this.employee._id);
          alert("Xoá nhân viên thành công");
          this.$router.push({ name: "employees" });
        } catch (error) {
          console.error("Lỗi xoá nhân viên:", error);
        }
      }
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const res = `${d.getFullYear()}-${month}-${day}`;
      return res;
    },
  },
  created() {
    this.getEmployee(this.id);
    this.message = "";
  },
};
</script>
