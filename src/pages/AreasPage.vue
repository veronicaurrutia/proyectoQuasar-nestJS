<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="badge" />Mantendor de Areas *
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Problemas al mostrar datos en la tabla<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogArea = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Areas"
            :rows="areas"
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
                  @click="eliminarArea(props.row)"
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
      <q-dialog v-model="dialogArea" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nueva Area</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="area.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="area.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="area.prefijo"
              label="prefijo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="area.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="area.empresaId"
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
                @click="dialogArea = false"
              />
              <q-btn label="Confirmar" color="primary" @click="crearArea()" />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO EDITAR EMPRESA -->
      <q-dialog v-model="dialogAreaEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar la Area</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="area.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="area.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="area.prefijo"
              label="prefijo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="area.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="area.empresaId"
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
                @click="dialogAreaEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarArea()"
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
  direccion: null,
  prefijo: null,
  estado: true,
  empresaId: null,
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
    headerClasses: "bg-primary text-white glossy",
    style: "max-width: 150px",
  },
  {
    name: "prefijo",
    label: "Prefijo",
    field: "prefijo",
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
async function obtenerAreas() {
  console.log(empresaUsuario.value);
  if (usuarioStore.cuentaId == null) {
    const response = await api.get("/area");
    areas.value = response.data;
  } else {
    if (empresaUsuario.value != null) {
      const response = await api.get("/area/empresa/" + empresaUsuario.value);
      areas.value = response.data;
    }
  }
}

async function obtenerEmpresas() {
  empresas.value = [];
  const response = await api.get("/empresa");
  response.data.forEach((item) => {
    let dato = { value: item.id, label: item.nombre };
    empresas.value.push(dato);
  });
}

async function obtenerEmpresa() {
  empresas.value = [];
  let item = usuarioStore.empresas.find(
    (empresa) => empresa.value === empresaUsuario.value
  );
  empresas.value.push(item);
}

async function crearArea() {
  await api.post("/area", area.value);
  dialogArea.value = false;
}

function editarArea(row) {
  dialogAreaEdit.value = true;
  area.value = row;
}

async function actualizarArea() {
  let id = area.value.id;
  delete area.value.id;
  delete area.value.empresa;
  delete area.value.eliminacion;

  await api.patch("/area/" + id, area.value);
  dialogAreaEdit.value = false;
}

function eliminarArea(row) {
  Notify.create({
    timeout: 0,
    message: "¿Desea eliminar el Área " + row.nombre + " ?",
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          try {
            await api.delete("/area/" + row.id);
            obtenerAreas();
          } catch (error) {
            console.error("Error al eliminar el Área:", error);
          }
        },
      },
      { label: "Cancelar", handler: async () => {} },
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
    obtenerAreas();
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
