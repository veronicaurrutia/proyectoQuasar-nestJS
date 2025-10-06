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
        path: "home",
        component: () => import("layouts/Home.vue"),
      },
      {
        path: "perfil",
        component: () => import("layouts/PerfilPage.vue"),
      },
      {
        path: "edit-perfil",
        component: () => import("layouts/EditPerfil.vue"),
      },
      {
        path: "cuentas",
        component: () => import("pages/CuentasPage.vue"),
      },
      {
        path: "empresas",
        component: () => import("pages/EmpresasPage.vue"),
      },
      {
        path: "areas",
        component: () => import("pages/AreasPage.vue"),
      },
      {
        path: "usuarios",
        component: () => import("pages/UsuariosPage.vue"),
      },
      {
        path: "centros",
        component: () => import("pages/CentrosPage.vue"),
      },
      {
        path: "estados",
        component: () => import("pages/EstadosPage.vue"),
      },
      {
        path: "categorias",
        component: () => import("pages/CategoriasPage.vue"),
      },
      {
        path: "tickets",
        component: () => import("pages/TicketsPage.vue"),
      },
      {
        path: "reporte",
        component: () => import("pages/DashboardTicket.vue"),
      },
      {
        path: "admintickets",
        component: () => import("pages/TicketAdmin.vue"),
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
