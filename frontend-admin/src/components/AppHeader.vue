<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark sticky-top px-4 custom-navbar"
  >
    <router-link to="/" class="navbar-brand d-flex align-items-center">
      <i class="fas fa-book-reader brand-icon mr-2"></i>
      <span class="brand-text">Quản lý Thư viện</span>
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      @click="isNavOpen = !isNavOpen"
      aria-controls="adminNavbar"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div
      class="collapse navbar-collapse"
      :class="{ show: isNavOpen }"
      id="adminNavbar"
    >
      <ul class="navbar-nav mx-auto nav-menu">
        <li class="nav-item">
          <router-link
            :to="{ name: 'readers' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-users"></i>
            <span>Độc giả</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'publishers' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-building"></i>
            <span>Nhà xuất bản</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'books' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-book"></i>
            <span>Sách</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'borrows' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-book-reader"></i>
            <span>Mượn sách</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'borrows.approval' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-check-circle"></i>
            <span>Duyệt phiếu</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            :to="{ name: 'reports' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-chart-line"></i>
            <span>Báo cáo</span>
          </router-link>
        </li>

        <li class="nav-item" v-if="user && user.role === 'superadmin'">
          <span class="nav-divider"></span>
        </li>

        <li class="nav-item" v-if="user && user.role === 'superadmin'">
          <router-link
            :to="{ name: 'employees' }"
            class="nav-link nav-link-custom"
            @click="isNavOpen = false"
          >
            <i class="fas fa-user-cog"></i>
            <span>Nhân viên</span>
          </router-link>
        </li>
      </ul>

      <ul class="navbar-nav" v-if="user">
        <li class="nav-item dropdown">
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
            <span class="user-name">{{ user.username }}</span>
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
                  <strong>{{ user.fullName }}</strong>
                  <small>{{ user.username }}</small>
                </div>
              </div>
            </li>

            <li><hr class="dropdown-divider" /></li>

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
      user: JSON.parse(localStorage.getItem("admin_user")) || null,
      isNavOpen: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_session_expiry");
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

.nav-link-custom.router-link-active {
  background: linear-gradient(135deg, #4361ee, #7209b7);
  color: #ffffff !important;
}

.nav-link-custom i {
  font-size: 1rem;
}

.nav-divider {
  display: block;
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 8px;
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
