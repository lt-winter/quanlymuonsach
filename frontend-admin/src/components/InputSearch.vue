<template>
  <div class="search-wrapper">
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input
        type="text"
        class="search-input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="modelValue"
        class="clear-btn"
        type="button"
        @click="$emit('update:modelValue', '')"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Tìm kiếm...",
    },
  },
  emits: ["update:modelValue", "search"],
};
</script>

<style scoped>
.search-wrapper {
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  font-size: 1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  position: absolute;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}
</style>
