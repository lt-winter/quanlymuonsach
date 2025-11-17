import ReaderManager from "@/views/admin/readers/ReaderManager.vue";

export default [
  {
    path: "/admin/readers",
    name: "readers",
    component: ReaderManager,
  },
  {
    path: "/admin/readers/edit/:id",
    name: "readers.edit",
    component: () => import("@/views/admin/readers/ReaderEdit.vue"),
    props: true,
  },
  {
    path: "/admin/readers/add",
    name: "readers.add",
    component: () => import("@/views/admin/readers/ReaderAdd.vue"),
  },
];
