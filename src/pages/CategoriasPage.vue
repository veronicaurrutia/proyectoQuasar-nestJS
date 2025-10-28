<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="category" size="48px" class="q-mr-md" />
              Administrador de Categorías
            </h1>
            <p class="page-subtitle text-white">
              Gestiona las categorías de tickets organizadas por áreas
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add"
              label="Nueva Categoría"
              size="lg"
              class="glossy shadow-5"
              @click="dialogCategoria = true"
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
                  <q-icon name="list_alt" class="q-mr-sm" />
                  Lista de Categorías
                </h3>
                <div class="text-caption text-grey-6">
                  Administra las categorías disponibles para la clasificación de
                  tickets
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator class="q-mx-md" />
          <q-card-section>
            <q-table
              flat
              bordered
              :rows="categorias"
              :columns="columns"
              :filter="filter"
              row-key="id"
              :pagination="pagination"
              class="categoria-table"
            >
              <template v-slot:top-right>
                <q-input
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Buscar categoría..."
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

              <template v-slot:body-cell-index="props">
                <q-td :props="props" class="text-center">
                  <q-chip size="sm" color="grey-3" text-color="grey-8">
                    {{ props.pageIndex + 1 }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-enabledopt="props">
                <q-td :props="props" class="text-center">
                  <q-badge
                    :color="props.row.estado ? 'positive' : 'negative'"
                    :label="props.row.estado ? 'Activa' : 'Inactiva'"
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
                      @click="editarArea(props.row)"
                    >
                      <q-tooltip>Editar categoría</q-tooltip>
                    </q-btn>
                    <q-btn
                      size="sm"
                      color="negative"
                      icon="delete"
                      round
                      flat
                      @click="eliminarCategoria(props.row)"
                    >
                      <q-tooltip>Eliminar categoría</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- DIALOGO CREAR CATEGORIA -->
    <q-dialog v-model="dialogCategoria" persistent>
      <q-card style="width: 700px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="dialog-title">
            <q-icon name="add_circle" class="q-mr-sm" />
            Nueva Categoría
          </div>
          <div class="text-subtitle2">
            Crea una nueva categoría para la clasificación de tickets
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="categoria.nombre"
                label="Nombre de la categoría"
                outlined
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="label" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="categoria.descripcion"
                label="Descripción"
                outlined
                color="primary"
                type="textarea"
                rows="3"
                hint="Describe el propósito de esta categoría"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-select
                v-model="categoria.areaId"
                :options="areas"
                label="Área asociada"
                outlined
                map-options
                emit-value
                color="primary"
                :rules="[(val) => !!val || 'Debe seleccionar un área']"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay áreas disponibles
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
            @click="dialogCategoria = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Crear Categoría"
            color="primary"
            @click="crearCategoria()"
            :loading="cargandoIcon"
            :disable="cargandoIcon"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO EDITAR CATEGORIA -->
    <q-dialog v-model="dialogCategoriaEdit" persistent>
      <q-card style="width: 700px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="dialog-title">
            <q-icon name="edit" class="q-mr-sm" />
            Editar Categoría
          </div>
          <div class="text-subtitle2">
            Modifica la información de la categoría seleccionada
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="categoria.nombre"
                label="Nombre de la categoría"
                outlined
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="label" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="categoria.descripcion"
                label="Descripción"
                outlined
                color="primary"
                type="textarea"
                rows="3"
                hint="Describe el propósito de esta categoría"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-select
                v-model="categoria.areaId"
                :options="areas"
                label="Área asociada"
                outlined
                map-options
                emit-value
                color="primary"
                :rules="[(val) => !!val || 'Debe seleccionar un área']"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay áreas disponibles
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
            @click="dialogCategoriaEdit = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Actualizar"
            color="primary"
            @click="actualizarCategoria()"
            :loading="cargandoIcon"
            :disable="cargandoIcon"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
//css
import "src/css/pages/categoriasPage.scss";

// --------------------
// Estado reactivo
// --------------------
const filter = ref("");
const dialogCategoria = ref(false);
const cargandoIcon = ref(false);
const dialogCategoriaEdit = ref(false);

const areas = ref([]);
const categorias = ref([]);
const paises = ref([]);
const cuentas = ref([]);
const empresas = ref([]);

const usuarioStore = useUsuariostore();
const empresaUsuario = ref(usuarioStore.empresa);
const empresasUsuario = ref([]);

const categoria = ref({
  nombre: null,
  direccion: null,
  estado: true,
  areaId: null,
});

const columns = [
  {
    name: "index",
    label: "#",
    headerClasses: "bg-primary text-white glossy",
    align: "center",
    field: (row) => row.id,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    format: (val) => `${val}`,
    classes: "",
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

const estados = [
  { label: "Activada", value: true },
  { label: "Desactivada", value: false },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

// --------------------
// Métodos
// --------------------
async function obtenerCategorias() {
  try {
    if (usuarioStore.cuentaId == null) {
      const response = await api.get("/categoria");
      categorias.value = response.data;
    } else {
      if (empresaUsuario.value != null) {
        const response = await api.get("/categoria");
        categorias.value = response.data;
      }
    }
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    Notify.create({
      message: "Error al cargar las categorías",
      color: "negative",
      icon: "error",
    });
  }
}

async function obtenerAreas() {
  try {
    areas.value = [];
    const response = await api.get("/area/empresa/" + empresaUsuario.value);
    areas.value = response.data.map((item) => ({
      label: item.nombre,
      value: item.id,
    }));
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    Notify.create({
      message: "Error al cargar las áreas",
      color: "negative",
      icon: "error",
    });
  }
}

async function obtenerEmpresa() {
  empresas.value = [];
  let item = usuarioStore.empresas.find(
    (empresa) => empresa.value === empresaUsuario.value
  );
  empresas.value.push(item);
}

async function crearCategoria() {
  if (!categoria.value.nombre?.trim()) {
    Notify.create({
      message: "El nombre de la categoría es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  if (!categoria.value.areaId) {
    Notify.create({
      message: "Debe seleccionar un área",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  try {
    cargandoIcon.value = true;
    await api.post("/categoria", categoria.value);

    Notify.create({
      message: "Categoría creada exitosamente",
      color: "positive",
      icon: "check_circle",
    });

    dialogCategoria.value = false;
    obtenerCategorias();
  } catch (error) {
    console.error("Error al crear categoría:", error);
    Notify.create({
      message: "Error al crear la categoría",
      color: "negative",
      icon: "error",
    });
  } finally {
    cargandoIcon.value = false;
  }
}

function editarArea(row) {
  dialogCategoriaEdit.value = true;
  categoria.value = row;
}

async function actualizarCategoria() {
  if (!categoria.value.nombre?.trim()) {
    Notify.create({
      message: "El nombre de la categoría es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  if (!categoria.value.areaId) {
    Notify.create({
      message: "Debe seleccionar un área",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  try {
    cargandoIcon.value = true;
    const id = categoria.value.id;
    const payload = { ...categoria.value };
    delete payload.id;
    delete payload.area;
    delete payload.eliminacion;

    await api.patch("/categoria/" + id, payload);

    Notify.create({
      message: "Categoría actualizada exitosamente",
      color: "positive",
      icon: "check_circle",
    });

    dialogCategoriaEdit.value = false;
    obtenerCategorias();
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    Notify.create({
      message: "Error al actualizar la categoría",
      color: "negative",
      icon: "error",
    });
  } finally {
    cargandoIcon.value = false;
  }
}

function eliminarCategoria(row) {
  Notify.create({
    timeout: 0,
    message: `¿Está seguro de eliminar la categoría "${row.nombre}"?`,
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
            await api.delete("/categoria/" + row.id);
            Notify.create({
              message: "Categoría eliminada exitosamente",
              color: "positive",
              icon: "check_circle",
            });
            obtenerCategorias();
          } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            Notify.create({
              message: "Error al eliminar la categoría",
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
}

// --------------------
// Watchers
// --------------------
watch(dialogCategoria, (val) => {
  if (val === true) {
    categoria.value = {
      nombre: null,
      descripcion: null,
      estado: true,
      areaId: null,
    };
    obtenerCategorias();
  } else {
    obtenerCategorias();
  }
});

watch(dialogCategoriaEdit, (val) => {
  if (val === false) {
    obtenerCategorias();
  } else {
    obtenerAreas();
  }
});

// --------------------
// Ciclo de vida
// --------------------
onMounted(() => {
  if (usuarioStore.empresas != null) {
    obtenerEmpresa();
  } else {
    obtenerAreas();
  }
  obtenerCategorias();
});
</script>
