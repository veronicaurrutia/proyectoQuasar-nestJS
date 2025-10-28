<template>
  <q-page class="areas-page">
    <!-- Header Section -->
    <div class="page-header q-pa-lg transparent">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="domain" size="48px" class="q-mr-md" />
              Gestión de Áreas
            </h1>
            <p class="page-subtitle text-white q-mb-none">
              Administra las áreas organizacionales y sus configuraciones
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add_business"
              label="Nueva Área"
              size="lg"
              class="glossy shadow-5"
              @click="dialogArea = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Areas Table -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="table-card">
          <q-card-section>
            <div class="table-header q-mb-md">
              <div class="row items-center">
                <div class="col">
                  <h3 class="table-title">
                    <q-icon name="list_alt" class="q-mr-sm" />
                    Lista de Áreas ({{ areas.length }})
                  </h3>
                </div>
                <div class="col-auto">
                  <q-input
                    v-model="filter"
                    placeholder="Buscar áreas..."
                    outlined
                    dense
                    clearable
                    style="width: 300px"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <q-table
              flat
              bordered
              :rows="areas"
              :columns="columns"
              :rows-per-page-options="[10, 25, 50]"
              :filter="filter"
              :pagination="pagination"
              class="modern-table"
              separator="cell"
              no-data-label="No hay áreas disponibles"
              loading-label="Cargando áreas..."
              rows-per-page-label="Filas por página:"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props" class="text-center index-column">
                  <q-chip
                    color="primary"
                    text-color="white"
                    :label="props.pageIndex + 1"
                    size="sm"
                    class="q-px-sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-nombre="props">
                <q-td :props="props" class="nombre-column">
                  <div class="area-info">
                    <div class="area-name text-weight-medium text-primary">
                      {{ props.row.nombre }}
                    </div>
                    <div
                      v-if="props.row.descripcion"
                      class="area-description text-caption text-grey-6"
                    >
                      {{ props.row.descripcion }}
                    </div>
                    <q-chip
                      v-if="props.row.prefijo"
                      color="blue-grey-3"
                      text-color="blue-grey-8"
                      :label="`Prefijo: ${props.row.prefijo}`"
                      size="sm"
                      class="q-mt-xs"
                      icon="tag"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-Empresa="props">
                <q-td :props="props" class="text-center empresa-column">
                  <q-chip
                    color="accent"
                    text-color="white"
                    :label="
                      props.row.empresa
                        ? props.row.empresa.nombre
                        : 'Sin Empresa'
                    "
                    size="sm"
                    icon="business"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-enabledopt="props">
                <q-td :props="props" class="text-center estado-column">
                  <q-badge
                    :color="props.row.estado ? 'positive' : 'negative'"
                    :label="props.row.estado ? 'Activa' : 'Inactiva'"
                    class="estado-badge q-px-md q-py-xs"
                    :icon="props.row.estado ? 'check_circle' : 'cancel'"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="actions-column">
                  <div class="actions-container">
                    <q-btn
                      color="warning"
                      icon="edit"
                      size="sm"
                      round
                      flat
                      @click="editarArea(props.row)"
                      class="q-mr-xs"
                    >
                      <q-tooltip>Editar área</q-tooltip>
                    </q-btn>
                    <q-btn
                      :color="props.row.estado ? 'negative' : 'positive'"
                      :icon="props.row.estado ? 'toggle_off' : 'toggle_on'"
                      size="sm"
                      round
                      flat
                      @click="toggleEstadoArea(props.row)"
                      class="q-mr-xs"
                    >
                      <q-tooltip>{{
                        props.row.estado ? "Desactivar" : "Activar"
                      }}</q-tooltip>
                    </q-btn>
                    <q-btn
                      color="negative"
                      icon="delete"
                      size="sm"
                      round
                      flat
                      @click="eliminarArea(props.row)"
                    >
                      <q-tooltip>Eliminar área</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <template v-slot:no-data="{ message }">
                <div class="full-width row flex-center text-accent q-gutter-sm">
                  <q-icon size="2em" name="sentiment_dissatisfied" />
                  <span>{{ message }}</span>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Crear Área -->
    <q-dialog v-model="dialogArea" persistent class="area-dialog">
      <q-card class="dialog-card responsive-dialog">
        <q-card-section class="dialog-header bg-primary text-white">
          <div class="row items-center no-wrap">
            <q-avatar
              square
              icon="add_business"
              color="white"
              text-color="primary"
            />
            <div class="q-ml-sm">
              <div class="text-h6 q-mb-xs">Nueva Área</div>
              <div class="text-caption opacity-80">
                Crear nueva área organizacional
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-form @submit="crearArea" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="area.nombre"
                  label="Nombre del Área *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'El nombre es requerido']"
                  hint="Nombre descriptivo del área"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="domain" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="area.descripcion"
                  label="Descripción"
                  type="textarea"
                  :rows="$q.screen.xs ? 2 : 3"
                  outlined
                  dense
                  hint="Descripción detallada del área y sus funciones"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="area.prefijo"
                  label="Prefijo *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'El prefijo es requerido']"
                  hint="Código corto (ej: TI, RRHH)"
                  maxlength="10"
                  counter
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="tag" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-select
                  v-model="area.empresaId"
                  :options="empresas"
                  label="Empresa *"
                  outlined
                  dense
                  map-options
                  emit-value
                  :rules="[(val) => !!val || 'Selecciona una empresa']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="business" color="primary" />
                  </template>
                </q-select>
              </div>

              <div class="col-12">
                <q-item
                  tag="label"
                  v-ripple
                  class="rounded-borders q-pa-md status-toggle"
                >
                  <q-item-section avatar>
                    <q-toggle
                      v-model="area.estado"
                      color="positive"
                      size="lg"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium"
                      >Área activa</q-item-label
                    >
                    <q-item-label caption
                      >El área estará disponible para su uso</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <div class="full-width">
            <div class="row q-gutter-sm justify-end">
              <q-btn
                flat
                label="Cancelar"
                color="grey-7"
                icon="close"
                @click="dialogArea = false"
                :disable="cargandoIcon"
                class="action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
              <q-btn
                label="Crear Área"
                color="primary"
                icon="add_business"
                @click="crearArea"
                :loading="cargandoIcon"
                class="glossy action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Editar Área -->
    <q-dialog v-model="dialogAreaEdit" persistent class="area-dialog">
      <q-card class="dialog-card responsive-dialog">
        <q-card-section class="dialog-header bg-secondary text-white">
          <div class="row items-center no-wrap">
            <q-avatar square icon="edit" color="white" text-color="secondary" />
            <div class="q-ml-sm">
              <div class="text-h6 q-mb-xs">Editar Área</div>
              <div class="text-caption opacity-80">
                Modificar información del área
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-form @submit="actualizarArea" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="area.nombre"
                  label="Nombre del Área *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'El nombre es requerido']"
                  hint="Nombre descriptivo del área"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="domain" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="area.descripcion"
                  label="Descripción"
                  type="textarea"
                  :rows="$q.screen.xs ? 2 : 3"
                  outlined
                  dense
                  hint="Descripción detallada del área y sus funciones"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="area.prefijo"
                  label="Prefijo *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'El prefijo es requerido']"
                  hint="Código corto (ej: TI, RRHH)"
                  maxlength="10"
                  counter
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="tag" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-select
                  v-model="area.empresaId"
                  :options="empresas"
                  label="Empresa *"
                  outlined
                  dense
                  map-options
                  emit-value
                  :rules="[(val) => !!val || 'Selecciona una empresa']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="business" color="primary" />
                  </template>
                </q-select>
              </div>

              <div class="col-12">
                <q-item
                  tag="label"
                  v-ripple
                  class="rounded-borders q-pa-md status-toggle"
                >
                  <q-item-section avatar>
                    <q-toggle
                      v-model="area.estado"
                      color="positive"
                      size="lg"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium"
                      >Área activa</q-item-label
                    >
                    <q-item-label caption
                      >El área estará disponible para su uso</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <div class="full-width">
            <div class="row q-gutter-sm justify-end">
              <q-btn
                flat
                label="Cancelar"
                color="grey-7"
                icon="close"
                @click="dialogAreaEdit = false"
                :disable="cargandoIcon"
                class="action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
              <q-btn
                label="Actualizar"
                color="secondary"
                icon="save"
                @click="actualizarArea"
                :loading="cargandoIcon"
                class="glossy action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
