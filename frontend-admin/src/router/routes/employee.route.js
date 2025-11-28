import EmployeeManager from "@/views/employees/EmployeeManager.vue";

export default [
  {
    path: "/employees",
    name: "employees",
    component: EmployeeManager,
  },
  {
    path: "/employees/add",
    name: "employees.add",
    component: () => import("@/views/employees/EmployeeAdd.vue"),
  },
  {
    path: "/employees/edit/:id",
    name: "employees.edit",
    component: () => import("@/views/employees/EmployeeEdit.vue"),
    props: true,
  },
];
