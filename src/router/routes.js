const routes = [
  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "perfil",
        component: () => import("pages/PerfilPage.vue"),
      },
    ],
  },
  {
    title: "Login",
    name: "login",
    path: "/login",
    meta: { requiresAuth: false },
    component: () => import("layouts/LoginLayout.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
