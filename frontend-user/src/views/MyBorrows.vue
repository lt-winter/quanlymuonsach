<template>
  <div class="my-borrows-page">
    <h2 class="mb-4">
      <i class="fas fa-clipboard-list"></i> Sách đã mượn
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="borrows.length === 0" class="text-center py-5">
        <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">Bạn chưa mượn sách nào</p>
        <router-link to="/books" class="btn btn-primary">
          <i class="fas fa-search"></i> Tìm sách để mượn
        </router-link>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả dự kiến</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(borrow, index) in borrows" :key="borrow._id">
              <td>{{ index + 1 }}</td>
              <td>
                <router-link
                  :to="{ name: 'book.detail', params: { id: borrow.book?._id } }"
                >
                  {{ borrow.book?.tenSach }}
                </router-link>
              </td>
              <td>{{ formatDate(borrow.ngayMuon) }}</td>
              <td>{{ formatDate(borrow.ngayTraDuKien) }}</td>
              <td>
                <span
                  :class="{
                    'badge badge-warning': borrow.trangThai === 'pending',
                    'badge badge-success': borrow.trangThai === 'borrowed',
                    'badge badge-info': borrow.trangThai === 'returned',
                    'badge badge-danger': borrow.trangThai === 'overdue',
                  }"
                >
                  {{ getStatusText(borrow.trangThai) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";

export default {
  data() {
    return {
      borrows: [],
      loading: false,
    };
  },
  methods: {
    async fetchBorrows() {
      this.loading = true;
      try {
        this.borrows = await BorrowService.getMyBorrows();
      } catch (error) {
        console.error("Error fetching borrows:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getStatusText(status) {
      const statusMap = {
        pending: "Đang chờ",
        borrowed: "Đang mượn",
        returned: "Đã trả",
        overdue: "Quá hạn",
      };
      return statusMap[status] || status;
    },
  },
  mounted() {
    this.fetchBorrows();
  },
};
</script>
