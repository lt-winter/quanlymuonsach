import { createRouter, createWebHistory } from "vue-router";

import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import readerRoutes from "./routes/reader.route";
import publisherRoutes from "./routes/publisher.route";
import bookRoutes from "./routes/book.route";
import borrowRoutes from "./routes/borrow.route";
import employeeRoutes from "./routes/employee.route";

const routes = [
  // AUTH LAYOUT - Login
  {
    path: "/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "login",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },

  // ADMIN LAYOUT
  {
    path: "/",
    component: AdminLayout,
    children: [
      ...readerRoutes,
      ...publisherRoutes,
      ...bookRoutes,
      ...borrowRoutes,
      ...employeeRoutes,

      // Trang mặc định
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
    ],
  },

  // 404 Not Found
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },

  // Redirect /admin to /
  {
    path: "/admin/:pathMatch(.*)*",
    redirect: to => {
      const subPath = to.params.pathMatch ? to.params.pathMatch.join('/') : '';
      return '/' + subPath;
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Kiểm tra session hết hạn */
function isSessionExpired() {
  const expiry = localStorage.getItem("admin_session_expiry");
  if (!expiry) return true;
  return Date.now() > parseInt(expiry);
}

/* Refresh session (gia hạn thêm 15 phút khi hoạt động) */
function refreshSession() {
  const expiryTime = Date.now() + 15 * 60 * 1000; // 15 phút
  localStorage.setItem("admin_session_expiry", expiryTime.toString());
}

/* Xóa session */
function clearSession() {
  localStorage.removeItem("admin_user");
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_session_expiry");
}

/* Route Guard (bảo vệ trang admin) */
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("admin_user"));

  // Kiểm tra session hết hạn
  if (user && isSessionExpired()) {
    clearSession();
    return next({ name: "login" });
  }

  // Nếu chưa login mà vào trang admin -> redirect về login
  if (to.name !== "login") {
    if (!user) {
      return next({ name: "login" });
    }
    // Gia hạn session khi hoạt động
    refreshSession();
  }

  // Nếu đã login mà vào trang login -> redirect về trang chủ
  if (to.name === "login") {
    if (user) {
      return next({ path: "/" });
    }
  }

  // Nếu không phải superadmin mà vào trang quản lý nhân viên -> redirect về trang chủ
  if (to.path.startsWith("/employees")) {
    if (user && user.role !== "superadmin") {
      return next({ path: "/" });
    }
  }

  next();
});

export default router;
