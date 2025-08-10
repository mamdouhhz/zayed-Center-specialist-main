import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import List from "@/views/patients/index.vue";
import Create from "@/views/patients/create.vue";
import Edit from "@/views/patients/edit.vue";
import View from "@/views/patients/view.vue";

const patientsRoutes: Array<RouteRecordRaw> = [
  {
    path: "/patients-list",
    name: "patients-list",
    component: List,
    meta: {
      pageTitle: "قائمة المرضى",
      breadcrumbs: ["المرضى "],
    },
  },
  {
    path: "/patients-create",
    name: "patients-create",
    component: Create,
    meta: {
      pageTitle: "اضافة مريض",
      // breadcrumbs: ["patients", "Create"],
    },
  },
  {
    path: "/patients-edit/:id",
    name: "patients-edit",
    component: Edit,
    meta: {
      pageTitle: "تعديل بيانات المريض",
      // breadcrumbs: ["patients", "Edit"],
    },
  },
  {
    path: "/patients-view/:id",
    name: "patients-view",
    component: View,
    meta: {
      pageTitle: "عرض بيانات المريض",
      // breadcrumbs: ["patients", "View"],
    },
  },
];

export default patientsRoutes;
