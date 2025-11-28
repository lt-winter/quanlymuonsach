<script>
export default {
  props: {
    reader: { type: Object, required: true },
  },
};
</script>

<template>
  <div class="reader-card">
    <div class="card-header">
      <div class="avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="header-info">
        <h4>{{ reader.hoLot }} {{ reader.ten }}</h4>
        <span class="gender-badge" :class="reader.phai === 'Nam' ? 'male' : 'female'">
          <i :class="reader.phai === 'Nam' ? 'fas fa-mars' : 'fas fa-venus'"></i>
          {{ reader.phai }}
        </span>
      </div>
    </div>
    
    <div class="card-body">
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Ngày sinh</span>
          <span class="info-value">{{ new Date(reader.ngaySinh).toLocaleDateString('vi-VN') }}</span>
        </div>
      </div>
      
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Địa chỉ</span>
          <span class="info-value">{{ reader.diaChi }}</span>
        </div>
      </div>
      
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-phone-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Số điện thoại</span>
          <span class="info-value">{{ reader.dienThoai }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reader-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #4361ee, #7209b7);
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

.gender-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.gender-badge.male {
  background: rgba(59, 130, 246, 0.3);
  color: #bfdbfe;
}

.gender-badge.female {
  background: rgba(236, 72, 153, 0.3);
  color: #fbcfe8;
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
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4361ee;
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
