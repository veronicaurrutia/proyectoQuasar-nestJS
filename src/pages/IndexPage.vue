<template>
  <q-page class="welcome-page">
    <!-- Burbujas flotantes lentas -->
    <div class="bubbles-container">
      <div class="bubble" v-for="n in 8" :key="n"></div>
    </div>

    <!-- Hero Section -->
    <div class="hero-section q-pa-lg">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="hero-content">
              <h1 class="hero-title text-white q-mb-md">
                <q-icon name="support_agent" size="60px" class="q-mr-md" />
                Central de Requerimientos
              </h1>
              <p class="hero-subtitle text-white q-mb-xl">
                Gestiona tus solicitudes de manera eficiente y mantente
                conectado con tu equipo
              </p>
              <div class="hero-actions">
                <q-btn
                  color="accent"
                  size="lg"
                  icon="add_circle"
                  label="Crear Ticket"
                  class="q-mr-md q-mb-md glossy shadow-5"
                  @click="$router.push('/tickets')"
                />
                <q-btn
                  color="secondary"
                  size="lg"
                  icon="dashboard"
                  label="Ver Dashboard"
                  outline
                  class="q-mb-md"
                  @click="$router.push('/dashboard')"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="hero-visual">
              <q-card class="welcome-card glossy shadow-10">
                <q-card-section class="text-center">
                  <div class="hero-avatar-container q-mb-md">
                    <img
                      src="src/assets/loginsa.png"
                      alt="Logo empresa"
                      class="hero-company-logo"
                    />
                  </div>
                  <h3 class="text-primary q-mb-sm">¡Bienvenido!</h3>
                  <p class="text-grey-7">Tu espacio de trabajo está listo</p>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section q-pa-lg">
      <div class="container">
        <h2 class="section-title text-center q-mb-xl">
          Funcionalidades Principales
        </h2>
        <div class="row q-col-gutter-lg">
          <div
            class="col-12 col-md-4"
            v-for="feature in features"
            :key="feature.id"
          >
            <q-card
              class="feature-card full-height hover-lift"
              @click="navigateTo(feature.route)"
            >
              <q-card-section class="text-center">
                <q-avatar size="80px" :color="feature.color" class="q-mb-md">
                  <q-icon :name="feature.icon" size="40px" color="white" />
                </q-avatar>
                <h4 class="q-mb-sm">{{ feature.title }}</h4>
                <p class="text-grey-7">{{ feature.description }}</p>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  :color="feature.color"
                  label="Acceder"
                  flat
                  icon-right="arrow_forward"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Section -->
    <div class="stats-section q-pa-lg bg-grey-1">
      <div class="container">
        <h2 class="section-title text-center q-mb-xl">Resumen Rápido</h2>
        <div class="row q-col-gutter-md">
          <div
            class="col-12 col-sm-6 col-md-3"
            v-for="stat in stats"
            :key="stat.id"
          >
            <q-card class="stat-card text-center">
              <q-card-section>
                <q-icon
                  :name="stat.icon"
                  :color="stat.color"
                  size="48px"
                  class="q-mb-sm"
                />
                <div class="stat-number text-h4 text-weight-bold q-mb-xs">
                  {{ stat.value }}
                </div>
                <div class="stat-label text-grey-7">{{ stat.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="activity-section q-pa-lg">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-8">
            <q-card class="activity-card">
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <div class="col">
                    <h3>
                      <q-icon name="history" class="q-mr-sm" />Actividad
                      Reciente
                    </h3>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="primary"
                      flat
                      label="Ver todo"
                      icon-right="arrow_forward"
                    />
                  </div>
                </div>
                <q-list separator>
                  <q-item
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    clickable
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-avatar :color="activity.color" text-color="white">
                        <q-icon :name="activity.icon" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ activity.title }}</q-item-label>
                      <q-item-label caption>{{ activity.time }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-badge
                        :color="activity.badgeColor"
                        :label="activity.status"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="shortcuts-card">
              <q-card-section>
                <h3>
                  <q-icon name="flash_on" class="q-mr-sm" />Accesos Rápidos
                </h3>
                <div class="q-mt-md">
                  <q-btn
                    v-for="shortcut in shortcuts"
                    :key="shortcut.id"
                    :color="shortcut.color"
                    :icon="shortcut.icon"
                    :label="shortcut.label"
                    class="full-width q-mb-sm"
                    @click="navigateTo(shortcut.route)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
//css
import "src/css/pages/indexPage.scss";

defineOptions({
  name: "IndexPage",
});

const router = useRouter();

const features = ref([
  {
    id: 1,
    title: "Gestión de Tickets",
    description: "Crea, gestiona y da seguimiento a todos tus requerimientos",
    icon: "local_activity",
    color: "primary",
    route: "/tickets",
  },
  {
    id: 2,
    title: "Dashboard Analítico",
    description: "Visualiza métricas y estadísticas en tiempo real",
    icon: "analytics",
    color: "secondary",
    route: "/dashboard",
  },
  {
    id: 3,
    title: "Administración",
    description: "Configura usuarios, áreas y permisos del sistema",
    icon: "admin_panel_settings",
    color: "accent",
    route: "/usuarios",
  },
]);

const stats = ref([
  {
    id: 1,
    value: "24",
    label: "Tickets Activos",
    icon: "assignment",
    color: "primary",
  },
  {
    id: 2,
    value: "12",
    label: "Pendientes",
    icon: "schedule",
    color: "orange",
  },
  {
    id: 3,
    value: "89%",
    label: "Satisfacción",
    icon: "sentiment_very_satisfied",
    color: "green",
  },
  {
    id: 4,
    value: "2.3h",
    label: "Tiempo Promedio",
    icon: "timer",
    color: "blue",
  },
]);

const recentActivity = ref([
  {
    id: 1,
    title: "Nuevo ticket creado - Solicitud de acceso",
    time: "Hace 15 minutos",
    icon: "add_circle",
    color: "green",
    status: "Nuevo",
    badgeColor: "green",
  },
  {
    id: 2,
    title: "Ticket resuelto - Problema de conexión",
    time: "Hace 1 hora",
    icon: "check_circle",
    color: "blue",
    status: "Resuelto",
    badgeColor: "blue",
  },
  {
    id: 3,
    title: "Ticket en progreso - Actualización de software",
    time: "Hace 2 horas",
    icon: "hourglass_empty",
    color: "orange",
    status: "En progreso",
    badgeColor: "orange",
  },
]);

const shortcuts = ref([
  {
    id: 1,
    label: "Nuevo Ticket",
    icon: "add",
    color: "primary",
    route: "/tickets",
  },
  {
    id: 2,
    label: "Mi Perfil",
    icon: "person",
    color: "secondary",
    route: "/perfil",
  },
  {
    id: 3,
    label: "Configuración",
    icon: "settings",
    color: "grey-7",
    route: "/usuarios",
  },
]);

const navigateTo = (route) => {
  router.push(route);
};
</script>
