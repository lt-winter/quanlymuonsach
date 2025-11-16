<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark sticky-top px-3">
    <a href="/" class="navbar-brand">Quản lý Thư viện</a>
    <ul class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'readers' }" class="nav-link">
          Độc giả
          <i class="fas fa-address-book"></i>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'publishers' }" class="nav-link">
          Nhà xuất bản
          <i class="fas fa-building"></i>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'books' }" class="nav-link">
          Sách
          <i class="fas fa-book"></i>
        </router-link>
      </li>

      <!-- <li class="nav-item" v-if="user.vaiTro === 'superadmin'">
        <router-link :to="{ name: 'employees' }" class="nav-link">
          Nhân viên
          <i class="fas fa-users-cog"></i>
        </router-link>
      </li> -->
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
};
</script>
