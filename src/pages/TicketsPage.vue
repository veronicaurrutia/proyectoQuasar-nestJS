<template>
  <q-page class="tickets-page">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-secondary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="local_activity" size="48px" class="q-mr-md" />
              Gestión de Tickets
            </h1>
            <p class="page-subtitle text-white opacity-90">
              Crea, administra y da seguimiento a todos tus requerimientos
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="secondary"
              icon="add_circle"
              label="Nuevo Ticket"
              size="lg"
              class="glossy shadow-5"
              @click="dialogTicket = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions Section -->
    <div class="filters-section q-pa-lg">
      <div class="container">
        <q-card class="filters-card">
          <q-card-section>
            <div class="row q-col-gutter-md items-end">
              <div class="col-12 col-sm-6 col-md-3">
                <q-input
                  v-model="filter"
                  placeholder="Buscar tickets..."
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="estadoFilter"
                  :options="estadoOptions"
                  label="Estado"
                  outlined
                  dense
                  clearable
                  map-options
                  emit-value
                />
              </div>
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="categoriaFilter"
                  :options="categoriaOptions"
                  label="Categoría"
                  outlined
                  dense
                  clearable
                  map-options
                  emit-value
                />
              </div>
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="prioridadFilter"
                  :options="prioridadOptions"
                  label="Prioridad"
                  outlined
                  dense
                  clearable
                  map-options
                  emit-value
                />
              </div>
              <div class="col-12 col-md-3">
                <div class="row q-gutter-sm">
                  <q-btn
                    color="primary"
                    icon="filter_list"
                    label="Aplicar Filtros"
                    @click="aplicarFiltros"
                  />
                  <q-btn
                    color="grey-7"
                    icon="clear"
                    label="Limpiar"
                    outline
                    @click="limpiarFiltros"
                  />
                  <q-btn
                    color="secondary"
                    icon="download"
                    label="Exportar"
                    outline
                    @click="exportarTickets"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="table-card">
          <q-card-section>
            <div class="table-header q-mb-md">
              <div class="row items-center">
                <div class="col">
                  <h3 class="table-title">
                    <q-icon name="list_alt" class="q-mr-sm" />
                    Mis Tickets ({{ filteredTickets.length }})
                  </h3>
                </div>
                <div class="col-auto">
                  <q-btn-toggle
                    v-model="vistaActual"
                    :options="vistaOptions"
                    color="primary"
                    outline
                  />
                </div>
              </div>
            </div>

            <!-- Table View -->
            <div v-if="vistaActual === 'tabla'">
              <q-table
                :rows="filteredTickets"
                :columns="columns"
                :pagination="pagination"
                :loading="cargandoTickets"
                :filter="filter"
                class="modern-table"
                bordered
                separator="horizontal"
                @request="onRequest"
              >
                <template v-slot:body-cell-index="props">
                  <q-td :props="props" class="text-center">
                    <q-chip 
                      color="primary" 
                      text-color="white" 
                      :label="props.pageIndex + 1"
                      size="sm"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-titulo="props">
                  <q-td :props="props">
                    <div class="ticket-title">
                      <div class="text-weight-medium">{{ props.row.titulo }}</div>
                      <div class="text-caption text-grey-6">ID: #{{ props.row.id }}</div>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-estado="props">
                  <q-td :props="props" class="text-center">
                    <q-badge 
                      :color="getEstadoColor(props.row.estado)" 
                      :label="getEstadoLabel(props.row.estado)"
                      class="estado-badge"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-prioridad="props">
                  <q-td :props="props" class="text-center">
                    <q-chip 
                      :color="getPrioridadColor(props.row.prioridad)" 
                      :icon="getPrioridadIcon(props.row.prioridad)"
                      :label="props.row.prioridad || 'Media'"
                      size="sm"
                      text-color="white"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <div class="actions-container">
                      <q-btn
                        color="primary"
                        icon="visibility"
                        size="sm"
                        round
                        flat
                        @click="verTicket(props.row)"
                      >
                        <q-tooltip>Ver detalles</q-tooltip>
                      </q-btn>
                      <q-btn
                        color="secondary"
                        icon="edit"
                        size="sm"
                        round
                        flat
                        @click="editarTicket(props.row)"
                      >
                        <q-tooltip>Editar</q-tooltip>
                      </q-btn>
                      <q-btn
                        color="negative"
                        icon="delete"
                        size="sm"
                        round
                        flat
                        @click="eliminarTicket(props.row)"
                      >
                        <q-tooltip>Eliminar</q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </div>

            <!-- Card View -->
            <div v-else-if="vistaActual === 'cards'" class="cards-view">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6 col-lg-4" v-for="ticket in filteredTickets" :key="ticket.id">
                  <q-card class="ticket-card hover-lift">
                    <q-card-section>
                      <div class="row items-start q-mb-sm">
                        <div class="col">
                          <div class="ticket-id text-caption text-grey-6">#{{ ticket.id }}</div>
                          <h4 class="ticket-title-card q-my-xs">{{ ticket.titulo }}</h4>
                        </div>
                        <div class="col-auto">
                          <q-badge 
                            :color="getEstadoColor(ticket.estado)" 
                            :label="getEstadoLabel(ticket.estado)"
                          />
                        </div>
                      </div>
                      
                      <p class="ticket-description text-grey-7 q-mb-md">
                        {{ ticket.descripcion || 'Sin descripción' }}
                      </p>
                      
                      <div class="ticket-meta q-mb-md">
                        <div class="row q-col-gutter-xs">
                          <div class="col-6">
                            <q-chip 
                              :icon="getPrioridadIcon(ticket.prioridad)"
                              :color="getPrioridadColor(ticket.prioridad)"
                              :label="ticket.prioridad || 'Media'"
                              size="sm"
                              text-color="white"
                            />
                          </div>
                          <div class="col-6 text-right">
                            <q-chip 
                              icon="category"
                              color="grey-6"
                              :label="ticket.categoria?.nombre || 'Sin categoría'"
                              size="sm"
                              text-color="white"
                            />
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    
                    <q-card-actions align="right">
                      <q-btn flat color="primary" icon="visibility" @click="verTicket(ticket)">
                        Ver
                      </q-btn>
                      <q-btn flat color="secondary" icon="edit" @click="editarTicket(ticket)">
                        Editar
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Crear Ticket -->
    <q-dialog v-model="dialogTicket" persistent class="ticket-dialog">
      <q-card class="dialog-card" style="width: 800px; max-width: 90vw">
        <q-card-section class="dialog-header bg-primary text-white">
          <div class="row items-center">
            <q-avatar square icon="add_circle" color="white" text-color="primary" />
            <span class="q-ml-sm text-h6">Crear Nuevo Ticket</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="ticket.titulo"
                label="Título del Ticket *"
                outlined
                :rules="[val => !!val || 'El título es requerido']"
                hint="Describe brevemente el problema o solicitud"
              />
            </div>
            
            <div class="col-12">
              <q-input
                v-model="ticket.descripcion"
                label="Descripción Detallada *"
                type="textarea"
                rows="4"
                outlined
                :rules="[val => !!val || 'La descripción es requerida']"
                hint="Proporciona todos los detalles relevantes"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.areaId"
                :options="areas"
                label="Área *"
                outlined
                map-options
                emit-value
                :rules="[val => !!val || 'Selecciona un área']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.categoriaId"
                :options="categorias"
                label="Categoría *"
                outlined
                map-options
                emit-value
                :rules="[val => !!val || 'Selecciona una categoría']"
                :disable="!ticket.areaId"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.centroId"
                :options="centros"
                label="Centro"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.prioridad"
                :options="prioridadOptions"
                label="Prioridad"
                outlined
                map-options
                emit-value
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogTicket = false"
            :disable="cargandoIcon"
          />
          <q-btn
            label="Crear Ticket"
            color="primary"
            icon="add_circle"
            @click="crearTicket"
            :loading="cargandoIcon"
            class="glossy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Editar Ticket -->
    <q-dialog v-model="dialogTicketEdit" persistent class="ticket-dialog">
      <q-card class="dialog-card" style="width: 800px; max-width: 90vw">
        <q-card-section class="dialog-header bg-secondary text-white">
          <div class="row items-center">
            <q-avatar square icon="edit" color="white" text-color="secondary" />
            <span class="q-ml-sm text-h6">Editar Ticket #{{ ticket.id }}</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="ticket.titulo"
                label="Título del Ticket"
                outlined
              />
            </div>
            
            <div class="col-12">
              <q-input
                v-model="ticket.descripcion"
                label="Descripción"
                type="textarea"
                rows="4"
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.areaId"
                :options="areas"
                label="Área"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.categoriaId"
                :options="categorias"
                label="Categoría"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.estadoId"
                :options="estadoOptions"
                label="Estado"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="ticket.prioridad"
                :options="prioridadOptions"
                label="Prioridad"
                outlined
                map-options
                emit-value
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogTicketEdit = false"
            :disable="cargandoIcon"
          />
          <q-btn
            label="Actualizar"
            color="secondary"
            icon="save"
            @click="actualizarTicket"
            :loading="cargandoIcon"
            class="glossy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

