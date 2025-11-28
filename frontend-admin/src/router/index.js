import { createRouter, createWebHistory } from "vue-router";

import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import readerRoutes from "./routes/reader.route";
import publisherRoutes from "./routes/publisher.route";
import bookRoutes from "./routes/book.route";
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Route Guard (bảo vệ trang admin) */
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("admin_user"));

  // Nếu chưa login mà vào trang admin -> redirect về login
  if (to.name !== "login") {
    if (!user) {
      return next({ name: "login" });
    }
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
