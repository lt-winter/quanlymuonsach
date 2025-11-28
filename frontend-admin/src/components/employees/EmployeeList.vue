<script>
export default {
  props: {
    employees: { type: Array, default: [] },
    activeIndex: { type: Number, default: -1 },
  },
  emits: ["update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index);
    },
  },
};
</script>

<template>
  <ul class="custom-list">
    <li
      class="custom-list-item"
      v-for="(employee, index) in employees"
      :key="employee._id"
      :class="{ active: index === activeIndex }"
      @click="updateActiveIndex(index)"
    >
      <div class="item-avatar">
        <i class="fas fa-user-tie"></i>
      </div>
      <div class="item-content">
        <span class="item-name">{{ employee.hoTenNv }}</span>
        <span class="item-role" v-if="employee.chucVu">
          <i class="fas fa-briefcase"></i> {{ employee.chucVu }}
        </span>
      </div>
      <i class="fas fa-chevron-right item-arrow"></i>
    </li>
  </ul>
</template>

<style scoped>
.custom-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.custom-list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-list-item:last-child {
  border-bottom: none;
}

.custom-list-item:hover {
  background: #f9fafb;
}

.custom-list-item.active {
  background: linear-gradient(135deg, #06d6a0, #05b384);
}

.custom-list-item.active .item-name,
.custom-list-item.active .item-role,
.custom-list-item.active .item-arrow {
  color: white;
}

.custom-list-item.active .item-avatar {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.item-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d1fae5, #ecfdf5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  font-size: 1rem;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.item-role {
  font-size: 0.8rem;
  color: #6b7280;
}

.item-role i {
  font-size: 0.7rem;
  margin-right: 4px;
}

.item-arrow {
  color: #9ca3af;
  font-size: 0.8rem;
}
</style>
