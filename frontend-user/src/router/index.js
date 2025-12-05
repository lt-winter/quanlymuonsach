import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

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
  {
    path: "/register",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "register",
        component: () => import("@/views/Register.vue"),
      },
    ],
  },

  // MAIN LAYOUT
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/books",
        name: "books",
        component: () => import("@/views/Books.vue"),
      },
      {
        path: "/books/publisher",
        name: "books.by-publisher",
        component: () => import("@/views/BooksByPublisher.vue"),
      },
      {
        path: "/books/author",
        name: "books.by-author",
        component: () => import("@/views/BooksByAuthor.vue"),
      },
      {
        path: "/books/:id",
        name: "book.detail",
        component: () => import("@/views/BookDetail.vue"),
        props: true,
      },
      {
        path: "/profile",
        name: "profile",
        component: () => import("@/views/Profile.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/my-borrows",
        name: "my-borrows",
        component: () => import("@/views/MyBorrows.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/my-borrows/:maMuon",
        name: "borrow.detail",
        component: () => import("@/views/BorrowDetail.vue"),
        meta: { requiresAuth: true },
        props: true,
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

/* Route Guard */
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu trang yêu cầu đăng nhập mà chưa đăng nhập
  if (to.meta.requiresAuth && !user) {
    return next({ name: "login" });
  }

  // Nếu đã đăng nhập mà vào trang login/register -> redirect về home
  if ((to.name === "login" || to.name === "register") && user) {
    return next({ name: "home" });
  }

  next();
});

export default router;
