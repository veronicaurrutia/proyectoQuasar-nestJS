<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="change_circle" />Mantendor de Estados
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de estados<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogEstado = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Estados"
            :rows="estados"
            :columns="columns"
            :rows-per-page-options="[10]"
            :filter="filter"
          >
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
                  @click="editarEstado(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarEstado(props.row)"
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
          </q-table>
        </div>
      </q-card>
      <!-- DIALOGO CREAR EMPRESA  -->
      <q-dialog v-model="dialogEstado" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nuevo Estado</span>
          </q-card-section>
          <q-card-section>
            <q-option-group
              v-model="group"
              :options="options"
              color="primary"
              inline
            />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="estado.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="estado.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="estado.codigo"
              label="Codigo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              v-if="group != null"
              dense
              v-model="estado.empresaId"
              :options="empresas"
              label="Empresa"
              map-options
              emit-value
            />
            <q-select
              v-if="group == 2 && estado.empresaId != null"
              dense
              v-model="estado.areaId"
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
                @click="dialogEstado = false"
              />
              <q-btn label="Confirmar" color="primary" @click="crearEstado()" />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO EDITAR ESTADO -->
      <q-dialog v-model="dialogEstadoEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar la Estado</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="estado.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="estado.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="estado.codigo"
              label="Codigo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="estado.empresaId" :options="empresas" label="Empresa" map-options
                            emit-value /> -->
          </q-card-section>
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                v-close-popup
                @click="dialogEstadoEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarEstado()"
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
import { ref, reactive, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

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
  estados.value = [];
  const response = await api.get("/estados");
  estados.value = response.data;
};

const crearEstado = async () => {
  await api.post("/estados", estado);
  dialogEstado.value = false;
  obtenerEstados();
};

const obtenerAreasEmpresa = async () => {
  areas.value = [];
  const response = await api.get("/area/empresa/" + estado.empresaId);
  areas.value = response.data.map((item) => ({
    value: item.id,
    label: item.nombre,
  }));
};

const editarEstado = (row) => {
  dialogEstadoEdit.value = true;
  Object.assign(estado, row);
};

const obtenerEmpresa = async () => {
  const response = await api.get("/empresa/" + empresaId.value);
  empresas.value = [{ value: response.data.id, label: response.data.nombre }];
};

const actualizarEstado = async () => {
  const id = estado.id;
  const payload = { ...estado };
  delete payload.id;
  await api.patch("/estados/" + id, payload);
  dialogEstadoEdit.value = false;
  obtenerEstados();
};

const eliminarEstado = (row) => {
  Notify.create({
    timeout: 0,
    message: "¿ Desea eliminar el estado " + row.nombre + " ? ",
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          await api.delete("/estados/" + row.id);
          obtenerEstados();
        },
      },
      {
        label: "Cancelar",
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
