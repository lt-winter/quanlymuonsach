<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <div class="mt-3 col-md-8">
      <h4>
        Danh sách Nhà xuất bản
        <i class="fas fa-address-book"></i>
      </h4>
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
import PublisherCard from "@/components/admin/publishers/PublisherCard.vue";
import InputSearch from "@/components/admin/InputSearch.vue";
import PublisherList from "@/components/admin/publishers/PublisherList.vue";
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
    };
  },
  watch: {
    // Giám sát các thay đổi của biến searchText.
    // Bỏ chọn phần tử đang được chọn trong danh sách.
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    // Chuyển các đối tượng độc giả thành chuỗi để tiện cho tìm kiếm.
    publisherString() {
      return this.publishers.map((publisher) => {
        const { tenNXB, diaChi } = publisher;
        return [tenNXB, diaChi].join("").toLowerCase();
      });
    },
    // Trả về các độc giả có chứa thông tin cần tìm kiếm.
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
    async retrievePublishers() {
      try {
        this.publishers = await PublisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrievePublishers();
      this.activeIndex = -1;
    },
    async removeAllPublishers() {
      if (confirm("Bạn muốn xóa tất cả Độc giả?")) {
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
