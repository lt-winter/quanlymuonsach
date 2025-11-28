<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <div class="mt-3 col-md-8">
      <div class="d-flex justify-content-between align-items-center">
        <h4>
          Danh sách Nhân viên
          <i class="fas fa-address-book"></i>
        </h4>
        <div class="d-flex align-items-center m-4">
          <span class="fw-bold mx-4">Sắp xếp: </span>

          <select
            v-model="sortBy"
            class="form-select form-select-sm w-auto mx-4"
          >
            <option value="">Mặc định</option>
            <option value="hoTenNv">Tên Nhân viên</option>
          </select>

          <button
            class="btn btn-outline-secondary btn-sm d-flex align-items-center"
            @click="toggleOrder"
          >
            <i
              :class="
                order === 'asc'
                  ? 'fas fa-sort-amount-up'
                  : 'fas fa-sort-amount-down'
              "
            ></i>
          </button>
        </div>
      </div>

      <EmployeeList
        v-if="filteredEmployeesCount > 0"
        :employees="filteredEmployees"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có nhân viên nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddEmployee">
          <i class="fas fa-plus"></i> Thêm mới
        </button>

        <div>
          <p>Tổng số nhân viên: {{ filteredEmployeesCount }}</p>
        </div>
      </div>
    </div>
    <div class="mt-3 col-md-4">
      <div v-if="activeEmployee">
        <h4>
          Chi tiết Nhân viên
          <i class="fas fa-address-card"></i>
        </h4>
        <EmployeeCard :employee="activeEmployee" />
        <router-link
          :to="{
            name: 'employees.edit',
            params: { id: activeEmployee._id },
          }"
        >
          <span class="mt-2 badge badge-warning">
            <i class="fas fa-edit"></i> Hiệu chỉnh</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeCard from "@/components/employees/EmployeeCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import EmployeeList from "@/components/employees/EmployeeList.vue";
import EmployeeService from "@/services/employee.service";

export default {
  components: {
    EmployeeCard,
    InputSearch,
    EmployeeList,
  },
  data() {
    return {
      employees: [],
      activeIndex: -1,
      searchText: "",
      sortBy: "",
      order: "asc",
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
    sortBy() {
      this.retrieveEmployees();
    },
    order() {
      this.retrieveEmployees();
    },
  },
  computed: {
    employeeString() {
      return this.employees.map((employee) => {
        const { hoTenNv, chucVu, diaChi, soDienThoai, tenNguoiDung } = employee;
        return [hoTenNv, chucVu, diaChi, soDienThoai, tenNguoiDung]
          .join("")
          .toLowerCase();
      });
    },
    filteredEmployees() {
      if (!this.searchText) return this.employees;
      return this.employees.filter((_employee, index) =>
        this.employeeString[index].includes(this.searchText.toLowerCase())
      );
    },
    activeEmployee() {
      if (this.activeIndex < 0) return null;
      return this.filteredEmployees[this.activeIndex];
    },
    filteredEmployeesCount() {
      return this.filteredEmployees.length;
    },
  },
  methods: {
    async retrieveEmployees() {
      try {
        this.employees = await EmployeeService.getAll({
          sortBy: this.sortBy,
          order: this.order,
        });
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveEmployees();
      this.activeIndex = -1;
    },
    goToAddEmployee() {
      this.$router.push({ name: "employees.add" });
    },
    toggleOrder() {
      this.order = this.order === "asc" ? "desc" : "asc";
      this.refreshList();
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>
