<script>
export default {
  props: {
    reader: { type: Object, required: true },
  },
};
</script>

<template>
  <div>
    <div class="p-1">
      <strong>Họ và tên lót:</strong>
      {{ reader.hoLot }}
    </div>
    <div class="p-1">
      <strong>Tên:</strong>
      {{ reader.ten }}
    </div>
    <div class="p-1">
      <strong>Ngày sinh:</strong>
      {{ new Date(reader.ngaySinh).toLocaleDateString() }}
    </div>
    <div class="p-1">
      <strong>Phái:</strong>
      {{ reader.phai }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ:</strong>
      {{ reader.diaChi }}
    </div>
    <div class="p-1">
      <strong>Số điện thoại:</strong>
      {{ reader.dienThoai }}
    </div>
  </div>
</template>