//css
import "src/css/pages/areasPage.scss";

// --------------------
// Estado reactivo
// --------------------
const filter = ref("");
const dialogArea = ref(false);
const cargandoIcon = ref(false);
const dialogAreaEdit = ref(false);

const areas = ref([]);
const paises = ref([]);
const cuentas = ref([]);
const empresas = ref([]);

const usuarioStore = useUsuariostore();
const empresaUsuario = ref(usuarioStore.empresa);
const empresasUsuario = ref([]);

const area = ref({
  nombre: null,
  descripcion: null,
  prefijo: null,
  estado: true,
  empresaId: null,
});

// Computed (sin variables de stats que ya no se usan)

const columns = [
  {
    name: "index",
    label: "#",
    headerClasses: "bg-primary text-white",
    align: "center",
    field: (row) => row.id,
  },
  {
    name: "nombre",
    required: true,
    label: "Información del Área",
    align: "left",
    field: "nombre",
    headerClasses: "bg-primary text-white",
    style: "min-width: 280px",
  },
  {
    name: "Empresa",
    label: "Empresa",
    field: (row) => (row.empresa ? row.empresa.nombre : "Sin Empresa"),
    align: "center",
    headerClasses: "bg-primary text-white",
  },
  {
    name: "enabledopt",
    label: "Estado",
    field: "estado",
    align: "center",
    headerClasses: "bg-primary text-white",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-primary text-white",
    style: "width: 180px",
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 15,
});

