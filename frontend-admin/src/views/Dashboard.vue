<template>
  <div class="admin-homepage page">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <i class="fas fa-hand-sparkles"></i>
          Chào mừng đến với Hệ thống Quản lý Thư viện
        </h1>
        <p class="welcome-subtitle">
          Quản lý toàn bộ hoạt động thư viện một cách hiệu quả và chuyên nghiệp
        </p>
      </div>
    </div>

    <div class="features-grid">
      <router-link :to="{ name: 'readers' }" class="feature-card">
        <div class="feature-icon readers">
          <i class="fas fa-users"></i>
        </div>
        <div class="feature-content">
          <h3>Quản lý Độc giả</h3>
          <p>Thêm, sửa, xóa và xem thông tin độc giả</p>
        </div>
        <div class="feature-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>

      <router-link :to="{ name: 'books' }" class="feature-card">
        <div class="feature-icon books">
          <i class="fas fa-book"></i>
        </div>
        <div class="feature-content">
          <h3>Quản lý Sách</h3>
          <p>Thêm, sửa, xóa và xem thông tin sách</p>
        </div>
        <div class="feature-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>

      <router-link :to="{ name: 'publishers' }" class="feature-card">
        <div class="feature-icon publishers">
          <i class="fas fa-building"></i>
        </div>
        <div class="feature-content">
          <h3>Quản lý Nhà xuất bản</h3>
          <p>Quản lý thông tin các nhà xuất bản</p>
        </div>
        <div class="feature-arrow">
          <i class="fas fa-arrow-right"></i>
        </div>
      </router-link>

      <div class="feature-card coming-soon">
        <div class="feature-icon reports">
          <i class="fas fa-chart-bar"></i>
        </div>
        <div class="feature-content">
          <h3>Báo cáo & Thống kê</h3>
          <p>Xem các báo cáo về hoạt động thư viện</p>
          <span class="badge-coming-soon">Sắp ra mắt</span>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-card">
        <i class="fas fa-lightbulb"></i>
        <p>Sử dụng thanh điều hướng bên trên để truy cập nhanh các chức năng quản lý</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-homepage {
  max-width: 1200px;
}

.welcome-section {
  background: linear-gradient(135deg, #4361ee 0%, #7209b7 100%);
  border-radius: 20px;
  padding: 50px 40px;
  margin-bottom: 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-title i {
  font-size: 1.8rem;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.feature-card.coming-soon {
  opacity: 0.7;
  cursor: default;
}

.feature-card.coming-soon:hover {
  transform: none;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.feature-icon.readers {
  background: linear-gradient(135deg, #06d6a0, #05b384);
}

.feature-icon.books {
  background: linear-gradient(135deg, #4361ee, #3651d4);
}

.feature-icon.publishers {
  background: linear-gradient(135deg, #7209b7, #5c0d99);
}

.feature-icon.reports {
  background: linear-gradient(135deg, #ffd166, #f5c542);
}

.feature-content {
  flex: 1;
}

.feature-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.feature-content p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.feature-arrow {
  color: #9ca3af;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-arrow {
  color: #4361ee;
  transform: translateX(5px);
}

.badge-coming-soon {
  display: inline-block;
  background: linear-gradient(135deg, #ffd166, #f5c542);
  color: #1f2937;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  margin-top: 8px;
}

.info-section {
  margin-top: 20px;
}

.info-card {
  background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 4px solid #4361ee;
}

.info-card i {
  font-size: 1.5rem;
  color: #4361ee;
}

.info-card p {
  margin: 0;
  color: #1e40af;
  font-size: 0.95rem;
}
</style>
