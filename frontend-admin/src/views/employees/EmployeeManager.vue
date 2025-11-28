<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-user-tie"></i>
          Quản lý Nhân viên
        </h2>
        <p class="page-subtitle">Quản lý thông tin nhân viên thư viện</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredEmployeesCount }}</span>
          <span class="stat-label">Nhân viên</span>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <InputSearch
          v-model="searchText"
          placeholder="Nhập thông tin nhân viên..."
        />
      </div>
      <div class="toolbar-right">
        <div class="sort-controls">
          <CustomSelect
            v-model="sortBy"
            :options="sortOptions"
            placeholder="Sắp xếp"
          />
          <button class="sort-order-btn" @click="toggleOrder">
            <i
              :class="
                order === 'asc'
                  ? 'fas fa-sort-amount-up'
                  : 'fas fa-sort-amount-down'
              "
            ></i>
          </button>
        </div>
        <div class="action-buttons">
          <button class="action-btn refresh" @click="refreshList()">
            <i class="fas fa-redo"></i>
            Làm mới
          </button>
          <button class="action-btn add" @click="goToAddEmployee">
            <i class="fas fa-plus"></i>
            Thêm mới
          </button>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="list-section">
        <EmployeeList
          v-if="filteredEmployeesCount > 0"
          :employees="filteredEmployees"
          v-model:activeIndex="activeIndex"
        />
        <div v-else class="empty-state">
          <i class="fas fa-user-slash"></i>
          <h4>Không có nhân viên nào</h4>
          <p>Bắt đầu bằng cách thêm nhân viên mới</p>
        </div>
      </div>

      <div class="detail-section" v-if="activeEmployee">
        <div class="detail-header">
          <h4>
            <i class="fas fa-id-card"></i>
            Chi tiết Nhân viên
          </h4>
          <router-link
            :to="{ name: 'employees.edit', params: { id: activeEmployee._id } }"
            class="edit-link"
          >
            <i class="fas fa-edit"></i>
            Hiệu chỉnh
          </router-link>
        </div>
        <EmployeeCard :employee="activeEmployee" />
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeCard from "@/components/employees/EmployeeCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import EmployeeList from "@/components/employees/EmployeeList.vue";
import EmployeeService from "@/services/employee.service";

export default {
  components: {
    EmployeeCard,
    InputSearch,
    CustomSelect,
    EmployeeList,
  },
  data() {
    return {
      employees: [],
      activeIndex: -1,
      searchText: "",
      sortBy: "",
      order: "asc",
      sortOptions: [
        { value: "", label: "Mặc định" },
        { value: "hoTenNv", label: "Tên nhân viên" },
      ],
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

<style scoped>
.page {
  max-width: 1400px;
}

.page-header {
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 16px;
  padding: 20px 28px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title i {
  background: rgba(255, 255, 255, 0.2);
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1rem;
}

.page-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 0.85rem;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 18px;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.toolbar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.toolbar-left {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-order-btn {
  width: 42px;
  height: 42px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.sort-order-btn:hover {
  border-color: #06d6a0;
  color: #06d6a0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.refresh {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.refresh:hover {
  background: #e5e7eb;
}

.action-btn.add {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  color: white;
}

.action-btn.add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.4);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.list-section {
  min-width: 0;
}

.detail-section {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.detail-header {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-header > i {
  color: #06d6a0;
}

.edit-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #ffd166, #f5c542);
  color: #1f2937;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.edit-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 209, 102, 0.4);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 20px;
}

.empty-state h4 {
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}
</style>
