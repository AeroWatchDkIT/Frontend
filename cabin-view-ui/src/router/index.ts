import { createRouter, createWebHashHistory  } from "vue-router";

const router = createRouter({
  history: createWebHashHistory (import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("@/views/MainView.vue"),
    },
    {
      path: "/tables", 
      name: "tables", 
      component: () => import("@/views/TableView.vue"),
    }
  ],
});

export default router;
