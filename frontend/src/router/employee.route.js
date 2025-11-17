import EmployeeManager from "@/views/admin/employees/EmployeeManager.vue";

export default [
  {
    path: "/admin/employees",
    name: "employees",
    component: EmployeeManager,
  },
  {
    path: "/admin/employees/add",
    name: "employees.add",
    component: () => import("@/views/admin/employees/EmployeeAdd.vue"),
  },
  {
    path: "/admin/employees/edit/:id",
    name: "employees.edit",
    component: () => import("@/views/admin/employees/EmployeeEdit.vue"),
    props: true,
  },
];
