import { createRouter, createWebHashHistory  } from "vue-router";

const router = createRouter({
  history: createWebHashHistory (import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/components/LoginPage.vue")
    },
    {
      path: "/main",
      name: "main",
      component: () => import("@/views/MainView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/tables", 
      name: "tables", 
      component: () => import("@/views/TableView.vue"),
      meta: { requiresAuth: true }
    }
  ],
});

router.beforeEach((to, from, next) => {
  const loggedIn = sessionStorage.getItem("loggedIn") === "true";
  // If the route requires authentication and the user is not logged in, redirect to login
  if (to.meta.requiresAuth && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
