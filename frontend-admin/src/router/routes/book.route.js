import BookManager from "@/views/books/BookManager.vue";

export default [
  {
    path: "/books",
    name: "books",
    component: BookManager,
  },
  {
    path: "/books/add",
    name: "books.add",
    component: () => import("@/views/books/BookAdd.vue"),
  },
  {
    path: "/books/edit/:id",
    name: "books.edit",
    component: () => import("@/views/books/BookEdit.vue"),
    props: true,
  },
];
