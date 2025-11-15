import PublisherManager from "@/views/admin/publishers/PublisherManager.vue";

export default [
  {
    path: "/admin/publishers",
    name: "publishers",
    component: PublisherManager,
  },
  {
    path: "/admin/publishers/edit/:id",
    name: "publishers.edit",
    component: () => import("@/views/admin/publishers/PublisherEdit.vue"),
    props: true,
  },
  {
    path: "/admin/publishers/add",
    name: "publishers.add",
    component: () => import("@/views/admin/publishers/PublisherAdd.vue"),
  },
];
