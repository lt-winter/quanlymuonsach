<template>
  <div class="cs-wrapper" ref="selectContainer">
    <div
      class="cs-trigger"
      :class="{ open: showDropdown }"
      @click="toggleDropdown"
    >
      <span class="cs-value">{{ selectedLabel }}</span>
      <i class="fas fa-chevron-down cs-arrow"></i>
    </div>
    
    <div v-if="showDropdown" class="cs-dropdown">
      <div
        v-for="option in options"
        :key="option.value"
        class="cs-option"
        :class="{ active: option.value === modelValue }"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
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
    options: {
      type: Array,
      required: true,
      // [{ value: '', label: 'Mặc định' }, ...]
    },
    placeholder: {
      type: String,
      default: "Chọn...",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    selectedLabel() {
      const found = this.options.find((o) => o.value === this.modelValue);
      return found ? found.label : this.placeholder;
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectOption(option) {
      this.$emit("update:modelValue", option.value);
      this.showDropdown = false;
    },
    handleClickOutside(event) {
      const container = this.$refs.selectContainer;
      if (container && !container.contains(event.target)) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.cs-wrapper {
  position: relative;
  min-width: 130px;
}

.cs-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  color: #374151;
}

.cs-trigger:hover {
  border-color: #d1d5db;
}

.cs-trigger.open {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.cs-arrow {
  font-size: 0.7rem;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.cs-trigger.open .cs-arrow {
  transform: rotate(180deg);
}

.cs-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  z-index: 100;
  overflow: hidden;
  animation: dropdownFadeIn 0.15s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cs-option {
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.9rem;
  color: #374151;
}

.cs-option:hover {
  background: #f3f4f6;
}

.cs-option.active {
  background: #4361ee;
  color: white;
}

.cs-option:first-child {
  border-radius: 10px 10px 0 0;
}

.cs-option:last-child {
  border-radius: 0 0 10px 10px;
}

.cs-option:only-child {
  border-radius: 10px;
}
</style>
