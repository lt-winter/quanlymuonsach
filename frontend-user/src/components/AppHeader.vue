<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark sticky-top px-4 custom-navbar"
  >
    <router-link to="/" class="navbar-brand d-flex align-items-center">
      <i class="fa-solid fa-snowflake brand-icon mr-2"></i>
      <span class="brand-text">WinterLibrary</span>
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      @click="isNavOpen = !isNavOpen"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div
      class="collapse navbar-collapse"
      :class="{ show: isNavOpen }"
      id="navbarNav"
    >
      <ul class="navbar-nav mx-auto nav-menu">
        <li class="nav-item">
          <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
            <a
              @click="navigate(); isNavOpen = false"
              class="nav-link nav-link-custom"
              :class="{ 'active-link': $route.name === 'home' }"
            >
              <i class="fas fa-home"></i>
              <span>Trang chủ</span>
            </a>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'books' }" custom v-slot="{ navigate }">
            <a
              @click="navigate(); isNavOpen = false"
              class="nav-link nav-link-custom"
              :class="{
                'active-link':
                  $route.name === 'books' || $route.name === 'book.detail',
              }"
            >
              <i class="fas fa-book"></i>
              <span>Sách</span>
            </a>
          </router-link>
        </li>
        <li class="nav-item" v-if="user">
          <router-link
            :to="{ name: 'my-borrows' }"
            custom
            v-slot="{ navigate }"
          >
            <a
              @click="navigate(); isNavOpen = false"
              class="nav-link nav-link-custom"
              :class="{ 'active-link': $route.name === 'my-borrows' }"
            >
              <i class="fas fa-clipboard-list"></i>
              <span>Sách đã mượn</span>
            </a>
          </router-link>
        </li>
      </ul>

      <ul class="navbar-nav">
        <!-- Chưa đăng nhập -->
        <template v-if="!user">
          <li class="nav-item">
            <router-link
              :to="{ name: 'login' }"
              class="nav-link nav-link-custom"
              @click="isNavOpen = false"
            >
              <i class="fas fa-sign-in-alt"></i>
              <span>Đăng nhập</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'register' }"
              class="nav-link nav-link-custom"
              @click="isNavOpen = false"
            >
              <i class="fas fa-user-plus"></i>
              <span>Đăng ký</span>
            </router-link>
          </li>
        </template>

        <!-- Đã đăng nhập -->
        <li v-else class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle user-dropdown"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
            <span class="user-name">{{ user.hoLot }} {{ user.ten }}</span>
          </a>

          <ul
            class="dropdown-menu dropdown-menu-right dropdown-menu-custom"
            data-display="static"
          >
            <li class="dropdown-header">
              <div class="user-info">
                <div class="user-avatar-large">
                  <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                  <strong>{{ user.hoLot }} {{ user.ten }}</strong>
                  <small>{{ user.dienThoai }}</small>
                </div>
              </div>
            </li>

            <li><hr class="dropdown-divider" /></li>

            <li>
              <router-link
                :to="{ name: 'profile' }"
                class="dropdown-item profile-btn"
                @click="isNavOpen = false"
              >
                <i class="fas fa-user"></i>
                <span>Thông tin cá nhân</span>
              </router-link>
            </li>

            <li>
              <button class="dropdown-item logout-btn" @click="logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      isNavOpen: false,
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
.custom-navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px 24px;
}

.brand-icon {
  font-size: 1.5rem;
  color: #4361ee;
}

.brand-text {
  font-weight: 700;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  gap: 8px;
}

.nav-link-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px !important;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: #a0aec0 !important;
}

.nav-link-custom:hover {
  background: rgba(67, 97, 238, 0.15);
  color: #ffffff !important;
}

.nav-link-custom.active-link {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  color: #ffffff !important;
}

.nav-link-custom i {
  font-size: 1rem;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px !important;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.user-dropdown:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
}

.user-name {
  color: #ffffff;
  font-weight: 500;
}

.dropdown-menu-custom {
  min-width: 280px;
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 16px;
  margin-top: 10px;
}

.dropdown-header {
  padding: 0 0 12px 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #7209b7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details strong {
  color: #1f2937;
  font-size: 1rem;
}

.user-details small {
  color: #6b7280;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #374151;
  border-radius: 10px;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  background: rgba(67, 97, 238, 0.1);
  color: #4361ee;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ef476f;
  border-radius: 10px;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(239, 71, 111, 0.1);
  color: #ef476f;
}
</style>
