const routes = [
  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/IndexPage.vue"),
      },
      {
        path: "perfil",
        component: () => import("../layouts/PerfilPage.vue"),
      },
      {
        path: "edit-perfil",
        component: () => import("../layouts/EditPerfil.vue"),
      },
      {
        path: "cuentas",
        component: () => import("../pages/CuentasPage.vue"),
      },
      {
        path: "empresas",
        component: () => import("../pages/EmpresasPage.vue"),
      },
      {
        path: "areas",
        component: () => import("../pages/AreasPage.vue"),
      },
      {
        path: "usuarios",
        component: () => import("../pages/UsuariosPage.vue"),
      },
      {
        path: "centros",
        component: () => import("../pages/CentrosPage.vue"),
      },
      {
        path: "estados",
        component: () => import("../pages/EstadosPage.vue"),
      },
      {
        path: "categorias",
        component: () => import("../pages/CategoriasPage.vue"),
      },
      {
        path: "tickets",
        component: () => import("../pages/TicketsPage.vue"),
      },
      {
        path: "reporte",
        component: () => import("../pages/DashboardTicket.vue"),
      },
      {
        path: "admintickets",
        component: () => import("../pages/TicketAdmin.vue"),
      },
      {
        path: "permisos",
        component: () => import("../pages/PermisosPage.vue"),
      },
      {
        path: "menus",
        component: () => import("../pages/MenusPage.vue"),
      },
    ],
  },

  // 🔹 RUTA FUERA DEL MAINLAYOUT
  {
    path: "/select-area",
    name: "select-area",
    meta: { requiresAuth: true },
    component: () => import("../pages/SelectAreaPage.vue"),
  },

  // 🔹 LOGIN (ya fuera del MainLayout)
  {
    title: "Login",
    name: "login",
    path: "/login",
    meta: { requiresAuth: false },
    component: () => import("../layouts/LoginLayout.vue"),
  },

  // 🔹 ERROR 404
  {
    path: "/:catchAll(.*)*",
    component: () => import("../pages/ErrorNotFound.vue"),
  },
];

export default routes;
