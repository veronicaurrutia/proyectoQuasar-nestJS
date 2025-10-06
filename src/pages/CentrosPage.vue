<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="warehouse" />Mantendor de Centros
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de centros<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogCentro = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Centros"
            :rows="centros"
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
                  @click="editarCentro(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarCentro(props.row)"
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
      <!-- DIALOGO CREAR EMPRESA -->
      <q-dialog v-model="dialogCentro" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nueva Centro</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="centro.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="centro.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="centro.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="centro.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              dense
              v-model="centro.estado"
              :options="estados"
              label="Estado"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="centro.paisId"
              :options="paises"
              label="País"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="centro.cuentaEmpresaId"
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
                @click="dialogCentro = false"
              />
              <q-btn label="Confirmar" color="primary" @click="crearCentro()" />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO EDITAR EMPRESA -->
      <q-dialog v-model="dialogCentroEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar la Centro</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="centro.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="centro.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="centro.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="centro.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              dense
              v-model="centro.estado"
              :options="estados"
              label="Estado"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="centro.paisId"
              :options="paises"
              label="País"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="centro.cuentaEmpresaId"
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
                @click="dialogCentroEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarCentro()"
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
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
import { ref, reactive, onMounted, watch } from "vue";

const filter = ref("");
const dialogCentro = ref(false);
const cargandoIcon = ref(false);
const dialogCentroEdit = ref(false);
const centros = ref([]);
const paises = ref([]);
const cuentas = ref([]);
const empresas = ref([]);

const centro = reactive({
  nombre: null,
  direccion: null,
  email: null,
  telefono: null,
  estado: null,
  cuentaEmpresaId: null,
  paisId: null,
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
    name: "email",
    label: "Correo",
    field: "email",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "direccion",
    label: "Dirección",
    field: "direccion",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "Empresa",
    label: "Empresa",
    field: (row) =>
      row.cuentaEmpresa ? row.cuentaEmpresa.nombre : "Sin Empresa",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "País",
    label: "País",
    field: (row) => (row.pais ? row.pais.nombre : "Sin País"),
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

const empresaId = ref(null);
const cuentaId = ref(null);

const usuarioStore = useUsuariostore();

onMounted(() => {
  cuentaId.value = usuarioStore.cuentaId;
  empresaId.value = usuarioStore.empresa;
  obtenerPaises();
  obtenerCentros();
});

watch(dialogCentro, (val) => {
  if (val === true) {
    Object.assign(centro, {
      nombre: null,
      direccion: null,
      email: null,
      telefono: null,
      estado: null,
      cuentaEmpresaId: null,
      paisId: null,
    });
    obtenerEmpresas();
    obtenerCentros();
  } else {
    obtenerCentros();
  }
});

watch(dialogCentroEdit, (val) => {
  if (val === false) {
    obtenerCentros();
  } else {
    obtenerEmpresas();
  }
});

async function obtenerPaises() {
  const response = await api.get("pais");
  paises.value = response.data.map((item) => ({
    value: item.id,
    label: `${item.nombre} [${item.codigo}]`,
  }));
}

async function obtenerCentros() {
  if (empresaId.value == null) {
    const response = await api.get("/centro");
    centros.value = response.data;
  } else {
    const response = await api.get("/centro/empresa/" + empresaId.value);
    centros.value = response.data;
  }
}

async function obtenerEmpresas() {
  if (cuentaId.value == null) {
    const response = await api.get("/empresa");
    empresas.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  } else {
    const response = await api.get("/empresa/cuenta/" + cuentaId.value);
    empresas.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  }
}

async function crearCentro() {
  await api.post("/centro", centro);
  dialogCentro.value = false;
}

function editarCentro(row) {
  dialogCentroEdit.value = true;
  Object.assign(centro, row);
}

async function actualizarCentro() {
  let id = centro.id;
  const { id: _, cuentaEmpresa, pais, eliminacion, ...rest } = centro;
  await api.patch("/centro/" + id, rest);
  dialogCentroEdit.value = false;
}

function eliminarCentro(row) {
  Notify.create({
    timeout: 0,
    message: `¿ Desea eliminar el centro ${row.nombre} ?`,
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          await api.delete("/centro/" + row.id);
          obtenerCentros();
        },
      },
      {
        label: "Cancelar",
        handler: () => console.log("Eliminación cancelada"),
      },
    ],
  });
}
</script>
