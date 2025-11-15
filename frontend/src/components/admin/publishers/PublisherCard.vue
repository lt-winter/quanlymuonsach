<script>
export default {
  props: {
    publisher: { type: Object, required: true },
  },
};
</script>

<template>
  <div>
    <div class="p-1">
      <strong>Tên:</strong>
      {{ publisher.tenNXB }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ:</strong>
      {{ publisher.diaChi }}
    </div>
  </div>
</template>