export default {
  data() {
    return {
      filter: "",
      dialogTicket: false,
      cargandoIcon: false,
      cargandoTickets: false,
      dialogTicketEdit: false,
      vistaActual: 'tabla',
      
      // Filtros
      estadoFilter: null,
      categoriaFilter: null,
      prioridadFilter: null,
      
      centros: [],
      areas: [],
      cuentas: [],
      empresas: [],
      categorias: [],
      tickets: [],
      usuarioId: null,
      
      ticket: {
        titulo: null,
        codigo: null,
        descripcion: null,
        areaId: null,
        estadoId: null,
        usuarioId: null,
        centroId: null,
        categoriaId: null,
        prioridad: 'Media',
      },

      vistaOptions: [
        { label: 'Tabla', value: 'tabla', icon: 'table_view' },
        { label: 'Tarjetas', value: 'cards', icon: 'view_module' }
      ],

      estadoOptions: [
        { label: 'Abierto', value: 1 },
        { label: 'En Progreso', value: 2 },
        { label: 'Resuelto', value: 3 },
        { label: 'Cerrado', value: 4 },
        { label: 'Cancelado', value: 5 }
      ],

      categoriaOptions: [],

      prioridadOptions: [
        { label: 'Baja', value: 'Baja' },
        { label: 'Media', value: 'Media' },
        { label: 'Alta', value: 'Alta' },
        { label: 'Crítica', value: 'Crítica' }
      ],

      columns: [
        {
          name: "index",
          label: "#",
          headerClasses: "bg-primary text-white",
          align: "center",
          field: (row) => row.id,
        },
        {
          name: "titulo",
          required: true,
          label: "Título",
          align: "left",
          field: (row) => row.titulo,
          headerClasses: "bg-primary text-white",
          style: "max-width: 200px",
        },
        {
          name: "Area",
          label: "Área",
          field: (row) => (row.area ? row.area.nombre : "Sin Área"),
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "Categoria",
          label: "Categoría",
          field: (row) => (row.categoria ? row.categoria.nombre : "Sin Categoría"),
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "estado",
          label: "Estado",
          field: "estado",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "prioridad",
          label: "Prioridad",
          field: "prioridad",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "Solicitante",
          label: "Solicitante",
          field: (row) => (row.usuario ? row.usuario.email : "Sin Usuario"),
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "actions",
          label: "Acciones",
          field: "actions",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
      ],

      pagination: {
        page: 1,
        rowsPerPage: 10,
        sortBy: 'id',
        descending: true
      },

      empresaId: null,
    };
  },
  
  computed: {
    filteredTickets() {
      let filtrados = [...this.tickets];
      
      if (this.estadoFilter) {
        filtrados = filtrados.filter(ticket => ticket.estadoId === this.estadoFilter);
      }
      
      if (this.categoriaFilter) {
        filtrados = filtrados.filter(ticket => ticket.categoriaId === this.categoriaFilter);
      }
      
      if (this.prioridadFilter) {
        filtrados = filtrados.filter(ticket => ticket.prioridad === this.prioridadFilter);
      }
      
      return filtrados;
    }
  },
  
  created() {
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    this.empresaId = usuarioStore.empresa;
    this.usuarioId = usuarioStore.usuario;
    this.obtenerMisTickets();
  },
  
  watch: {
    dialogTicket() {
      if (this.dialogTicket == true) {
        this.resetTicket();
        this.obtenerCentros();
        this.obtenerAreas();
      }
    },
    dialogTicketEdit() {
      if (this.dialogTicketEdit == false) {
        this.obtenerMisTickets();
      } else {
        this.obtenerEmpresas();
      }
    },
    "ticket.areaId"(valor) {
      if (valor != null) {
        this.obtenerCategorias(valor);
      }
    },
  },
  
  methods: {
    async obtenerMisTickets() {
      this.cargandoTickets = true;
      try {
        const response = await api.get("/ticket/usuario/" + this.usuarioId);
        this.tickets = response.data;
        this.actualizarCategoriaOptions();
      } catch (error) {
        console.error('Error al obtener tickets:', error);
        Notify.create({
          type: 'negative',
          message: 'Error al cargar los tickets'
        });
      } finally {
        this.cargandoTickets = false;
      }
    },

    actualizarCategoriaOptions() {
      const categorias = [...new Set(this.tickets.map(t => t.categoria?.nombre).filter(Boolean))];
      this.categoriaOptions = categorias.map(cat => ({ label: cat, value: cat }));
    },

    async obtenerCentros() {
      try {
        this.centros = [];
        if (this.empresaId == null) {
          const response = await api.get("/centro");
          this.centros = response.data;
        } else {
          const response = await api.get("/centro/empresa/" + this.empresaId);
          response.data.forEach((item) => {
            let dato = { label: item.nombre, value: item.id };
            this.centros.push(dato);
          });
        }
      } catch (error) {
        console.error('Error al obtener centros:', error);
      }
    },

    async obtenerEmpresas() {
      try {
        this.empresas = [];
        if (this.cuentaId == null) {
          const response = await api.get("/empresa");
          response.data.forEach((item) => {
            let dato = {
              value: item.id,
              label: item.nombre,
            };
            this.empresas.push(dato);
          });
        } else {
          const response = await api.get("/empresa/cuenta/" + this.cuentaId);
          response.data.forEach((item) => {
            let dato = {
              value: item.id,
              label: item.nombre,
            };
            this.empresas.push(dato);
          });
        }
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    },

    async obtenerCategorias(id) {
      try {
        this.categorias = [];
        const response = await api.get("/categoria/area/" + id);
        response.data.forEach((item) => {
          let dato = { label: item.nombre, value: item.id };
          this.categorias.push(dato);
        });
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    },

    async obtenerAreas() {
      try {
        this.areas = [];
        const response = await api.get("/area/empresa/" + this.empresaId);
        response.data.forEach((item) => {
          let dato = { label: item.nombre, value: item.id };
          this.areas.push(dato);
        });
      } catch (error) {
        console.error('Error al obtener áreas:', error);
      }
    },

    async crearTicket() {
      this.cargandoIcon = true;
      try {
        this.ticket.usuarioId = this.usuarioId;
        this.ticket.estadoId = 6;
        const response = await api.post("/ticket", this.ticket);
        Notify.create({
          type: 'positive',
          message: 'Ticket creado exitosamente',
          icon: 'check_circle'
        });
        this.dialogTicket = false;
        this.obtenerMisTickets();
      } catch (error) {
        console.error('Error al crear ticket:', error);
        Notify.create({
          type: 'negative',
          message: 'Error al crear el ticket'
        });
      } finally {
        this.cargandoIcon = false;
      }
    },

    editarTicket(row) {
      this.dialogTicketEdit = true;
      this.ticket = { ...row };
    },

    verTicket(row) {
      Notify.create({
        type: 'info',
        message: `Visualizando ticket: ${row.titulo}`,
        icon: 'visibility'
      });
    },

    async actualizarTicket() {
      this.cargandoIcon = true;
      try {
        let id = this.ticket.id;
        let payload = { ...this.ticket };
        delete payload.id;
        delete payload.area;
        delete payload.categoria;
        delete payload.usuario;
        delete payload.centro;
        delete payload.eliminacion;
        
        const response = await api.patch("/ticket/" + id, payload);
        Notify.create({
          type: 'positive',
          message: 'Ticket actualizado exitosamente',
          icon: 'save'
        });
        this.dialogTicketEdit = false;
        this.obtenerMisTickets();
      } catch (error) {
        console.error('Error al actualizar ticket:', error);
        Notify.create({
          type: 'negative',
          message: 'Error al actualizar el ticket'
        });
      } finally {
        this.cargandoIcon = false;
      }
    },

    eliminarTicket(row) {
      Notify.create({
        timeout: 0,
        message: `¿Desea eliminar el ticket "${row.titulo}"?`,
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                await api.delete("/ticket/" + row.id);
                Notify.create({
                  type: 'positive',
                  message: 'Ticket eliminado exitosamente'
                });
                this.obtenerMisTickets();
              } catch (error) {
                console.error("Error al eliminar el Ticket:", error);
                Notify.create({
                  type: 'negative',
                  message: 'Error al eliminar el ticket'
                });
              }
            },
          },
          {
            label: "Cancelar",
            handler: () => {},
          },
        ],
      });
    },

    resetTicket() {
      this.ticket = {
        titulo: null,
        codigo: null,
        descripcion: null,
        areaId: null,
        estadoId: null,
        usuarioId: null,
        centroId: null,
        categoriaId: null,
        prioridad: 'Media',
      };
    },

    aplicarFiltros() {
      Notify.create({
        type: 'info',
        message: 'Filtros aplicados',
        icon: 'filter_list'
      });
    },

    limpiarFiltros() {
      this.estadoFilter = null;
      this.categoriaFilter = null;
      this.prioridadFilter = null;
      this.filter = '';
      Notify.create({
        type: 'info',
        message: 'Filtros limpiados',
        icon: 'clear'
      });
    },

    exportarTickets() {
      Notify.create({
        type: 'info',
        message: 'Exportando tickets...',
        icon: 'download'
      });
    },

    onRequest(props) {
      this.pagination = props.pagination;
    },

    // Utility methods
    getEstadoColor(estado) {
      const colors = {
        1: 'blue',
        2: 'orange',
        3: 'green',
        4: 'grey',
        5: 'red'
      };
      return colors[estado] || 'grey';
    },

    getEstadoLabel(estado) {
      const labels = {
        1: 'Abierto',
        2: 'En Progreso',
        3: 'Resuelto',
        4: 'Cerrado',
        5: 'Cancelado'
      };
      return labels[estado] || 'Desconocido';
    },

    getPrioridadColor(prioridad) {
      const colors = {
        'Baja': 'green',
        'Media': 'blue',
        'Alta': 'orange',
        'Crítica': 'red'
      };
      return colors[prioridad] || 'blue';
    },

    getPrioridadIcon(prioridad) {
      const icons = {
        'Baja': 'keyboard_arrow_down',
        'Media': 'remove',
        'Alta': 'keyboard_arrow_up',
        'Crítica': 'priority_high'
      };
      return icons[prioridad] || 'remove';
    }
  },
};
</script>

<style lang="scss" scoped>
.tickets-page {
  min-height: 100vh;
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  line-height: 1.5;
}

.filters-section {
  margin-top: -30px;
  position: relative;
  z-index: 1;
}

.filters-card, .table-card {
  border-radius: 15px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.table-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modern-table {
  border-radius: 10px;
  overflow: hidden;
  
  .q-table__top,
  .q-table__bottom {
    border-radius: 0;
  }
}

.ticket-card {
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  }
}

.ticket-title-card {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
}

.ticket-description {
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.actions-container {
  display: flex;
  gap: 4px;
}

.dialog-card {
  border-radius: 15px;
  overflow: hidden;
}

.dialog-header {
  padding: 20px 24px;
}

.estado-badge {
  font-weight: 600;
}

.ticket-title {
  min-width: 180px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.cards-view {
  min-height: 300px;
}

@media (max-width: 768px) {
  .filters-section {
    margin-top: -15px;
  }
  
  .page-header {
    text-align: center;
  }
  
  .actions-container {
    justify-content: center;
  }
}
</style>
