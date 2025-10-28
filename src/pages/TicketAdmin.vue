<template>
  <q-page class="tickets-admin-page">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="local_activity" size="48px" class="q-mr-md" />
              Administración de Tickets
            </h1>
            <p class="page-subtitle text-white">
              Administra los tickets para los requerimientos de tu área
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add"
              label="Crear Ticket"
              size="lg"
              class="glossy shadow-5"
              @click="dialogTicket = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="table-card" elevation="13">
          <q-card-section>
            <h3 class="table-title q-mb-md">
              <q-icon name="list_alt" class="q-mr-sm" />
              Lista de Tickets
            </h3>
            <q-table
              bordered
              title="Tickets"
              :rows="tickets"
              :columns="columns"
              :rows-per-page-options="[10]"
              :filter="filter"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props" align="center">
                  {{ props.pageIndex + 1 }}
                </q-td>
              </template>
              <template v-slot:body-cell-Estado="props">
                <q-td :props="props">
                  <div>
                    <q-btn-dropdown
                      dense
                      no-caps
                      class="q-ma-none q-pa-none"
                      :label="props.row.estado.nombre"
                    >
                      <q-list>
                        <template
                          v-for="(item, index) in estadosTicket"
                          :key="index"
                        >
                          <q-item
                            clickable
                            :style="item.color"
                            v-close-popup
                            @click="cambiarEstado(item, props.row)"
                          >
                            <q-item-section>
                              <q-item-label class="text-center">
                                {{ item.nombre }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-Gestor="props">
                <q-td :props="props">
                  <div>
                    <q-btn-dropdown
                      dense
                      no-caps
                      class="q-ma-none q-pa-none"
                      :label="
                        props.row.usuariosGestion
                          ? props.row.usuariosGestion.email
                          : 'Sin gestor'
                      "
                    >
                      <q-list>
                        <template
                          v-for="(item, index) in gestores"
                          :key="index"
                        >
                          <q-item
                            clickable
                            :style="item.color"
                            v-close-popup
                            @click="cambiarGestor(item, props.row)"
                          >
                            <q-item-section>
                              <q-item-label class="text-center">
                                {{ item.email }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-list>
                    </q-btn-dropdown>
                  </div>
                </q-td>
              </template>
              <template v-slot:top-right>
                <q-input
                  borderless
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Search"
                  style="
                    border: 1px solid #bbb;
                    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.28);
                    border-radius: 6px;
                  "
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body-cell-fechaCreacion="props">
                <q-td :props="props">
                  {{ formatDate(props.row.fechaCreacion) }}
                </q-td>
              </template>
              <template v-slot:body-cell-fechaActualizacion="props">
                <q-td :props="props">
                  {{ formatDate(props.row.fechaActualizacion) }}
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- DIALOGO CREAR EMPRESA -->
    <q-dialog v-model="dialogTicket" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Nuevo Ticket</span>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="ticket.titulo"
            label="titulo"
            lazy-rules
            stack-label
            dense
            color="primary"
          />
          <q-input
            v-model="ticket.descripcion"
            label="Descripcion"
            stack-label
            dense
            lazy-rules
            color="primary"
          />
          <q-select
            dense
            v-model="ticket.areaId"
            :options="areas"
            label="Area"
            map-options
            emit-value
          />
          <q-select
            dense
            v-model="ticket.categoriaId"
            :options="categorias"
            label="Categoria"
            map-options
            emit-value
          />
          <q-select
            dense
            v-model="ticket.centroId"
            :options="centros"
            label="Centro"
            map-options
            emit-value
          />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn
              flat
              label="Cancelar"
              color="primary"
              v-close-popup
              @click="dialogTicket = false"
            />
            <q-btn label="Confirmar" color="primary" @click="crearTicket()" />
          </template>
          <template v-if="cargandoIcon">
            <span color="primary">Registrando...</span>
            <q-spinner-hourglass color="primary" size="2em" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO EDITAR EMPRESA -->
    <q-dialog v-model="dialogTicketEdit" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Modificar el Ticket</span>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="ticket.nombre"
            label="Nombre"
            lazy-rules
            stack-label
            dense
            color="primary"
          />
          <q-input
            v-model="ticket.email"
            label="Correo"
            stack-label
            dense
            lazy-rules
            color="primary"
          />
          <q-input
            v-model="ticket.telefono"
            label="Telefono"
            stack-label
            dense
            lazy-rules
            color="primary"
          />
          <q-input
            v-model="ticket.direccion"
            label="Dirección"
            stack-label
            dense
            lazy-rules
            color="primary"
          />
          <q-select
            dense
            v-model="ticket.estado"
            :options="estados"
            label="Estado"
            map-options
            emit-value
          />
          <q-select
            dense
            v-model="ticket.paisId"
            :options="paises"
            label="País"
            map-options
            emit-value
          />
          <q-select
            dense
            v-model="ticket.cuentaEmpresaId"
            :options="empresas"
            label="Empresa"
            map-options
            emit-value
          />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn
              flat
              label="Cancelar"
              color="primary"
              v-close-popup
              @click="dialogTicketEdit = false"
            />
            <q-btn
              label="Confirmar"
              color="primary"
              @click="actualizarTicket()"
            />
          </template>
          <template v-if="cargandoIcon">
            <span color="primary">Registrando...</span>
            <q-spinner-hourglass color="primary" size="2em" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
//css
import "/src/css/pages/ticketAdmin.scss";

// Store
const usuarioStore = useUsuariostore();
const cuentaId = ref(usuarioStore.cuentaId);
const empresaId = ref(usuarioStore.empresa);
const usuarioId = ref(usuarioStore.usuario);
const areaId = ref(usuarioStore.area);

// UI states
const filter = ref("");
const dialogTicket = ref(false);
const dialogTicketEdit = ref(false);
const cargandoIcon = ref(false);

// Data
const tickets = ref([]);
const gestores = ref([]);
const centros = ref([]);
const areas = ref([]);
const categorias = ref([]);
const estadosTicket = ref(null);
const empresas = ref([]);
const cuentas = ref([]);

// Ticket reactive object
const ticket = reactive({
  titulo: null,
  codigo: null,
  descripcion: null,
  areaId: null,
  estadoId: null,
  usuarioId: null,
  centroId: null,
  categoriaId: null,
});

// Columns
const columns = [
  {
    name: "index",
    label: "ID",
    headerClasses: "bg-primary text-white glossy",
    align: "center",
    field: (row) => row.id,
  },
  {
    name: "Titulo",
    label: "titulo",
    align: "left",
    field: (row) => row.titulo,
    headerClasses: "bg-primary text-white glossy",
    style: "max-width: 150px",
  },
  {
    name: "Area",
    label: "Area",
    field: (row) => (row.area ? row.area.nombre : "Sin Area"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Categoria",
    label: "Categoria",
    field: (row) => (row.categoria ? row.categoria.nombre : "Sin Categoria"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Estado",
    label: "Estado",
    field: (row) => (row.estado ? row.estado.nombre : "Sin Estado"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Gestor",
    label: "Gestor",
    field: (row) =>
      row.gestionador ? row.usuariosGestion.email : "Sin Asignación",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Centro",
    label: "Centro",
    field: (row) => (row.centro ? row.centro.nombre : "Sin Centro"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Solicitante",
    label: "Solicitante",
    field: (row) => (row.usuario ? row.usuario.email : "Sin Usuario"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "fechaCreacion",
    label: "Fecha Creación",
    field: (row) => row.fechaCreacion,
    align: "center",
    headerClasses: "bg-primary text-white glossy",
    style: "max-width: 150px",
  },
  {
    name: "fechaActualizacion",
    label: "Fecha Actualización",
    field: (row) => row.fechaActualizacion,
    align: "center",
    headerClasses: "bg-primary text-white glossy",
    style: "max-width: 150px",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
];

// Pagination
const pagination = ref({ page: 1, rowsPerPage: 10 });

// Methods
const obtenerTicketsAdmin = async () => {
  const response = await api.get("/ticket/area/" + areaId.value);
  tickets.value = response.data;
};

const obtenerEstadosArea = async () => {
  const response = await api.get(
    "/estados/empresa/" + empresaId.value + "/area/" + areaId.value
  );
  estadosTicket.value = response.data;
};

const obtenerCentros = async () => {
  centros.value = [];
  const response = empresaId.value
    ? await api.get("/centro/empresa/" + empresaId.value)
    : await api.get("/centro");
  centros.value = response.data.map((item) => ({
    label: item.nombre,
    value: item.id,
  }));
};

const obtenerAreas = async () => {
  const response = await api.get("/area/empresa/" + empresaId.value);
  areas.value = response.data.map((item) => ({
    label: item.nombre,
    value: item.id,
  }));
};

const obtenerCategorias = async (id) => {
  const response = await api.get("/categoria/area/" + id);
  categorias.value = response.data.map((item) => ({
    label: item.nombre,
    value: item.id,
  }));
};

const obtenerGestores = async () => {
  const response = await api.get("/usuario/area/" + areaId.value);
  gestores.value = response.data;
};

const crearTicket = async () => {
  ticket.usuarioId = usuarioId.value;
  ticket.estadoId = 6;
  await api.post("/ticket", ticket);
  dialogTicket.value = false;
  obtenerTicketsAdmin();
};

const actualizarTicket = async () => {
  const id = ticket.id;
  const payload = { ...ticket };
  delete payload.id;
  await api.patch("/ticket/" + id, payload);
  dialogTicketEdit.value = false;
  obtenerTicketsAdmin();
};

const eliminarTicket = (row) => {
  Notify.create({
    timeout: 0,
    message: "¿ Desea eliminar el ticket " + row.nombre + " ?",
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          await api.delete("/ticket/" + row.id);
          obtenerTicketsAdmin();
        },
      },
      {
        label: "Cancelar",
        handler: () => console.log("Eliminación cancelada"),
      },
    ],
  });
};

const cambiarEstado = async (item, row) => {
  await api.patch("/ticket/" + row.id, { estadoId: item.id });
  obtenerTicketsAdmin();
};

const cambiarGestor = async (item, row) => {
  const payload = { gestionador: item.id };
  if (!row.gestionador) payload.estadoId = 12;
  await api.patch("/ticket/" + row.id, payload);
  obtenerTicketsAdmin();
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("es-ES", options);
};

// Watchers
watch(dialogTicket, (val) => {
  if (val)
    Object.assign(ticket, {
      titulo: null,
      codigo: null,
      descripcion: null,
      areaId: null,
      estadoId: null,
      usuarioId: null,
      centroId: null,
      categoriaId: null,
    });
});

watch(
  () => ticket.areaId,
  (valor) => {
    if (valor) obtenerCategorias(valor);
  }
);

// Mounted
onMounted(() => {
  if (areaId.value) {
    obtenerTicketsAdmin();
    obtenerEstadosArea();
    obtenerGestores();
  }
  obtenerCentros();
  obtenerAreas();
});
</script>
