<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <i class="fas fa-book-reader"></i>
        </div>
        <h1 class="hero-title">
          Chào mừng đến với Thư viện
        </h1>
        <p class="hero-subtitle">
          Khám phá hàng ngàn đầu sách và mượn sách trực tuyến dễ dàng
        </p>
        <router-link to="/books" class="btn-hero">
          <i class="fas fa-search"></i> Tìm sách ngay
        </router-link>
      </div>
      <div class="hero-decoration">
        <div class="floating-book book-1">📚</div>
        <div class="floating-book book-2">📖</div>
        <div class="floating-book book-3">📕</div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="row text-center">
        <div class="col-md-3 col-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <h3 class="stat-number" data-target="1000">0</h3>
            <p class="stat-label">Đầu sách</p>
          </div>
        </div>
        <div class="col-md-3 col-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <h3 class="stat-number" data-target="500">0</h3>
            <p class="stat-label">Độc giả</p>
          </div>
        </div>
        <div class="col-md-3 col-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book-reader"></i>
            </div>
            <h3 class="stat-number" data-target="2000">0</h3>
            <p class="stat-label">Lượt mượn</p>
          </div>
        </div>
        <div class="col-md-3 col-6 mb-3">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <h3 class="stat-number" data-target="98">0</h3>
            <p class="stat-label">Đánh giá 5⭐</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title text-center mb-5">
        <i class="fas fa-gem"></i> Tại sao chọn chúng tôi?
      </h2>
      <div class="row text-center">
        <div class="col-md-4 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-book"></i>
            </div>
            <h5 class="feature-title">Kho sách phong phú</h5>
            <p class="feature-text">
              Hàng ngàn đầu sách từ nhiều thể loại khác nhau, cập nhật liên tục
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-hand-holding-heart"></i>
            </div>
            <h5 class="feature-title">Mượn sách dễ dàng</h5>
            <p class="feature-text">
              Đăng ký và mượn sách chỉ với vài thao tác đơn giản, nhanh chóng
            </p>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-clock"></i>
            </div>
            <h5 class="feature-title">Theo dõi tiện lợi</h5>
            <p class="feature-text">
              Quản lý sách đã mượn và hạn trả một cách dễ dàng, minh bạch
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Books Section -->
    <div class="books-section">
      <h2 class="section-title text-center mb-5">
        <i class="fas fa-fire"></i> Sách mới nhất
      </h2>
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Đang tải...</span>
        </div>
      </div>
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div v-for="book in latestBooks" :key="book.maSach" class="col">
          <router-link
            :to="{ name: 'book.detail', params: { id: book.maSach } }"
            custom
            v-slot="{ navigate }"
          >
            <div class="book-card" @click="navigate">
              <div class="book-image-wrapper">
                <img
                  :src="book.anhSach || '/placeholder-book.svg'"
                  class="book-image"
                  :alt="book.tenSach"
                />
                <div class="book-overlay">
                  <span class="view-btn">
                    <i class="fas fa-eye"></i> Xem chi tiết
                  </span>
                </div>
                <span v-if="book.soQuyen <= 0" class="out-of-stock-badge">
                  Hết sách
                </span>
              </div>

              <div class="book-info">
                <h5 class="book-title">{{ book.tenSach }}</h5>
                <p class="book-author">
                  <i class="fas fa-pen-fancy"></i>
                  {{ book.tacGia || "Đang cập nhật" }}
                </p>
                <div class="book-meta">
                  <span class="book-price" v-if="book.donGia">
                    {{ new Intl.NumberFormat("vi-VN").format(book.donGia) }}đ
                  </span>
                  <span class="book-quantity">
                    <i class="fas fa-layer-group"></i>
                    {{ book.soQuyen > 0 ? book.soQuyen : 0 }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="text-center mt-5">
        <router-link to="/books" class="btn btn-primary btn-lg">
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
  methods: {
    animateNumbers() {
      const stats = document.querySelectorAll('.stat-number');
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateNumber = () => {
          current += increment;
          if (current < target) {
            stat.textContent = Math.floor(current);
            setTimeout(updateNumber, 30);
          } else {
            stat.textContent = target + (stat.parentElement.querySelector('.stat-label').textContent.includes('5⭐') ? '%' : '+');
          }
        };
        updateNumber();
      });
    }
  },
  async mounted() {
    this.loading = true;
    try {
      const books = await BookService.getAll({ limit: 8 });
      this.latestBooks = books;
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      this.loading = false;
    }
    
    // Animate numbers when page loads
    setTimeout(() => {
      this.animateNumbers();
    }, 500);
  },
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  margin: -20px -15px 40px -15px;
  overflow: hidden;
  border-radius: 0 0 30px 30px;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 30px;
  opacity: 0.95;
}

.btn-hero {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 15px 40px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-hero:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  color: #667eea;
  text-decoration: none;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.floating-book {
  position: absolute;
  font-size: 3rem;
  opacity: 0.2;
  animation: float 6s ease-in-out infinite;
}

.book-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.book-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.book-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

/* Stats Section */
.stats-section {
  margin: 60px 0;
}

.stat-card {
  padding: 30px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow-hover);
}

.stat-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 10px 0;
}

.stat-label {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

/* Features Section */
.features-section {
  margin: 80px 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1f2937;
}

.section-title i {
  color: var(--primary-color);
}

.feature-card {
  padding: 40px 30px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--card-shadow-hover);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature-title {
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 15px;
}

.feature-text {
  color: #6b7280;
  line-height: 1.6;
}

/* Books Section */
.books-section {
  margin: 80px 0;
}

.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

.book-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-image {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(67, 97, 238, 0.9), rgba(114, 9, 183, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.view-btn {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(4px);
}

.book-info {
  padding: 20px;
}

.book-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
  font-size: 1rem;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
  line-height: 1.5;
}

.book-author {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-author i {
  color: #9ca3af;
  font-size: 0.75rem;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  font-weight: 700;
  color: #4361ee;
  font-size: 1rem;
}

.book-quantity {
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 20px;
}

.book-quantity i {
  font-size: 0.7rem;
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef476f;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

/* Animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}
</style>
