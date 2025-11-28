<template>
  <nav class="navbar navbar-expand navbar-dark bg-primary sticky-top px-3">
    <router-link to="/" class="navbar-brand">
      <i class="fas fa-book-reader"></i> Thư viện
    </router-link>

    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link :to="{ name: 'home' }" class="nav-link">
          <i class="fas fa-home"></i> Trang chủ
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'books' }" class="nav-link">
          <i class="fas fa-book"></i> Sách
        </router-link>
      </li>
      <li class="nav-item" v-if="user">
        <router-link :to="{ name: 'my-borrows' }" class="nav-link">
          <i class="fas fa-clipboard-list"></i> Sách đã mượn
        </router-link>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <!-- Chưa đăng nhập -->
      <template v-if="!user">
        <li class="nav-item">
          <router-link :to="{ name: 'login' }" class="nav-link">
            <i class="fas fa-sign-in-alt"></i> Đăng nhập
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'register' }" class="nav-link">
            <i class="fas fa-user-plus"></i> Đăng ký
          </router-link>
        </li>
      </template>

      <!-- Đã đăng nhập -->
      <li v-else class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fas fa-user-circle"></i>
          {{ user.hoLot }} {{ user.ten }}
        </a>

        <ul
          class="dropdown-menu dropdown-menu-right"
          data-display="static"
          style="min-width: 200px"
        >
          <li class="dropdown-item-text">
            <strong>{{ user.hoLot }} {{ user.ten }}</strong>
            <br />
            <small class="text-muted">{{ user.dienThoai }}</small>
          </li>

          <li><hr class="dropdown-divider" /></li>

          <li>
            <router-link :to="{ name: 'profile' }" class="dropdown-item">
              <i class="fas fa-user"></i> Thông tin cá nhân
            </router-link>
          </li>

          <li>
            <button class="dropdown-item text-danger" @click="logout">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
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
      this.user = null;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.dropdown-item-text {
  padding: 10px 15px;
}
</style>