// --------------------
// Métodos
// --------------------
async function obtenerAreas() {
  try {
    let response;
    if (usuarioStore.cuentaId == null) {
      response = await api.get("/area");
    } else {
      if (empresaUsuario.value != null) {
        response = await api.get("/area/empresa/" + empresaUsuario.value);
      } else {
        areas.value = [];
        return;
      }
    }
    areas.value = response.data || [];
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    areas.value = [];
    Notify.create({
      type: "negative",
      message: "Error al cargar las áreas",
      caption: error.response?.data?.message || "Verifique su conexión",
      icon: "error",
    });
  }
}

async function obtenerEmpresas() {
  try {
    empresas.value = [];
    const response = await api.get("/empresa");

    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((item) => {
        let dato = { value: item.id, label: item.nombre };
        empresas.value.push(dato);
      });
    }
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    empresas.value = [];
    Notify.create({
      type: "negative",
      message: "Error al cargar las empresas",
      icon: "error",
    });
  }
}

async function obtenerEmpresa() {
  try {
    empresas.value = [];
    if (usuarioStore.empresas && Array.isArray(usuarioStore.empresas)) {
      let item = usuarioStore.empresas.find(
        (empresa) => empresa.value === empresaUsuario.value
      );
      if (item) {
        empresas.value.push(item);
      }
    }
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    empresas.value = [];
  }
}

async function crearArea() {
  // Validación básica
  if (!area.value.nombre || !area.value.prefijo || !area.value.empresaId) {
    Notify.create({
      type: "negative",
      message: "Complete todos los campos obligatorios",
      icon: "warning",
    });
    return;
  }

  cargandoIcon.value = true;
  try {
    const payload = {
      nombre: area.value.nombre.trim(),
      descripcion: area.value.descripcion?.trim() || null,
      prefijo: area.value.prefijo.trim().toUpperCase(),
      estado: area.value.estado,
      empresaId: area.value.empresaId,
    };

    await api.post("/area", payload);

    Notify.create({
      type: "positive",
      message: "Área creada exitosamente",
      caption: `${payload.nombre} ha sido registrada`,
      icon: "check_circle",
    });

    dialogArea.value = false;
    await obtenerAreas();

    // Limpiar formulario
    area.value = {
      nombre: null,
      descripcion: null,
      prefijo: null,
      estado: true,
      empresaId: null,
    };
  } catch (error) {
    console.error("Error al crear área:", error);
    Notify.create({
      type: "negative",
      message: "Error al crear el área",
      caption:
        error.response?.data?.message || "Verifique los datos ingresados",
      icon: "error",
    });
  } finally {
    cargandoIcon.value = false;
  }
}

