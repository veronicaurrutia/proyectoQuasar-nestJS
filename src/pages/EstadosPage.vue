<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="assignment_turned_in" size="48px" class="q-mr-md" />
              Administrador de Estados
            </h1>
            <p class="page-subtitle text-white">
              Gestiona los estados del ciclo de vida de tickets
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add"
              label="Nuevo Estado"
              size="lg"
              class="glossy shadow-5"
              @click="dialogEstado = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="q-mb-lg table-card" elevation="2">
          <q-card-section class="q-pb-none">
            <div class="row items-center justify-between q-mb-md">
              <div class="col-auto">
                <h3 class="table-title">
                  <q-icon name="rule" class="q-mr-sm" />
                  Lista de Estados
                </h3>
                <div class="text-caption text-grey-6">
                  Define los estados disponibles para el seguimiento de tickets
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator class="q-mx-md" />
          <q-card-section>
            <q-table
              flat
              bordered
              :rows="estados"
              :columns="columns"
              :filter="filter"
              row-key="id"
              :pagination="pagination"
              class="estados-table"
            >
              <template v-slot:top-right>
                <q-input
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Buscar estado..."
                  outlined
                  class="search-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="filter !== ''"
                      name="clear"
                      class="cursor-pointer"
                      @click="filter = ''"
                    />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-enabledopt="props">
                <q-td :props="props" class="text-center">
                  <q-badge
                    :color="props.row.estado ? 'positive' : 'negative'"
                    :label="props.row.estado ? 'Activo' : 'Inactivo'"
                    class="q-px-sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-center">
                  <div class="q-gutter-xs">
                    <q-btn
                      size="sm"
                      color="primary"
                      icon="edit"
                      round
                      flat
                      @click="editarEstado(props.row)"
                    >
                      <q-tooltip>Editar estado</q-tooltip>
                    </q-btn>
                    <q-btn
                      size="sm"
                      color="negative"
                      icon="delete"
                      round
                      flat
                      @click="eliminarEstado(props.row)"
                    >
                      <q-tooltip>Eliminar estado</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- DIALOGO CREAR ESTADO -->
    <q-dialog v-model="dialogEstado" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="add_task" class="q-mr-sm" />
            Nuevo Estado
          </div>
          <div class="text-subtitle2">
            Configura un nuevo estado para el flujo de tickets
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="q-mb-lg">
            <div class="text-subtitle1 q-mb-md text-grey-8">
              <q-icon name="settings" class="q-mr-sm" />
              Nivel de aplicación
            </div>
            <q-option-group
              v-model="group"
              :options="options"
              color="primary"
              inline
              class="scope-selector"
            />
          </div>

          <q-separator class="q-mb-lg" />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="estado.nombre"
                label="Nombre del estado"
                outlined
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="label" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="estado.codigo"
                label="Código identificador"
                outlined
                color="primary"
                hint="Código único para el estado"
                :rules="[(val) => !!val || 'El código es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="tag" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="estado.descripcion"
                label="Descripción"
                outlined
                color="primary"
                type="textarea"
                rows="3"
                hint="Describe el propósito de este estado"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <div class="col-12" v-if="group != null">
              <q-select
                v-model="estado.empresaId"
                :options="empresas"
                label="Empresa"
                outlined
                map-options
                emit-value
                color="primary"
                :rules="[(val) => !!val || 'Debe seleccionar una empresa']"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay empresas disponibles
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12" v-if="group == 2 && estado.empresaId != null">
              <q-select
                v-model="estado.areaId"
                :options="areas"
                label="Área específica"
                outlined
                map-options
                emit-value
                color="primary"
                hint="Selecciona el área donde aplicará este estado"
              >
                <template v-slot:prepend>
                  <q-icon name="domain" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay áreas disponibles para esta empresa
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogEstado = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Crear Estado"
            color="primary"
            @click="crearEstado()"
            :loading="cargandoIcon"
            :disable="cargandoIcon"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO EDITAR ESTADO -->
    <q-dialog v-model="dialogEstadoEdit" persistent>
      <q-card style="width: 700px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="edit" class="q-mr-sm" />
            Editar Estado
          </div>
          <div class="text-subtitle2">
            Modifica la información del estado seleccionado
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="estado.nombre"
                label="Nombre del estado"
                outlined
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="label" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="estado.codigo"
                label="Código identificador"
                outlined
                color="primary"
                hint="Código único para el estado"
                :rules="[(val) => !!val || 'El código es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="tag" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="estado.descripcion"
                label="Descripción"
                outlined
                color="primary"
                type="textarea"
                rows="3"
                hint="Describe el propósito de este estado"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogEstadoEdit = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Actualizar"
            color="primary"
            @click="actualizarEstado()"
            :loading="cargandoIcon"
            :disable="cargandoIcon"
          />
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
import "src/css/pages/estadosPage.scss";

// ✅ store
const usuarioStore = useUsuariostore();
const cuentaId = ref(usuarioStore.cuentaId);
const empresaId = ref(usuarioStore.empresa);

// ✅ states
const filter = ref("");
const dialogEstado = ref(false);
const cargandoIcon = ref(false);
const dialogEstadoEdit = ref(false);

const estados = ref([]);
const paises = ref([]);
const cuentas = ref([]);
const empresas = ref([]);
const areas = ref([]);

