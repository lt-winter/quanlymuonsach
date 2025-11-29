import BorrowManager from "@/views/borrows/BorrowManager.vue";

export default [
  {
    path: "/borrows",
    name: "borrows",
    component: BorrowManager,
  },
  {
    path: "/borrows/add",
    name: "borrows.add",
    component: () => import("@/views/borrows/BorrowAdd.vue"),
  },
  {
    path: "/borrows/edit/:id",
    name: "borrows.edit",
    component: () => import("@/views/borrows/BorrowEdit.vue"),
    props: true,
  },
];
