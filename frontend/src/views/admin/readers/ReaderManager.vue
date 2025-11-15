<template>
  <div class="page row">
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <div class="mt-3 col-md-8">
      <div class="d-flex justify-content-between align-items-center">
        <h4>
          Danh sách Độc giả
          <i class="fas fa-address-book"></i>
        </h4>
        <div class="d-flex align-items-center m-4">
          <span class="fw-bold mx-4">Sắp xếp: </span>

          <!-- Chọn danh mục sắp xếp -->
          <select
            v-model="sortBy"
            class="form-select form-select-sm w-auto mx-4"
          >
            <option value="">Mặc định</option>
            <option value="ten">Tên</option>
            <option value="hoLot">Họ lót</option>
          </select>

          <!-- Nút đổi thứ tự sắp xếp -->
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

      <ReaderList
        v-if="filteredReadersCount > 0"
        :readers="filteredReaders"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có độc giả nào.</p>
      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList()">
          <i class="fas fa-redo"></i> Làm mới
        </button>

        <button class="btn btn-sm btn-success" @click="goToAddReader">
          <i class="fas fa-plus"></i> Thêm mới
        </button>

        <button class="btn btn-sm btn-danger" @click="removeAllReaders">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>

        <div>
          <p>Tổng số độc giả: {{ filteredReadersCount }}</p>
        </div>
      </div>
    </div>
    <div class="mt-3 col-md-4">
      <div v-if="activeReader">
        <h4>
          Chi tiết Độc giả
          <i class="fas fa-address-card"></i>
        </h4>
        <ReaderCard :reader="activeReader" />
        <router-link
          :to="{
            name: 'readers.edit',
            params: { id: activeReader._id },
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
import ReaderCard from "@/components/admin/readers/ReaderCard.vue";
import InputSearch from "@/components/admin/InputSearch.vue";
import ReaderList from "@/components/admin/readers/ReaderList.vue";
import ReaderService from "@/services/reader.service";

export default {
  components: {
    ReaderCard,
    InputSearch,
    ReaderList,
  },
  data() {
    return {
      readers: [],
      activeIndex: -1,
      searchText: "",
      sortBy: "",
      order: "asc",
    };
  },
  watch: {
    // Giám sát các thay đổi của biến searchText.
    // Bỏ chọn phần tử đang được chọn trong danh sách.
    searchText() {
      this.activeIndex = -1;
    },

    sortBy() {
      this.retrieveReaders();
    },

    order() {
      this.retrieveReaders();
    },
  },
  computed: {
    // Chuyển các đối tượng độc giả thành chuỗi để tiện cho tìm kiếm.
    readerString() {
      return this.readers.map((reader) => {
        const { hoLot, ten, ngaySinh, diaChi, dienThoai } = reader;
        return [hoLot, ten, ngaySinh, diaChi, dienThoai].join("").toLowerCase();
      });
    },
    // Trả về các độc giả có chứa thông tin cần tìm kiếm.
    filteredReaders() {
      if (!this.searchText) return this.readers;
      return this.readers.filter((_reader, index) =>
        this.readerString[index].includes(this.searchText.toLowerCase())
      );
    },
    activeReader() {
      if (this.activeIndex < 0) return null;
      return this.filteredReaders[this.activeIndex];
    },
    filteredReadersCount() {
      return this.filteredReaders.length;
    },
  },
  methods: {
    async retrieveReaders() {
      try {
        this.readers = await ReaderService.getAll({
          sortBy: this.sortBy,
          order: this.order,
        });
      } catch (error) {
        console.log(error);
      }
    },
    refreshList() {
      this.retrieveReaders();
      this.activeIndex = -1;
    },
    async removeAllReaders() {
      if (confirm("Bạn muốn xóa tất cả Độc giả?")) {
        try {
          await ReaderService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.log(error);
        }
      }
    },
    goToAddReader() {
      this.$router.push({ name: "readers.add" });
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
