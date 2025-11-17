<script>
export default {
  props: {
    employee: { type: Object, required: true },
  },
};
</script>

<template>
  <div>
    <div class="p-1">
      <strong>Họ tên nhân viên:</strong>
      {{ employee.hoTenNV }}
    </div>
    <div class="p-1">
      <strong>Chức vụ:</strong>
      {{ employee.chucVu }}
    </div>
    <div class="p-1">
      <strong>Địa chỉ:</strong>
      {{ employee.diaChi }}
    </div>
    <div class="p-1">
      <strong>Tên người dùng:</strong>
      {{ employee.tenNguoiDung }}
    </div>
    <div class="p-1">
      <strong>Vai trò:</strong>
      {{ employee.vaiTro }}
    </div>
  </div>
</template>
