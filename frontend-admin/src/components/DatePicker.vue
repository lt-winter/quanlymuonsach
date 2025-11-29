<template>
  <div class="custom-datepicker">
    <VueDatePicker
      v-model="internalDate"
      :format="formatDisplay"
      :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
      locale="vi"
      :enable-time-picker="false"
      :auto-apply="true"
      :clearable="false"
      :disabled="disabled"
      :placeholder="placeholder"
      :min-date="minDate"
      :max-date="maxDate"
      input-class-name="dp-custom-input"
      menu-class-name="dp-custom-menu"
    >
      <template #input-icon>
        <i class="fas fa-calendar-alt"></i>
      </template>
    </VueDatePicker>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "DatePicker",
  components: {
    VueDatePicker,
  },
  props: {
    modelValue: {
      type: [String, Date],
      default: null,
    },
    placeholder: {
      type: String,
      default: "Chọn ngày...",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    minDate: {
      type: [String, Date],
      default: null,
    },
    maxDate: {
      type: [String, Date],
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      internalDate: null,
    };
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.internalDate = this.parseToDate(newVal);
      },
      immediate: true,
    },
    internalDate(newVal) {
      const formatted = this.formatToISO(newVal);
      if (formatted !== this.modelValue) {
        this.$emit("update:modelValue", formatted);
      }
    },
  },
  methods: {
    // Parse input value to Date object
    parseToDate(val) {
      if (!val) return null;
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    },
    // Format Date to YYYY-MM-DD string
    formatToISO(date) {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // Format for display (dd/MM/yyyy)
    formatDisplay(date) {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
};
</script>

<style>
/* Custom Input Style */
.dp-custom-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 10px !important;
  font-size: 1rem !important;
  transition: border-color 0.2s ease !important;
  background: white !important;
  color: #374151 !important;
}

.dp-custom-input:focus {
  outline: none !important;
  border-color: #4361ee !important;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1) !important;
}

.dp-custom-input:disabled {
  background: #f3f4f6 !important;
  cursor: not-allowed !important;
}

/* Input Icon */
.custom-datepicker .dp__input_icon {
  left: 12px !important;
  color: #6b7280 !important;
}

/* Menu Container */
.dp-custom-menu {
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15) !important;
  padding: 12px !important;
}

/* Calendar Header */
.dp-custom-menu .dp__month_year_wrap {
  gap: 8px !important;
}

.dp-custom-menu .dp__month_year_select {
  font-weight: 600 !important;
  color: #1f2937 !important;
  border-radius: 8px !important;
  padding: 6px 12px !important;
}

.dp-custom-menu .dp__month_year_select:hover {
  background: #f3f4f6 !important;
}

/* Arrow buttons */
.dp-custom-menu .dp__arrow_top,
.dp-custom-menu .dp__arrow_bottom {
  display: none !important;
}

.dp-custom-menu .dp__inner_nav {
  width: 36px !important;
  height: 36px !important;
  border-radius: 10px !important;
}

.dp-custom-menu .dp__inner_nav:hover {
  background: #f3f4f6 !important;
}

/* Weekday headers */
.dp-custom-menu .dp__calendar_header_item {
  font-weight: 600 !important;
  color: #6b7280 !important;
  font-size: 0.85rem !important;
}

/* Calendar cells */
.dp-custom-menu .dp__cell_inner {
  width: 40px !important;
  height: 40px !important;
  border-radius: 10px !important;
  font-weight: 500 !important;
}

.dp-custom-menu .dp__cell_inner:hover {
  background: #e0e7ff !important;
  color: #4361ee !important;
}

/* Today */
.dp-custom-menu .dp__today {
  border: 2px solid #4361ee !important;
}

/* Selected date */
.dp-custom-menu .dp__active_date {
  background: linear-gradient(135deg, #4361ee, #7209b7) !important;
  color: white !important;
}

/* Disabled dates */
.dp-custom-menu .dp__cell_disabled {
  color: #d1d5db !important;
}

/* Action buttons */
.dp-custom-menu .dp__action_buttons {
  padding: 12px 0 0 0 !important;
}

.dp-custom-menu .dp__action_button {
  border-radius: 8px !important;
  font-weight: 500 !important;
}

.dp-custom-menu .dp__action_select {
  background: linear-gradient(135deg, #4361ee, #7209b7) !important;
}
</style>
