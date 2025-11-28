<script>
export default {
  props: {
    employee: { type: Object, required: true },
  },
};
</script>

<template>
  <div class="employee-card">
    <div class="card-header">
      <div class="avatar">
        <i class="fas fa-user-tie"></i>
      </div>
      <div class="header-info">
        <h4>{{ employee.hoTenNV }}</h4>
        <span class="role-badge">
          <i class="fas fa-briefcase"></i>
          {{ employee.chucVu }}
        </span>
      </div>
    </div>
    
    <div class="card-body">
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Địa chỉ</span>
          <span class="info-value">{{ employee.diaChi || 'Chưa cập nhật' }}</span>
        </div>
      </div>
      
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-phone-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Số điện thoại</span>
          <span class="info-value">{{ employee.soDienThoai || 'Chưa cập nhật' }}</span>
        </div>
      </div>
      
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-at"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Tên người dùng</span>
          <span class="info-value">{{ employee.tenNguoiDung }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #06d6a0, #05b384);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.header-info h4 {
  color: white;
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-body {
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.info-value {
  font-weight: 500;
  color: #1f2937;
}
</style>
