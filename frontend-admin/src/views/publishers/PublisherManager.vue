<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <div class="mt-3 col-md-8">
      <div class="d-flex justify-content-between align-items-center">
        <h4>
          Danh sách Nhà xuất bản
          <i class="fas fa-address-book"></i>
        </h4>

        <div class="d-flex align-items-center m-4">
          <span class="fw-bold mx-4">Sắp xếp: </span>

          <select
            v-model="sortBy"
            class="form-select form-select-sm w-auto mx-4"
          >
            <option value="">Mặc định</option>
            <option value="tenNXB">Tên</option>
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
      <PublisherList
        v-if="filteredPublishersCount > 0"
        :publishers="filteredPublishers"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có nhà xuất bản nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddPublisher">
          <i class="fas fa-plus"></i> Thêm mới
        </button>

        <button class="btn btn-sm btn-danger" @click="removeAllPublishers">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-4">
      <div v-if="activePublisher">
        <h4>
          Chi tiết Nhà xuất bản
          <i class="fas fa-address-card"></i>
        </h4>
        <PublisherCard :publisher="activePublisher" />
        <router-link
          :to="{
            name: 'publishers.edit',
            params: { id: activePublisher._id },
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
import PublisherCard from "@/components/publishers/PublisherCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import PublisherList from "@/components/publishers/PublisherList.vue";
import PublisherService from "@/services/publisher.service";

export default {
  components: {
    PublisherCard,
    InputSearch,
    PublisherList,
  },
  data() {
    return {
      publishers: [],
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
