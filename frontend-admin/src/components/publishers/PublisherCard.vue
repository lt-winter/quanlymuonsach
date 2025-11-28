<script>
export default {
  props: {
    publisher: { type: Object, required: true },
  },
};
</script>

<template>
  <div class="publisher-card">
    <div class="card-header">
      <div class="avatar">
        <i class="fas fa-building"></i>
      </div>
      <h4>{{ publisher.tenNXB }}</h4>
    </div>
    
    <div class="card-body">
      <div class="info-item">
        <div class="info-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="info-content">
          <span class="info-label">Địa chỉ</span>
          <span class="info-value">{{ publisher.diaChi || 'Chưa cập nhật' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publisher-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #7209b7, #5c0d99);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
}

.card-header h4 {
  color: white;
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.card-body {
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 10px 0;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7209b7;
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
