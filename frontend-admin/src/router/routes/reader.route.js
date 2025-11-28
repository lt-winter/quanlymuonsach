import ReaderManager from "@/views/readers/ReaderManager.vue";

export default [
  {
    path: "/readers",
    name: "readers",
    component: ReaderManager,
  },
  {
    path: "/readers/edit/:id",
    name: "readers.edit",
    component: () => import("@/views/readers/ReaderEdit.vue"),
    props: true,
  },
  {
    path: "/readers/add",
    name: "readers.add",
    component: () => import("@/views/readers/ReaderAdd.vue"),
  },
];
