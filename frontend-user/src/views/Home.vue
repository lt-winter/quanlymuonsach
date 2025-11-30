<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="jumbotron bg-primary text-white text-center py-5">
      <h1 class="display-4">
        <i class="fas fa-book-reader"></i> Chào mừng đến với Thư viện
      </h1>
      <p class="lead">Khám phá hàng ngàn đầu sách và mượn sách trực tuyến dễ dàng</p>
      <hr class="my-4 bg-white" />
      <router-link to="/books" class="btn btn-light btn-lg">
        <i class="fas fa-search"></i> Tìm sách ngay
      </router-link>
    </div>

    <!-- Features Section -->
    <div class="row text-center my-5">
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fas fa-book fa-3x text-primary mb-3"></i>
            <h5 class="card-title">Kho sách phong phú</h5>
            <p class="card-text text-muted">
              Hàng ngàn đầu sách từ nhiều thể loại khác nhau
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fas fa-hand-holding-heart fa-3x text-success mb-3"></i>
            <h5 class="card-title">Mượn sách dễ dàng</h5>
            <p class="card-text text-muted">
              Đăng ký và mượn sách chỉ với vài thao tác đơn giản
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fas fa-clock fa-3x text-warning mb-3"></i>
            <h5 class="card-title">Theo dõi tiện lợi</h5>
            <p class="card-text text-muted">
              Quản lý sách đã mượn và hạn trả một cách dễ dàng
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Books Section -->
    <div class="my-5">
      <h3 class="mb-4">
        <i class="fas fa-star text-warning"></i> Sách mới nhất
      </h3>
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Đang tải...</span>
        </div>
      </div>
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div v-for="book in latestBooks" :key="book.maSach" class="col">
          <div class="card h-100 shadow-sm" :class="{ 'out-of-stock': book.soQuyen <= 0 }">
            <div class="position-relative">
              <img
                :src="book.image || '/placeholder-book.svg'"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
              />
              <span v-if="book.soQuyen <= 0" class="out-of-stock-badge">Hết sách</span>
            </div>
            <div class="card-body">
              <h6 class="card-title">{{ book.tenSach }}</h6>
              <p class="card-text text-muted small">
                <i class="fas fa-user"></i> {{ book.tacGia }}
              </p>
              <p class="card-text small">
                <span v-if="book.soQuyen > 0" class="text-success">
                  <i class="fas fa-check-circle"></i> Còn {{ book.soQuyen }} quyển
                </span>
                <span v-else class="text-danger">
                  <i class="fas fa-times-circle"></i> Hết sách
                </span>
              </p>
              <router-link
                :to="{ name: 'book.detail', params: { id: book.maSach } }"
                class="btn btn-sm btn-outline-primary"
              >
                Xem chi tiết
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <router-link to="/books" class="btn btn-primary">
          Xem tất cả sách <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/book.service";

export default {
  data() {
    return {
      latestBooks: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const books = await BookService.getAll({ limit: 4 });
      this.latestBooks = books;
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.out-of-stock {
  opacity: 0.7;
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>