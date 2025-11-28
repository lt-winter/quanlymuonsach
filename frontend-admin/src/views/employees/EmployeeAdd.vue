<template>
  <div v-if="employee" class="page">
    <div class="page-header-form">
      <router-link :to="{ name: 'employees' }" class="btn-back">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h4>Thêm Nhân viên</h4>
    </div>
    <EmployeeForm :employee="employee" @submit:employee="addEmployee" />

    <div class="d-flex mt-4 align-items-center justify-content-center">
      <div v-if="message" class="alert alert-success mr-3" role="alert">
        <p class="text-success m-0 font-weight-bold">{{ message }}</p>
      </div>

      <router-link :to="{ name: 'employees' }">
        <span v-if="message" class="badge badge-primary">
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
};
</script>

<style scoped>
.page {
  max-width: 576px;
}
</style>
