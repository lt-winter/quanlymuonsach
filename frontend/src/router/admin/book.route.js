import BookManager from "@/views/admin/books/BookManager.vue";

export default [
  {
    path: "/admin/books",
    name: "books",
    component: BookManager,
  },
  {
    path: "/admin/books/add",
    name: "books.add",
    component: () => import("@/views/admin/books/BookAdd.vue"),
  },
  {
    path: "/admin/books/edit/:id",
    name: "books.edit",
    component: () => import("@/views/admin/books/BookEdit.vue"),
    props: true,
  },
];
