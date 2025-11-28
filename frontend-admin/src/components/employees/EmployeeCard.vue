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
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #06d6a0, #05b384);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.header-info h4 {
  color: white;
  margin: 0 0 4px 0;
  font-weight: 600;
  font-size: 1rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-body {
  padding: 14px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.info-label {
  font-size: 0.7rem;
  color: #6b7280;
}

.info-value {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.9rem;
}
</style>