function verArea(row) {
  Notify.create({
    type: "info",
    message: `Información del área`,
    caption: `${row.nombre} - ${row.empresa?.nombre || "Sin empresa"}`,
    icon: "visibility",
    timeout: 3000,
  });
}

function editarArea(row) {
  try {
    // Crear una copia profunda del objeto
    area.value = {
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion || "",
      prefijo: row.prefijo,
      estado: row.estado,
      empresaId: row.empresa?.id || null,
    };
    dialogAreaEdit.value = true;
  } catch (error) {
    console.error("Error al preparar edición:", error);
    Notify.create({
      type: "negative",
      message: "Error al cargar datos del área",
      icon: "error",
    });
  }
}

async function toggleEstadoArea(row) {
  try {
    const nuevoEstado = !row.estado;
    const payload = { estado: nuevoEstado };

    await api.patch(`/area/${row.id}`, payload);

    Notify.create({
      type: "positive",
      message: `Área ${nuevoEstado ? "activada" : "desactivada"} exitosamente`,
      caption: row.nombre,
      icon: nuevoEstado ? "toggle_on" : "toggle_off",
    });

    await obtenerAreas();
  } catch (error) {
    console.error("Error al cambiar estado del área:", error);
    Notify.create({
      type: "negative",
      message: "Error al cambiar el estado del área",
      caption: error.response?.data?.message || "Intente nuevamente",
      icon: "error",
    });
  }
}

async function actualizarArea() {
  // Validación básica
  if (!area.value.nombre || !area.value.prefijo || !area.value.empresaId) {
    Notify.create({
      type: "negative",
      message: "Complete todos los campos obligatorios",
      icon: "warning",
    });
    return;
  }

  cargandoIcon.value = true;
  try {
    const id = area.value.id;
    const payload = {
      nombre: area.value.nombre.trim(),
      descripcion: area.value.descripcion?.trim() || null,
      prefijo: area.value.prefijo.trim().toUpperCase(),
      estado: area.value.estado,
      empresaId: area.value.empresaId,
    };

    await api.patch("/area/" + id, payload);

    Notify.create({
      type: "positive",
      message: "Área actualizada exitosamente",
      caption: `${payload.nombre} ha sido modificada`,
      icon: "save",
    });

    dialogAreaEdit.value = false;
    await obtenerAreas();
  } catch (error) {
    console.error("Error al actualizar área:", error);
    Notify.create({
      type: "negative",
      message: "Error al actualizar el área",
      caption:
        error.response?.data?.message || "Verifique los datos ingresados",
      icon: "error",
    });
  } finally {
    cargandoIcon.value = false;
  }
}

function eliminarArea(row) {
  Notify.create({
    timeout: 0,
    message: `¿Confirma la eliminación del área?`,
    caption: `Esta acción no se puede deshacer. Área: ${row.nombre}`,
    icon: "delete_forever",
    color: "negative",
    actions: [
      {
        label: "Eliminar",
        color: "white",
        icon: "delete",
        handler: async () => {
          try {
            await api.delete("/area/" + row.id);
            Notify.create({
              type: "positive",
              message: "Área eliminada exitosamente",
              caption: `${row.nombre} ha sido eliminada`,
              icon: "check_circle",
            });
            await obtenerAreas();
          } catch (error) {
            console.error("Error al eliminar el área:", error);
            Notify.create({
              type: "negative",
              message: "Error al eliminar el área",
              caption:
                error.response?.data?.message ||
                "No se pudo completar la operación",
              icon: "error",
            });
          }
        },
      },
      {
        label: "Cancelar",
        color: "white",
        flat: true,
        handler: () => {},
      },
    ],
  });
}

// --------------------
// Watchers
// --------------------
watch(dialogArea, (val) => {
  if (val === true) {
    area.value = {
      nombre: null,
      descripcion: null,
      prefijo: null,
      estado: true,
      empresaId: null,
    };
  } else {
    obtenerAreas();
  }
});

watch(dialogAreaEdit, (val) => {
  if (val === false) {
    obtenerAreas();
  } else {
    obtenerEmpresas();
  }
});

// --------------------
// Ciclo de vida
// --------------------
onMounted(() => {
  if (usuarioStore.empresas != null) {
    obtenerEmpresa();
  } else {
    obtenerEmpresas();
  }
  obtenerAreas();
});
</script>
