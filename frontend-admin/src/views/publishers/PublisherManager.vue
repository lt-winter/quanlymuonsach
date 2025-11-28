<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">
          <i class="fas fa-building"></i>
          Quản lý Nhà xuất bản
        </h2>
        <p class="page-subtitle">Quản lý thông tin các nhà xuất bản</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredPublishersCount }}</span>
          <span class="stat-label">Nhà xuất bản</span>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <InputSearch
          v-model="searchText"
          placeholder="Tìm kiếm nhà xuất bản..."
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
          <button class="action-btn add" @click="goToAddPublisher">
            <i class="fas fa-plus"></i>
            Thêm mới
          </button>
          <button class="action-btn delete" @click="removeAllPublishers">
            <i class="fas fa-trash"></i>
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="list-section">
        <PublisherList
          v-if="filteredPublishersCount > 0"
          :publishers="filteredPublishers"
          v-model:activeIndex="activeIndex"
        />
        <div v-else class="empty-state">
          <i class="fas fa-building"></i>
          <h4>Không có nhà xuất bản nào</h4>
        </div>
      </div>

      <div class="detail-section" v-if="activePublisher">
        <div class="detail-header">
          <h4>
            <i class="fas fa-info-circle"></i>
            Chi tiết Nhà xuất bản
          </h4>
          <router-link
            :to="{
              name: 'publishers.edit',
              params: { id: activePublisher._id },
            }"
            class="edit-link"
          >
            <i class="fas fa-edit"></i>
            Hiệu chỉnh
          </router-link>
        </div>
        <PublisherCard :publisher="activePublisher" />
      </div>
    </div>
  </div>
</template>

<script>
import PublisherCard from "@/components/publishers/PublisherCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import PublisherList from "@/components/publishers/PublisherList.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherCard,
    InputSearch,
    CustomSelect,
    PublisherList,
  },
  data() {
    return {
      publishers: [],
      activeIndex: -1,
      searchText: "",
      sortBy: "",
      order: "asc",
      sortOptions: [
        { value: "", label: "Mặc định" },
        { value: "tenNXB", label: "Tên NXB" },
      ],
    };
  },
  watch: {
    searchText() {
      this.activeIndex = -1;
    },
    sortBy() {
      this.retrievePublishers();
    },
    order() {
      this.retrievePublishers();
    },
  },
  computed: {
    publisherString() {
      return this.publishers.map((publisher) => {
        const { tenNXB, diaChi } = publisher;
        return [tenNXB, diaChi].join("").toLowerCase();
      });
    },
    filteredPublishers() {
      if (!this.searchText) return this.publishers;
      return this.publishers.filter((_publisher, index) =>
        this.publisherString[index].includes(this.searchText.toLowerCase())
      );
    },
    activePublisher() {
      if (this.activeIndex < 0) return null;
      return this.filteredPublishers[this.activeIndex];
    },
    filteredPublishersCount() {
      return this.filteredPublishers.length;
    },
  },
  methods: {
    toggleOrder() {
      this.order = this.order === "asc" ? "desc" : "asc";
      this.retrievePublishers();
    },
    async retrievePublishers() {
      try {
        this.publishers = await PublisherService.getAll({
          sortBy: this.sortBy,
          order: this.order,
        });
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrievePublishers();
      this.activeIndex = -1;
    },
    async removeAllPublishers() {
      if (confirm("Bạn muốn xóa tất cả Nhà xuất bản?")) {
        try {
          await PublisherService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddPublisher() {
      this.$router.push({ name: "publishers.add" });
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
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  position: sticky;
  top: 80px;
  z-index: 100;
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
  border-color: #7209b7;
  color: #7209b7;
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
  background: linear-gradient(135deg, #06d6a0, #05b384);
  color: white;
}

.action-btn.add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 214, 160, 0.4);
}

.action-btn.delete {
  background: linear-gradient(135deg, #ef476f, #dc3856);
  color: white;
}

.action-btn.delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 71, 111, 0.4);
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
  top: 210px;
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
  color: #7209b7;
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