const estado = reactive({
  nombre: null,
  descripcion: null,
  codigo: null,
  estado: true,
  empresaId: null,
  areaId: null,
});

const columns = [
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    format: (val) => `${val}`,
    headerClasses: "bg-primary text-white glossy",
    style: "max-width: 150px",
  },
  {
    name: "codigo",
    label: "Codigo",
    field: "codigo",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "descripción",
    label: "Descripción",
    field: "descripcion",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Empresa",
    label: "Empresa",
    field: (row) => (row.empresa ? row.empresa.nombre : "Sin Empresa"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Area",
    label: "Area",
    field: (row) => (row.area ? row.area.nombre : "Sin Area"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "enabledopt",
    label: "Estado",
    field: "estado",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
    format: (val) =>
      val
        ? '<q-icon name="check_circle" color="green" />'
        : '<q-icon name="cancel" color="red" />',
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

const options = [
  { label: "Area", value: 2 },
  { label: "Empresa", value: 1 },
];

const group = ref(null);
const areaId = ref(null);

// ✅ methods
const obtenerEstados = async () => {
  try {
    estados.value = [];
    const response = await api.get("/estados");
    estados.value = response.data;
  } catch (error) {
    console.error("Error al obtener estados:", error);
    Notify.create({
      message: "Error al cargar los estados",
      color: "negative",
      icon: "error",
    });
  }
};

const crearEstado = async () => {
  if (!estado.nombre?.trim()) {
    Notify.create({
      message: "El nombre del estado es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  if (!estado.codigo?.trim()) {
    Notify.create({
      message: "El código del estado es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  if (group.value && !estado.empresaId) {
    Notify.create({
      message: "Debe seleccionar una empresa",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  try {
    cargandoIcon.value = true;
    await api.post("/estados", estado);

    Notify.create({
      message: "Estado creado exitosamente",
      color: "positive",
      icon: "check_circle",
    });

    dialogEstado.value = false;
    obtenerEstados();
  } catch (error) {
    console.error("Error al crear estado:", error);
    Notify.create({
      message: "Error al crear el estado",
      color: "negative",
      icon: "error",
    });
  } finally {
    cargandoIcon.value = false;
  }
};

const obtenerAreasEmpresa = async () => {
  try {
    areas.value = [];
    const response = await api.get("/area/empresa/" + estado.empresaId);
    areas.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    Notify.create({
      message: "Error al cargar las áreas de la empresa",
      color: "negative",
      icon: "error",
    });
  }
};

const editarEstado = (row) => {
  dialogEstadoEdit.value = true;
  Object.assign(estado, row);
};

const obtenerEmpresa = async () => {
  try {
    const response = await api.get("/empresa/" + empresaId.value);
    empresas.value = [{ value: response.data.id, label: response.data.nombre }];
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    Notify.create({
      message: "Error al cargar la información de la empresa",
      color: "negative",
      icon: "error",
    });
  }
};

const actualizarEstado = async () => {
  if (!estado.nombre?.trim()) {
    Notify.create({
      message: "El nombre del estado es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  if (!estado.codigo?.trim()) {
    Notify.create({
      message: "El código del estado es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  try {
    cargandoIcon.value = true;
    const id = estado.id;
    const payload = { ...estado };
    delete payload.id;
    delete payload.empresa;
    delete payload.area;

    await api.patch("/estados/" + id, payload);

    Notify.create({
      message: "Estado actualizado exitosamente",
      color: "positive",
      icon: "check_circle",
    });

    dialogEstadoEdit.value = false;
    obtenerEstados();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    Notify.create({
      message: "Error al actualizar el estado",
      color: "negative",
      icon: "error",
    });
  } finally {
    cargandoIcon.value = false;
  }
};

const eliminarEstado = (row) => {
  Notify.create({
    timeout: 0,
    message: `¿Está seguro de eliminar el estado "${row.nombre}"?`,
    html: true,
    icon: "warning",
    color: "warning",
    position: "center",
    actions: [
      {
        label: "Eliminar",
        color: "negative",
        handler: async () => {
          try {
            await api.delete("/estados/" + row.id);
            Notify.create({
              message: "Estado eliminado exitosamente",
              color: "positive",
              icon: "check_circle",
            });
            obtenerEstados();
          } catch (error) {
            console.error("Error al eliminar estado:", error);
            Notify.create({
              message: "Error al eliminar el estado",
              color: "negative",
              icon: "error",
            });
          }
        },
      },
      {
        label: "Cancelar",
        color: "primary",
        flat: true,
        handler: () => {
          console.log("Eliminación cancelada");
        },
      },
    ],
  });
};

// ✅ lifecycle
onMounted(() => {
  obtenerEstados();
});

// ✅ watchers
watch(dialogEstado, (val) => {
  if (val) {
    Object.assign(estado, {
      nombre: null,
      descripcion: null,
      codigo: null,
      estado: true,
      empresaId: null,
      areaId: null,
    });
    obtenerEmpresa();
  } else {
    obtenerEstados();
  }
});

watch(dialogEstadoEdit, (val) => {
  if (!val) {
    obtenerEstados();
  }
});

watch(
  () => estado.empresaId,
  (valor) => {
    if (valor != null && group.value == 2) {
      obtenerAreasEmpresa();
    }
  }
);
</script>
