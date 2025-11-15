import { createRouter, createWebHistory } from "vue-router";
import readerRoutes from "./reader.route";
import publisherRoutes from "./publisher.route";

const routes = [
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin/AdminHomepage.vue"),
  },
  ...readerRoutes,
  ...publisherRoutes,
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

export default router;
