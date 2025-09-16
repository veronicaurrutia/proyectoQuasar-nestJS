<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="badge" />Mantendor de Categorias
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de Categorias<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogCategoria = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Areas"
            :rows="categorias"
            :columns="columns"
            :rows-per-page-options="[10]"
            :filter="filter"
          >
            <template v-slot:body-cell-index="props">
              <q-td :props="props" align="center">
                {{ props.pageIndex + 1 }}
              </q-td>
            </template>
            <template v-slot:body-cell-enabledopt="props">
              <q-td :props="props" align="center">
                <q-icon
                  :name="props.row.estado ? 'check_circle' : 'cancel'"
                  :color="props.row.estado ? 'green' : 'red'"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  color="primary"
                  icon="edit"
                  @click="editarArea(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarCategoria(props.row)"
                  flat
                />
              </q-td>
            </template>
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </q-card>
      <!-- DIALOGO CREAR EMPRESA -->
      <q-dialog v-model="dialogCategoria" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nueva Categoria</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="categoria.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="categoria.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="categoria.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="categoria.areaId"
              :options="areas"
              label="Area"
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
                @click="dialogCategoria = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="crearCategoria()"
              />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO EDITAR EMPRESA -->
      <q-dialog v-model="dialogCategoriaEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar la Categoria</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="categoria.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="categoria.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="categoria.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="categoria.areaId"
              :options="areas"
              label="Area"
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
                @click="dialogCategoriaEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarCategoria()"
              />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

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
  if (usuarioStore.cuentaId == null) {
    const response = await api.get("/categoria");
    categorias.value = response.data;
  } else {
    if (empresaUsuario.value != null) {
      const response = await api.get("/categoria");
      categorias.value = response.data;
    }
  }
}

async function obtenerAreas() {
  areas.value = [];
  const response = await api.get("/area/empresa/" + empresaUsuario.value);
  response.data.forEach((item) => {
    let dato = { label: item.nombre, value: item.id };
    areas.value.push(dato);
  });
}

async function obtenerEmpresa() {
  empresas.value = [];
  let item = usuarioStore.empresas.find(
    (empresa) => empresa.value === empresaUsuario.value
  );
  empresas.value.push(item);
}

async function crearCategoria() {
  await api.post("/categoria", categoria.value);
  dialogCategoria.value = false;
}

function editarArea(row) {
  dialogCategoriaEdit.value = true;
  categoria.value = row;
}

async function actualizarCategoria() {
  let id = categoria.value.id;
  delete categoria.value.id;
  delete categoria.value.area;
  delete categoria.value.eliminacion;

  await api.patch("/categoria/" + id, categoria.value);
  dialogCategoriaEdit.value = false;
}

function eliminarCategoria(row) {
  Notify.create({
    timeout: 0,
    message: "¿Desea eliminar la Categoría " + row.nombre + " ?",
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          try {
            await api.delete("/categoria/" + row.id);
            obtenerCategorias();
          } catch (error) {
            console.error("Error al eliminar la Categoría:", error);
          }
        },
      },
      {
        label: "Cancelar",
        handler: async () => {},
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
