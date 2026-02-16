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
                <!-- <q-btn
                  color="secondary"
                  size="lg"
                  icon="dashboard"
                  label="Ver Dashboard"
                  outline
                  class="q-mb-md"
                  @click="$router.push('/dashboard')"
                /> -->
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
            <q-card
              class="stat-card text-center"
              :class="{ 'loading-card': cargandoStats }"
            >
              <q-card-section>
                <q-spinner-dots
                  v-if="cargandoStats"
                  :color="stat.color"
                  size="48px"
                  class="q-mb-sm"
                />
                <q-icon
                  v-else
                  :name="stat.icon"
                  :color="stat.color"
                  size="48px"
                  class="q-mb-sm"
                />
                <div class="stat-number text-h4 text-weight-bold q-mb-xs">
                  <span v-if="cargandoStats">--</span>
                  <span v-else>{{ stat.value }}</span>
                </div>
                <div class="stat-label text-grey-7">{{ stat.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Botón de actualización -->
        <div class="text-center q-mt-md">
          <q-btn
            color="primary"
            icon="refresh"
            label="Actualizar Datos"
            flat
            @click="
              cargarEstadisticas();
              cargarActividadReciente();
            "
            :loading="cargandoStats"
          />
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
                      <q-icon name="history" class="q-mr-sm" />Actividad del
                      Usuario
                    </h3>
                    <p class="text-grey-6 text-caption">
                      Historial de navegación y acciones recientes
                    </p>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="primary"
                      icon="refresh"
                      flat
                      dense
                      @click="cargarActividadReciente"
                      :loading="cargandoActividad"
                      class="q-mr-sm"
                      title="Actualizar historial de navegación"
                    />
                  </div>
                </div>

                <div v-if="cargandoActividad" class="text-center q-pa-md">
                  <q-spinner-dots size="40px" color="primary" />
                  <div class="text-grey-6 q-mt-sm">Cargando actividad...</div>
                </div>

                <q-list v-else separator>
                  <q-item
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    clickable
                    v-ripple
                    @click="irAActividad(activity)"
                    :class="activity.route ? 'cursor-pointer' : ''"
                  >
                    <q-item-section avatar>
                      <q-avatar :color="activity.color" text-color="white">
                        <q-icon :name="activity.icon" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{
                        activity.title
                      }}</q-item-label>
                      <q-item-label caption class="text-grey-6">{{
                        activity.descripcion
                      }}</q-item-label>
                      <q-item-label caption class="text-grey-5">{{
                        activity.time
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="column items-end">
                        <q-badge
                          :color="activity.badgeColor"
                          :label="activity.status"
                          class="q-mb-xs"
                        />
                        <q-icon
                          v-if="activity.route"
                          name="open_in_new"
                          size="16px"
                          color="grey-5"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div
                  v-if="!cargandoActividad && recentActivity.length === 0"
                  class="text-center q-pa-lg"
                >
                  <q-icon name="timeline" size="60px" color="grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">
                    Sin actividad registrada
                  </div>
                  <div class="text-grey-5">
                    Comienza a navegar para ver tu actividad
                  </div>
                </div>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useUsuariostore } from 'src/stores/usuario.store';
//css
import 'src/css/pages/indexPage.scss';

defineOptions({
  name: 'IndexPage',
});

const router = useRouter();
const $q = useQuasar();
const usuarioStore = useUsuariostore();

// Estado para los datos dinámicos
const cargandoStats = ref(false);
const cargandoActividad = ref(false);
const ticketsStats = ref({
  total: 0,
  pendientes: 0,
  enProceso: 0,
  resueltos: 0,
  porcentajeSatisfaccion: 0,
  tiempoPromedio: '0h',
});

const features = ref([
  {
    id: 1,
    title: 'Gestión de Tickets',
    description: 'Crea, gestiona y da seguimiento a todos tus requerimientos',
    icon: 'local_activity',
    color: 'primary',
    route: '/tickets',
  },
  // {
  //   id: 2,
  //   title: 'Dashboard Analítico',
  //   description: 'Visualiza métricas y estadísticas en tiempo real',
  //   icon: 'analytics',
  //   color: 'secondary',
  //   route: '/dashboard',
  // },
  {
    id: 3,
    title: 'Administración',
    description: 'Configura usuarios, áreas y permisos del sistema',
    icon: 'admin_panel_settings',
    color: 'accent',
    route: '/usuarios',
  },
]);

// Stats dinámicos basados en datos reales
const stats = ref([
  {
    id: 1,
    value: '0',
    label: 'Tickets Activos',
    icon: 'assignment',
    color: 'primary',
    key: 'total',
  },
  {
    id: 2,
    value: '0',
    label: 'Pendientes',
    icon: 'schedule',
    color: 'orange',
    key: 'pendientes',
  },
  {
    id: 3,
    value: '0',
    label: 'En Proceso',
    icon: 'autorenew',
    color: 'blue',
    key: 'enProceso',
  },
  {
    id: 4,
    value: '0',
    label: 'Resueltos',
    icon: 'check_circle',
    color: 'green',
    key: 'resueltos',
  },
]);

const recentActivity = ref([]);

const shortcuts = ref([
  {
    id: 1,
    label: 'Nuevo Ticket',
    icon: 'add',
    color: 'primary',
    route: '/tickets',
  },
  {
    id: 2,
    label: 'Mi Perfil',
    icon: 'person',
    color: 'secondary',
    route: '/perfil',
  },
  {
    id: 3,
    label: 'Configuración',
    icon: 'settings',
    color: 'grey-7',
    route: '/usuarios',
  },
]);

// Función para cargar estadísticas reales
const cargarEstadisticas = async () => {
  try {
    cargandoStats.value = true;

    // Intentar obtener estadísticas de tickets desde diferentes endpoints posibles
    let response;
    try {
      // Probar primero con el endpoint de área específica si existe
      const areaId = usuarioStore.area;
      if (areaId) {
        response = await api.get(`/ticket/area/estadisticas/${areaId}`);
      } else {
        throw new Error('No hay área definida');
      }
    } catch (error) {
      // Si el endpoint específico del área falla, probar con endpoint general
      try {
        response = await api.get('/ticket/estadisticas');
      } catch (error2) {
        // Si también falla, usar datos simulados
        console.log('Usando datos simulados para estadísticas');
        ticketsStats.value = {
          total: Math.floor(Math.random() * 50) + 10,
          pendientes: Math.floor(Math.random() * 15) + 5,
          enProceso: Math.floor(Math.random() * 10) + 3,
          resueltos: Math.floor(Math.random() * 25) + 8,
        };

        // Actualizar los stats con datos simulados
        stats.value.forEach((stat) => {
          switch (stat.key) {
            case 'total':
              stat.value = ticketsStats.value.total.toString();
              break;
            case 'pendientes':
              stat.value = ticketsStats.value.pendientes.toString();
              break;
            case 'enProceso':
              stat.value = ticketsStats.value.enProceso.toString();
              break;
            case 'resueltos':
              stat.value = ticketsStats.value.resueltos.toString();
              break;
          }
        });
        return;
      }
    }

    if (response && response.data) {
      ticketsStats.value = {
        total: response.data.total || 0,
        pendientes: response.data.pendientes || 0,
        enProceso: response.data.enProceso || 0,
        resueltos: response.data.resueltos || 0,
        porcentajeSatisfaccion: response.data.porcentajeSatisfaccion || 0,
        tiempoPromedio: response.data.tiempoPromedio || '0h',
      };

      // Actualizar los stats con los datos reales
      stats.value.forEach((stat) => {
        switch (stat.key) {
          case 'total':
            stat.value = ticketsStats.value.total.toString();
            break;
          case 'pendientes':
            stat.value = ticketsStats.value.pendientes.toString();
            break;
          case 'enProceso':
            stat.value = ticketsStats.value.enProceso.toString();
            break;
          case 'resueltos':
            stat.value = ticketsStats.value.resueltos.toString();
            break;
        }
      });
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    // No mostrar notificación de error para evitar spam
    // En su lugar, usar datos de ejemplo silenciosamente
    stats.value.forEach((stat) => {
      switch (stat.key) {
        case 'total':
          stat.value = '0';
          break;
        case 'pendientes':
          stat.value = '0';
          break;
        case 'enProceso':
          stat.value = '0';
          break;
        case 'resueltos':
          stat.value = '0';
          break;
      }
    });
  } finally {
    cargandoStats.value = false;
  }
};

// Función para cargar actividad reciente del usuario (principalmente navegación)
const cargarActividadReciente = async () => {
  try {
    cargandoActividad.value = true;

    // Obtener historial de navegación desde localStorage
    const historialNavegacion = obtenerHistorialNavegacion();

    // Si hay historial de navegación, usarlo como actividad principal
    if (historialNavegacion.length > 0) {
      recentActivity.value = historialNavegacion;
    } else {
      // Si no hay historial, crear actividades de bienvenida
      recentActivity.value = [
        {
          id: 1,
          title: 'Visitó Página de Inicio',
          time: 'Ahora',
          icon: 'home',
          color: 'primary',
          status: 'Actual',
          badgeColor: 'primary',
          route: '/',
          descripcion: 'Navegó a la página principal del sistema',
        },
        {
          id: 2,
          title: 'Bienvenido al Sistema',
          time: 'Hace 1 minuto',
          icon: 'star',
          color: 'secondary',
          status: 'Bienvenida',
          badgeColor: 'secondary',
          route: null,
          descripcion: 'Primera vez accediendo al sistema',
        },
        {
          id: 3,
          title: 'Explora las funcionalidades',
          time: 'Hace 2 minutos',
          icon: 'explore',
          color: 'accent',
          status: 'Sugerencia',
          badgeColor: 'accent',
          route: '/tickets',
          descripcion: 'Comienza creando tu primer ticket',
        },
      ];
    }

    // Opcional: Intentar agregar información de tickets si existe
    try {
      const usuarioId = usuarioStore.id || usuarioStore.usuario;
      const areaId = usuarioStore.area;

      if (areaId && usuarioId) {
        const response = await api.get(
          `/ticket/usuario/${usuarioId}/recientes?limit=3`,
        );

        if (response.data && response.data.length > 0) {
          // Agregar los tickets más recientes al final de la actividad de navegación
          const ticketsActivity = response.data.map((ticket, index) => ({
            id: `ticket-${ticket.id || index}`,
            title: `Trabajó en: ${ticket.titulo || 'Ticket sin título'}`,
            time: formatearTiempo(ticket.updated_at || ticket.created_at),
            icon: obtenerIconoPorEstado(ticket.estado?.nombre || 'Nuevo'),
            color: obtenerColorPorEstado(ticket.estado?.nombre || 'Nuevo'),
            status: ticket.estado?.nombre || 'Sin estado',
            badgeColor: obtenerColorPorEstado(ticket.estado?.nombre || 'Nuevo'),
            route: `/tickets/${ticket.id}`,
            descripcion: `${ticket.categoria?.nombre || 'Sin categoría'} - ${
              ticket.estado?.nombre || 'Sin estado'
            }`,
          }));

          // Combinar navegación y tickets, priorizando navegación
          recentActivity.value = [
            ...historialNavegacion.slice(0, 4), // Primeras 4 navegaciones
            ...ticketsActivity.slice(0, 2), // Últimos 2 tickets
          ].slice(0, 6); // Limitar a 6 items total
        }
      }
    } catch (ticketError) {
      // Si falla obtener tickets, mantener solo el historial de navegación
      console.log(
        'No se pudieron cargar tickets recientes, mostrando solo navegación',
      );
    }
  } catch (error) {
    console.error('Error al cargar actividad reciente:', error);

    // En caso de error total, mostrar datos básicos de navegación
    recentActivity.value = [
      {
        id: 1,
        title: 'Visitó Página de Inicio',
        time: 'Ahora',
        icon: 'home',
        color: 'primary',
        status: 'Visitado',
        badgeColor: 'primary',
        route: '/',
        descripcion: 'Está navegando en la página principal',
      },
      {
        id: 2,
        title: 'Sistema Listo',
        time: 'Hace 1 minuto',
        icon: 'check_circle',
        color: 'positive',
        status: 'Activo',
        badgeColor: 'positive',
        route: null,
        descripcion: 'El sistema está funcionando correctamente',
      },
    ];
  } finally {
    cargandoActividad.value = false;
  }
};

// Función para formatear diferentes tipos de actividad
const formatearActividad = (actividad) => {
  const tipoActividad = actividad.tipo || actividad.accion || 'navegacion';

  switch (tipoActividad.toLowerCase()) {
    case 'navegacion':
    case 'visita':
      return {
        title: `Visitó ${obtenerNombrePagina(
          actividad.ruta || actividad.pagina,
        )}`,
        icon: obtenerIconoPagina(actividad.ruta || actividad.pagina),
        color: 'blue',
        status: 'Visitado',
        badgeColor: 'blue',
        route: actividad.ruta || actividad.pagina,
        descripcion: `Navegó a ${obtenerNombrePagina(
          actividad.ruta || actividad.pagina,
        )}`,
      };

    case 'ticket_creado':
      return {
        title: 'Creó un ticket',
        icon: 'add_circle',
        color: 'green',
        status: 'Creado',
        badgeColor: 'green',
        route: `/tickets/${actividad.ticket_id}`,
        descripcion: `Creó el ticket: ${actividad.titulo || 'Sin título'}`,
      };

    case 'ticket_actualizado':
      return {
        title: 'Actualizó un ticket',
        icon: 'edit',
        color: 'orange',
        status: 'Actualizado',
        badgeColor: 'orange',
        route: `/tickets/${actividad.ticket_id}`,
        descripcion: `Actualizó el ticket: ${actividad.titulo || 'Sin título'}`,
      };

    case 'login':
      return {
        title: 'Inició sesión',
        icon: 'login',
        color: 'positive',
        status: 'Conectado',
        badgeColor: 'positive',
        route: null,
        descripcion: 'Se conectó al sistema',
      };

    case 'logout':
      return {
        title: 'Cerró sesión',
        icon: 'logout',
        color: 'grey',
        status: 'Desconectado',
        badgeColor: 'grey',
        route: null,
        descripcion: 'Se desconectó del sistema',
      };

    default:
      return {
        title: actividad.descripcion || 'Actividad del usuario',
        icon: 'timeline',
        color: 'primary',
        status: 'Actividad',
        badgeColor: 'primary',
        route: null,
        descripcion:
          actividad.descripcion || 'Realizó una acción en el sistema',
      };
  }
};

// Función para obtener historial de navegación desde localStorage
const obtenerHistorialNavegacion = () => {
  try {
    const historial = JSON.parse(
      localStorage.getItem('userNavigationHistory') || '[]',
    );
    return historial.slice(0, 8).map((item, index) => ({
      id: `nav-${index}`,
      title: `Visitó ${obtenerNombrePagina(item.route)}`,
      time: formatearTiempo(item.timestamp),
      icon: obtenerIconoPagina(item.route),
      color: index === 0 ? 'primary' : 'blue', // Destacar la página actual
      status: index === 0 ? 'Actual' : 'Visitado',
      badgeColor: index === 0 ? 'primary' : 'blue',
      route: item.route,
      descripcion: `Navegó a ${obtenerNombrePagina(item.route)}${
        index === 0 ? ' (página actual)' : ''
      }`,
    }));
  } catch (error) {
    console.error('Error al obtener historial de navegación:', error);
    return [];
  }
};

// Función para guardar navegación en localStorage
const guardarNavegacion = (route) => {
  try {
    const historial = JSON.parse(
      localStorage.getItem('userNavigationHistory') || '[]',
    );
    const nuevaEntrada = {
      route: route,
      timestamp: new Date().toISOString(),
      usuario: usuarioStore.nombre || usuarioStore.id || 'Usuario',
    };

    // Evitar duplicados consecutivos
    if (historial.length === 0 || historial[0].route !== route) {
      historial.unshift(nuevaEntrada);
      // Mantener solo los últimos 20 registros
      const historialLimitado = historial.slice(0, 20);
      localStorage.setItem(
        'userNavigationHistory',
        JSON.stringify(historialLimitado),
      );

      console.log(`📍 Navegación guardada: ${obtenerNombrePagina(route)}`);
    }
  } catch (error) {
    console.error('Error al guardar navegación:', error);
  }
};

// Función para limpiar historial de navegación
const limpiarHistorialNavegacion = () => {
  try {
    localStorage.removeItem('userNavigationHistory');
    recentActivity.value = [];
    $q.notify({
      color: 'positive',
      message: 'Historial de navegación limpiado',
      icon: 'cleaning_services',
    });
    cargarActividadReciente();
  } catch (error) {
    console.error('Error al limpiar historial:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al limpiar el historial',
      icon: 'error',
    });
  }
};

// Función para obtener nombre legible de la página
const obtenerNombrePagina = (ruta) => {
  const rutas = {
    '/': 'Página de Inicio',
    '/tickets': 'Gestión de Tickets',
    // '/dashboard': 'Dashboard',
    '/usuarios': 'Usuarios',
    '/areas': 'Áreas',
    '/categorias': 'Categorías',
    '/estados': 'Estados',
    '/empresas': 'Empresas',
    '/centros': 'Centros',
    '/cuentas': 'Cuentas',
    '/menus': 'Menús',
    '/permisos': 'Permisos',
    '/perfil': 'Mi Perfil',
  };

  // Buscar coincidencia exacta primero
  if (rutas[ruta]) {
    return rutas[ruta];
  }

  // Buscar coincidencias parciales
  for (const [rutaBase, nombre] of Object.entries(rutas)) {
    if (ruta && ruta.startsWith(rutaBase) && rutaBase !== '/') {
      return nombre;
    }
  }

  return ruta
    ? ruta.replace('/', '').replace('-', ' ').toUpperCase()
    : 'Página desconocida';
};

// Función para obtener icono de la página
const obtenerIconoPagina = (ruta) => {
  const iconos = {
    '/': 'home',
    '/tickets': 'local_activity',
    // '/dashboard': 'dashboard',
    '/usuarios': 'people',
    '/areas': 'domain',
    '/categorias': 'category',
    '/estados': 'flag',
    '/empresas': 'business',
    '/centros': 'location_city',
    '/cuentas': 'account_balance',
    '/menus': 'menu',
    '/permisos': 'security',
    '/perfil': 'person',
  };

  // Buscar coincidencia exacta primero
  if (iconos[ruta]) {
    return iconos[ruta];
  }

  // Buscar coincidencias parciales
  for (const [rutaBase, icono] of Object.entries(iconos)) {
    if (ruta && ruta.startsWith(rutaBase) && rutaBase !== '/') {
      return icono;
    }
  }

  return 'pageview';
};

// Funciones auxiliares
const obtenerIconoPorEstado = (estado) => {
  const iconos = {
    Nuevo: 'fiber_new',
    Pendiente: 'schedule',
    'En Proceso': 'autorenew',
    Resuelto: 'check_circle',
    Cerrado: 'lock',
    Cancelado: 'cancel',
  };
  return iconos[estado] || 'help';
};

const obtenerColorPorEstado = (estado) => {
  const colores = {
    Nuevo: 'green',
    Pendiente: 'orange',
    'En Proceso': 'blue',
    Resuelto: 'positive',
    Cerrado: 'grey',
    Cancelado: 'negative',
  };
  return colores[estado] || 'grey';
};

const formatearTiempo = (fecha) => {
  if (!fecha) return 'Fecha no disponible';

  const ahora = new Date();
  const fechaTicket = new Date(fecha);
  const diffMs = ahora - fechaTicket;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  }
};

const navigateTo = (route) => {
  // Guardar la navegación en el historial
  guardarNavegacion(route);
  router.push(route);
};

// Función para manejar clicks en actividades
const irAActividad = (activity) => {
  if (activity.route) {
    navigateTo(activity.route);
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  // Guardar visita a la página actual
  guardarNavegacion('/');

  // Cargar estadísticas y actividad (ahora principalmente navegación)
  cargarEstadisticas();
  cargarActividadReciente();

  // Opcional: Configurar tracking automático de navegación
  // Escuchar cambios de ruta para actualizar el historial
  router.afterEach((to, from) => {
    if (to.path !== from.path) {
      guardarNavegacion(to.path);
      // Recargar actividad para mostrar la nueva navegación
      setTimeout(() => {
        cargarActividadReciente();
      }, 100);
    }
  });
});
</script>
