import { createRouter, createWebHistory } from "vue-router";

import AdminLayout from "@/layouts/AdminLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import readerRoutes from "./reader.route";
import publisherRoutes from "./publisher.route";
import bookRoutes from "./book.route";

const routes = [
  // AUTH LAYOUT
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

//  Route Guard (bảo vệ trang admin)
// router.beforeEach((to, from, next) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   // Nếu chưa login mà vào trang admin → redirect về login
//   if (to.path.startsWith("/admin") && to.name !== "admin.login") {
//     if (!user) {
//       return next({ name: "admin.login" });
//     }
//   }

//   next();
// });

export default router;
