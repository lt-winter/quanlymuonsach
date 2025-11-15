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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
