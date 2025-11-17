<template>
  <div v-if="employee" class="page">
    <h4>Thêm Nhân viên</h4>
    <EmployeeForm :employee="employee" @submit:employee="addEmployee" />

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
import EmployeeForm from "@/components/admin/employees/EmployeeForm.vue";
import EmployeeService from "@/services/employee.service";

export default {
  components: {
    EmployeeForm,
  },
  data() {
    return {
      employee: {},
      message: "",
    };
  },
  methods: {
    async addEmployee(data) {
      try {
        await EmployeeService.create(data);
        this.$router.push({ name: "employees" });
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {},
};
</script>

<style scoped>
.page {
  max-width: 576px;
}
</style>
