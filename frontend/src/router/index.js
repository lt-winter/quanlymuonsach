import { createRouter, createWebHistory } from "vue-router";

import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import readerRoutes from "./admin/reader.route";
import publisherRoutes from "./admin/publisher.route";
import bookRoutes from "./admin/book.route";
import employeeRoutes from "./admin/employee.route";

const routes = [
  // HOME PAGE
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Homepage.vue"),
  },
  // AUTH LAYOUT
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
  {
    path: "/admin/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "admin.login",
        component: () => import("@/views/admin/Login.vue"),
      },
    ],
  },

  // ADMIN LAYOUT
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      ...readerRoutes,
      ...publisherRoutes,
      ...bookRoutes,
      ...employeeRoutes,

      // Trang mặc định khi vào /admin
      {
        path: "",
        name: "admin.dashboard",
        component: () => import("@/views/admin/AdminHomepage.vue"),
      },
    ],
  },
  // 404 Not Found
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/admin/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Route Guard (bảo vệ trang admin) */
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu chưa login mà vào trang admin -> redirect về login
  if (to.path.startsWith("/admin") && to.name !== "admin.login") {
    if (!user) {
      return next({ name: "admin.login" });
    }
  }

  // Nếu đã login mà vào trang login -> redirect về trang admin
  if (to.name === "admin.login") {
    if (user) {
      return next({ path: "/admin" });
    }
  }

  // Nếu không phải superadmin mà vào trang quản lý nhân viên -> redirect về trang chủ
  if (to.path.startsWith("/admin/employees")) {
    if (user && user.role !== "superadmin") {
      return next({ path: "/admin" });
    }
  }

  next();
});

export default router;
