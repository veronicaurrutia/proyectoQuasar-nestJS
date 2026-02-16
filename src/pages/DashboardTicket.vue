<!-- <template>
  <q-page class="dashboard-page">
    <!-- Header Section 
    <div class="dashboard-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="dashboard-title text-white q-mb-sm">
              <q-icon name="dashboard" size="48px" class="q-mr-md" />
              Dashboard de Tickets
            </h1>
            <p class="dashboard-subtitle text-white opacity-90">
              Monitorea el rendimiento y estado de tus requerimientos en tiempo
              real
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="refresh"
              label="Actualizar"
              class="glossy shadow-5"
              @click="actualizarDatos"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards Section 
    <div class="kpi-section q-pa-lg">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <div
            class="col-12 col-sm-6 col-md-3"
            v-for="kpi in kpis"
            :key="kpi.id"
          >
            <q-card class="kpi-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar
                  :color="kpi.color"
                  size="60px"
                  class="q-mb-md"
                  :class="kpi.pulse ? 'pulse-animation' : ''"
                >
                  <q-icon :name="kpi.icon" size="30px" color="white" />
                </q-avatar>
                <div class="kpi-value text-h4 text-weight-bold q-mb-xs">
                  {{ kpi.value }}
                </div>
                <div class="kpi-label text-grey-7 q-mb-sm">{{ kpi.label }}</div>
                <div class="kpi-change" :class="`text-${kpi.trendColor}`">
                  <q-icon :name="kpi.trendIcon" size="16px" class="q-mr-xs" />
                  {{ kpi.change }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content 
    <div class="main-content q-pa-lg">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <!-- Chart Section 
          <div class="col-12 col-lg-8">
            <q-card class="chart-card">
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <div class="col">
                    <h3 class="chart-title">
                      <q-icon name="bar_chart" class="q-mr-sm" />
                      Tickets por Categoría
                    </h3>
                    <p class="text-grey-6">
                      Distribución de tickets según categorías
                    </p>
                  </div>
                  <div class="col-auto">
                    <q-btn-dropdown
                      color="primary"
                      icon="filter_list"
                      label="Filtros"
                      outline
                      dense
                    >
                      <q-list>
                        <q-item clickable v-close-popup>
                          <q-item-section>Última semana</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>Último mes</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>Último trimestre</q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </div>
                <div class="chart-container">
                  <graficoCategorias ref="graficoCategorias" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Sidebar 
          <div class="col-12 col-lg-4">
            <!-- Priority Tickets 
            <q-card class="priority-card q-mb-lg">
              <q-card-section>
                <h3 class="priority-title">
                  <q-icon name="priority_high" color="red" class="q-mr-sm" />
                  Tickets Prioritarios
                </h3>
                <q-list separator class="q-mt-md">
                  <q-item
                    v-for="ticket in priorityTickets"
                    :key="ticket.id"
                    clickable
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-avatar :color="ticket.priority.color" size="40px">
                        <q-icon :name="ticket.priority.icon" color="white" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{
                        ticket.title
                      }}</q-item-label>
                      <q-item-label caption>{{ ticket.category }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-right">
                        <q-badge
                          :color="ticket.priority.color"
                          :label="ticket.priority.label"
                        />
                        <div class="text-caption text-grey-6 q-mt-xs">
                          {{ ticket.time }}
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div class="text-center q-mt-md">
                  <q-btn
                    color="primary"
                    flat
                    label="Ver todos"
                    icon-right="arrow_forward"
                    @click="$router.push('/tickets')"
                  />
                </div>
              </q-card-section>
            </q-card>

            <!-- Quick Actions 
            <q-card class="actions-card">
              <q-card-section>
                <h3 class="actions-title">
                  <q-icon name="flash_on" color="orange" class="q-mr-sm" />
                  Acciones Rápidas
                </h3>
                <div class="q-mt-md">
                  <q-btn
                    v-for="action in quickActions"
                    :key="action.id"
                    :color="action.color"
                    :icon="action.icon"
                    :label="action.label"
                    class="full-width q-mb-sm glossy"
                    @click="action.action()"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Recent Activity Section --
        <div class="row q-mt-lg">
          <div class="col-12">
            <q-card class="activity-card">
              <q-card-section>
                <div class="row items-center q-mb-md">
                  <div class="col">
                    <h3 class="activity-title">
                      <q-icon name="timeline" class="q-mr-sm" />
                      Actividad Reciente
                    </h3>
                  </div>
                  <div class="col-auto">
                    <q-toggle
                      v-model="autoRefresh"
                      label="Actualización automática"
                      color="primary"
                    />
                  </div>
                </div>

                <q-timeline color="primary" class="q-mt-md">
                  <q-timeline-entry
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    :color="activity.color"
                    :icon="activity.icon"
                    :title="activity.title"
                    :subtitle="activity.subtitle"
                  >
                    <div class="text-grey-7">{{ activity.description }}</div>
                    <div class="text-caption text-grey-5 q-mt-xs">
                      {{ activity.time }}
                    </div>
                  </q-timeline-entry>
                </q-timeline>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
import graficoCategorias from "src/dashboard/GraficoCategoria.vue";
//css
import "/src/css/pages/dashboardTicket.scss";

export default {
  components: {
    graficoCategorias,
  },
  data() {
    return {
      filter: "",
      dialogCentro: false,
      cargandoIcon: false,
      dialogCentroEdit: false,
      centros: [],
      paises: [],
      cuentas: [],
      empresas: [],
      empresaId: null,
      cuentaId: null,
      areaId: null,
      ticketsCategoria: null,
      autoRefresh: false,

      kpis: [
        {
          id: 1,
          label: "Total Tickets",
          value: "156",
          icon: "assignment",
          color: "primary",
          change: "+12%",
          trendIcon: "trending_up",
          trendColor: "green",
          pulse: false,
        },
        {
          id: 2,
          label: "Pendientes",
          value: "24",
          icon: "schedule",
          color: "orange",
          change: "-5%",
          trendIcon: "trending_down",
          trendColor: "green",
          pulse: true,
        },
        {
          id: 3,
          label: "Resueltos Hoy",
          value: "18",
          icon: "check_circle",
          color: "green",
          change: "+8%",
          trendIcon: "trending_up",
          trendColor: "green",
          pulse: false,
        },
        {
          id: 4,
          label: "Tiempo Promedio",
          value: "2.3h",
          icon: "timer",
          color: "blue",
          change: "-15min",
          trendIcon: "trending_down",
          trendColor: "green",
          pulse: false,
        },
      ],

      priorityTickets: [
        {
          id: 1,
          title: "Sistema de facturación inactivo",
          category: "Sistemas Críticos",
          time: "Hace 15 min",
          priority: {
            label: "Crítico",
            color: "red",
            icon: "error",
          },
        },
        {
          id: 2,
          title: "Solicitud de acceso VPN",
          category: "Accesos",
          time: "Hace 1 hora",
          priority: {
            label: "Alto",
            color: "orange",
            icon: "warning",
          },
        },
        {
          id: 3,
          title: "Actualización de permisos",
          category: "Seguridad",
          time: "Hace 2 horas",
          priority: {
            label: "Medio",
            color: "blue",
            icon: "info",
          },
        },
      ],

      quickActions: [
        {
          id: 1,
          label: "Crear Ticket",
          icon: "add_circle",
          color: "primary",
          action: () => this.$router.push("/tickets"),
        },
        {
          id: 2,
          label: "Generar Reporte",
          icon: "assessment",
          color: "secondary",
          action: () => this.generarReporte(),
        },
        {
          id: 3,
          label: "Exportar Datos",
          icon: "download",
          color: "accent",
          action: () => this.exportarDatos(),
        },
      ],

      recentActivity: [
        {
          id: 1,
          title: "Ticket Creado",
          subtitle: "TK-2024-001 - Problema de conectividad",
          description: "Juan Pérez reportó un problema de conexión a internet",
          time: "Hace 5 minutos",
          icon: "add_circle",
          color: "green",
        },
        {
          id: 2,
          title: "Ticket Asignado",
          subtitle: "TK-2024-002 - Solicitud de software",
          description: "Ticket asignado al equipo de TI para revisión",
          time: "Hace 20 minutos",
          icon: "assignment_ind",
          color: "blue",
        },
        {
          id: 3,
          title: "Ticket Resuelto",
          subtitle: "TK-2024-003 - Configuración de email",
          description:
            "Problema de configuración de correo resuelto exitosamente",
          time: "Hace 1 hora",
          icon: "check_circle",
          color: "green",
        },
      ],
    };
  },
  created() {
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    this.empresaId = usuarioStore.empresa;
    this.areaId = usuarioStore.area;
    if (this.areaId != null) {
      this.obtenerTicketsCategoria();
    }
  },
  watch: {
    autoRefresh(newVal) {
      if (newVal) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    },
  },
  methods: {
    async obtenerTicketsCategoria() {
      try {
        const response = await api.get(
          "/ticket/area/categorias/dashboard/" + this.areaId
        );
        this.ticketsCategoria = response.data;
        if (this.ticketsCategoria != null) {
          this.$refs.graficoCategorias.montarGrafico(this.ticketsCategoria);
        }
      } catch (error) {
        console.error("Error al obtener tickets por categoría:", error);
        Notify.create({
          type: "negative",
          message: "Error al cargar los datos del dashboard",
        });
      }
    },

    actualizarDatos() {
      this.obtenerTicketsCategoria();
      Notify.create({
        type: "positive",
        message: "Datos actualizados correctamente",
        icon: "refresh",
      });
    },

    generarReporte() {
      Notify.create({
        type: "info",
        message: "Generando reporte...",
        icon: "assessment",
      });
    },

    exportarDatos() {
      Notify.create({
        type: "info",
        message: "Exportando datos...",
        icon: "download",
      });
    },

    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.obtenerTicketsCategoria();
      }, 30000); // 30 segundos
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    },
  },

  beforeUnmount() {
    this.stopAutoRefresh();
  },
};
</script> -->
