<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark sticky-top px-3">
    <a href="/admin" class="navbar-brand">Quản lý Thư viện</a>
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

      <li class="nav-item" v-if="user.role === 'superadmin'">|</li>

      <li class="nav-item" v-if="user.role === 'superadmin'">
        <router-link :to="{ name: 'employees' }" class="nav-link">
          Nhân viên
          <i class="fas fa-users-cog"></i>
        </router-link>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto" v-if="user">
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fas fa-user-circle"></i>
          {{ user.username }}
        </a>

        <ul
          class="dropdown-menu dropdown-menu-right"
          data-display="static"
          style="min-width: 250px"
        >
          <li class="dropdown-item-text">
            <strong>{{ user.fullName }}</strong>
            <br />
            <small class="text-muted">{{ user.username }}</small>
          </li>

          <li><hr class="dropdown-divider" /></li>

          <li>
            <button class="dropdown-item text-danger" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/admin/login");
    },
  },
};
</script>

<style scoped>
.dropdown-item-text {
  padding: 10px 15px;
}
</style>
