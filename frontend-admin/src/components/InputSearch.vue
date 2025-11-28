<template>
  <div class="form-group">
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="$emit('search')"
        >
          <i class="fas fa-search"></i>
        </button>
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
    placeholder: {
      type: String,
      default: "Tìm kiếm...",
    },
  },
  emits: ["update:modelValue", "search"],
};
</script>
