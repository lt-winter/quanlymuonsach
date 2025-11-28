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
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #7209b7, #5c0d99);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.card-header h4 {
  color: white;
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
}

.card-body {
  padding: 14px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
}

.info-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7209b7;
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
