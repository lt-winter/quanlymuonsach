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
              @click="
                navigate();
                isNavOpen = false;
              "
              class="nav-link nav-link-custom"
              :class="{ 'active-link': $route.name === 'home' }"
            >
              <i class="fas fa-home"></i>
              <span>Trang chủ</span>
            </a>
          </router-link>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link nav-link-custom dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
            :class="{
              'active-link':
                $route.name === 'books' ||
                $route.name === 'book.detail' ||
                $route.name === 'books.by-publisher' ||
                $route.name === 'books.by-author',
            }"
          >
            <i class="fas fa-book"></i>
            <span>Sách</span>
          </a>
          <div class="dropdown-menu">
            <router-link
              :to="{ name: 'books' }"
              custom
              v-slot="{ navigate }"
            >
              <a
                @click="
                  navigate();
                  isNavOpen = false;
                "
                class="dropdown-item"
              >
                <i class="fas fa-list"></i> Tất cả sách
              </a>
            </router-link>
            <router-link
              :to="{ name: 'books.by-publisher' }"
              custom
              v-slot="{ navigate }"
            >
              <a
                @click="
                  navigate();
                  isNavOpen = false;
                "
                class="dropdown-item"
              >
                <i class="fas fa-building"></i> Theo nhà xuất bản
              </a>
            </router-link>
            <router-link
              :to="{ name: 'books.by-author' }"
              custom
              v-slot="{ navigate }"
            >
              <a
                @click="
                  navigate();
                  isNavOpen = false;
                "
                class="dropdown-item"
              >
                <i class="fas fa-user-edit"></i> Theo tác giả
              </a>
            </router-link>
          </div>
        </li>
      </ul>

      <ul class="navbar-nav">
        <!-- Thông báo (chỉ hiện khi đăng nhập) -->
        <li v-if="user" class="nav-item dropdown notification-dropdown">
          <a
            class="nav-link notification-bell"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-expanded="false"
            @click="loadNotifications"
          >
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount > 0" class="notification-badge">{{
              unreadCount > 99 ? "99+" : unreadCount
            }}</span>
          </a>

          <div class="dropdown-menu dropdown-menu-right notification-menu">
            <div class="notification-header">
              <h6 class="mb-0">Thông báo</h6>
              <button
                v-if="notifications.length > 0"
                @click="markAllAsRead"
                class="btn-mark-all"
              >
                Đánh dấu đã đọc
              </button>
            </div>

            <div class="notification-list">
              <div v-if="loadingNotifications" class="text-center py-3">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                ></div>
              </div>

              <div
                v-else-if="notifications.length === 0"
                class="empty-notifications"
              >
                <i class="fas fa-bell-slash"></i>
                <p>Không có thông báo</p>
              </div>

              <div
                v-else
                v-for="notif in notifications"
                :key="notif._id"
                class="notification-item"
                :class="{ unread: !notif.daDoc }"
                @click="handleNotificationClick(notif)"
              >
                <div
                  class="notification-icon"
                  :class="getNotificationIconClass(notif.loai)"
                >
                  <i :class="getNotificationIcon(notif.loai)"></i>
                </div>
                <div class="notification-content">
                  <p class="notification-title">{{ notif.tieuDe }}</p>
                  <p class="notification-message">{{ notif.noiDung }}</p>
                  <small class="notification-time">{{
                    formatTime(notif.ngayTao)
                  }}</small>
                </div>
                <button
                  @click.stop="deleteNotification(notif._id)"
                  class="btn-delete-notif"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div v-if="notifications.length > 0" class="notification-footer">
              <button @click="deleteAllNotifications" class="btn-clear-all">
                <i class="fas fa-trash-alt"></i> Xóa tất cả
              </button>
            </div>
          </div>
        </li>

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
              <router-link
                :to="{ name: 'my-borrows' }"
                class="dropdown-item profile-btn"
                @click="isNavOpen = false"
              >
                <i class="fas fa-clipboard-list"></i>
                <span>Sách đã mượn</span>
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
import NotificationService from "@/services/notification.service";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      isNavOpen: false,
      notifications: [],
      unreadCount: 0,
      loadingNotifications: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.user = null;
      this.$router.push("/login");
    },
    async loadNotifications() {
      if (this.loadingNotifications) return;

      this.loadingNotifications = true;
      try {
        const result = await NotificationService.getAll();
        this.notifications = result.notifications || [];
        this.unreadCount = result.unreadCount || 0;
      } catch (error) {
        // Ignore error silently
      } finally {
        this.loadingNotifications = false;
      }
    },
    async loadUnreadCount() {
      try {
        const result = await NotificationService.getAll();
        this.unreadCount = result.unreadCount || 0;
      } catch (error) {
        // Ignore error silently
      }
    },
    async markAllAsRead() {
      try {
        await NotificationService.markAllAsRead();
        this.notifications = this.notifications.map((n) => ({
          ...n,
          daDoc: true,
        }));
        this.unreadCount = 0;
      } catch (error) {
        // Ignore error silently
      }
    },
    async handleNotificationClick(notif) {
      if (!notif.daDoc) {
        try {
          await NotificationService.markAsRead(notif._id);
          notif.daDoc = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        } catch (error) {
          // Ignore error silently
        }
      }

      // Navigate based on notification type
      if (
        notif.loai === "BORROW_APPROVED" ||
        notif.loai === "BORROW_RETURNED" ||
        notif.loai === "BORROW_OVERDUE"
      ) {
        if (notif.maMuon) {
          this.$router.push({
            name: "borrow.detail",
            params: { maMuon: notif.maMuon },
          });
        } else {
          this.$router.push({ name: "my-borrows" });
        }
      }
    },
    async deleteNotification(id) {
      try {
        await NotificationService.delete(id);
        this.notifications = this.notifications.filter((n) => n._id !== id);
        this.unreadCount = this.notifications.filter((n) => !n.daDoc).length;
      } catch (error) {
        // Ignore error silently
      }
    },
    async deleteAllNotifications() {
      if (!confirm("Bạn có chắc muốn xóa tất cả thông báo?")) return;

      try {
        await NotificationService.deleteAll();
        this.notifications = [];
        this.unreadCount = 0;
      } catch (error) {
        // Ignore error silently
      }
    },
    getNotificationIcon(type) {
      const icons = {
        BORROW_CREATED: "fas fa-book",
        BORROW_APPROVED: "fas fa-check-circle",
        BORROW_REJECTED: "fas fa-times-circle",
        BORROW_RETURNED: "fas fa-undo",
        BORROW_OVERDUE: "fas fa-exclamation-triangle",
        ACCOUNT_CREATED: "fas fa-user-plus",
      };
      return icons[type] || "fas fa-bell";
    },
    getNotificationIconClass(type) {
      const classes = {
        BORROW_CREATED: "notif-info",
        BORROW_APPROVED: "notif-success",
        BORROW_REJECTED: "notif-danger",
        BORROW_RETURNED: "notif-success",
        BORROW_OVERDUE: "notif-warning",
        ACCOUNT_CREATED: "notif-info",
      };
      return classes[type] || "notif-info";
    },
    formatTime(time) {
      if (!time) return "";
      const date = new Date(time);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Vừa xong";
      if (minutes < 60) return `${minutes} phút trước`;
      if (hours < 24) return `${hours} giờ trước`;
      if (days < 7) return `${days} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    },
  },
  mounted() {
    if (this.user) {
      this.loadUnreadCount();
      // Poll for new notifications every 30 seconds
      this.notificationInterval = setInterval(() => {
        this.loadUnreadCount();
      }, 30000);
    }
  },
  beforeUnmount() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
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
  height: 48px;
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

/* Notification Styles */
.notification-dropdown {
  margin-left: 10px;
  margin-right: 20px;
  gap: 10px;
}

.notification-bell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
}

.notification-bell:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.notification-bell i {
  font-size: 1.1rem;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef476f;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.notification-menu {
  width: 380px;
  max-height: 500px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 0;
  margin-top: 10px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.notification-header h6 {
  color: #1f2937;
  font-weight: 700;
  font-size: 1rem;
}

.btn-mark-all {
  background: none;
  border: none;
  color: #4361ee;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-mark-all:hover {
  background: rgba(67, 97, 238, 0.1);
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.empty-notifications {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-notifications i {
  font-size: 3rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-notifications p {
  margin: 0;
  font-size: 0.9rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-item.unread::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #4361ee;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.notification-icon.notif-info {
  background: rgba(67, 97, 238, 0.1);
  color: #4361ee;
}

.notification-icon.notif-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-icon.notif-warning {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.notification-icon.notif-danger {
  background: rgba(239, 71, 111, 0.1);
  color: #ef476f;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.notification-message {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0 0 4px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.btn-delete-notif {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  opacity: 0;
  transition: all 0.2s;
}

.notification-item:hover .btn-delete-notif {
  opacity: 1;
}

.btn-delete-notif:hover {
  color: #ef476f;
}

.notification-footer {
  padding: 8px 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.btn-clear-all {
  background: none;
  border: none;
  color: #ef476f;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-clear-all:hover {
  background: rgba(239, 71, 111, 0.1);
}

@media (max-width: 576px) {
  .notification-menu {
    width: 320px;
  }
}
</style>
