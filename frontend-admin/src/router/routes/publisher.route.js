import PublisherManager from "@/views/publishers/PublisherManager.vue";

export default [
  {
    path: "/publishers",
    name: "publishers",
    component: PublisherManager,
  },
  {
    path: "/publishers/edit/:id",
    name: "publishers.edit",
    component: () => import("@/views/publishers/PublisherEdit.vue"),
    props: true,
  },
  {
    path: "/publishers/add",
    name: "publishers.add",
    component: () => import("@/views/publishers/PublisherAdd.vue"),
  },
];
