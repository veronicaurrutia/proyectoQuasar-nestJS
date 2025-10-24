<template>
  <q-page class="cuentas-page">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="account_circle" size="48px" class="q-mr-md" />
              Mantenedor de Cuentas
            </h1>
            <p class="page-subtitle text-white">
              Gestiona las cuentas principales del sistema
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add"
              label="Agregar Cuenta"
              size="lg"
              class="glossy shadow-5"
              @click="dialogCuenta = true"
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
              Lista de Cuentas
            </h3>
          <q-table
            bordered
            title="Cuentas"
            :rows="cuentas"
            :columns="columns"
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
                  @click="editarCuenta(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarCuenta(props.row)"
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
        </q-card-section>
      </q-card>
      </div>
    </div>
      <!-- DIALOGO DE CREAR CUENTA  -->
      <q-dialog v-model="dialogCuenta" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nueva Cuenta</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="cuenta.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="cuenta.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="cuenta.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="cuenta.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="cuenta.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="cuenta.paisId"
              :options="paises"
              label="País"
              emit-value
              map-options
            />
          </q-card-section>
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                v-close-popup
                @click="dialogCuenta = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="crearCuenta()"
                :disable="!puedeConfirmar"
              />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO DE EDITAR CUENTA  -->
      <q-dialog v-model="dialogCuentaEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar Cuenta</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="cuenta.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="cuenta.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="cuenta.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="cuenta.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="cuenta.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="cuenta.paisId"
              :options="paises"
              label="País"
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
                @click="dialogCuentaEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarCuenta()"
                :disable="!puedeConfirmar"
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
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { ref, reactive, computed, watch, onMounted } from "vue";

const filter = ref("");
const dialogCuenta = ref(false);
const dialogCuentaEdit = ref(false);
const cargandoIcon = ref(false);
const cuentas = ref([]);
const paises = ref([]);

const cuenta = reactive({
  nombre: null,
  email: null,
  telefono: null,
  direccion: null,
  paisId: null,
  estado: true,
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
    name: "telefono",
    label: "Telefono",
    field: "telefono",
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
    align: "center",
    field: "actions",
    headerClasses: "bg-primary text-white glossy",
  },
];

const estados = [
  { label: "Activada", value: true },
  { label: "Desactivada", value: false },
];

const puedeConfirmar = computed(() => {
  return (
    cuenta.nombre &&
    cuenta.email &&
    cuenta.telefono &&
    cuenta.direccion &&
    cuenta.paisId &&
    cuenta.estado
  );
});

watch(dialogCuenta, (val) => {
  if (val === true) {
    Object.assign(cuenta, {
      nombre: null,
      email: null,
      telefono: null,
      direccion: null,
      paisId: null,
      estado: true,
    });
    obtenerCuentas();
  } else {
    obtenerCuentas();
  }
});

onMounted(() => {
  obtenerPaises();
  obtenerCuentas();
});

async function obtenerPaises() {
  paises.value = [];
  const response = await api.get("/pais");
  paises.value = response.data.map((item) => ({
    value: item.id,
    label: `${item.nombre} [${item.codigo}]`,
  }));
}

async function obtenerCuentas() {
  const response = await api.get("/cuenta");
  cuentas.value = response.data;
}

async function crearCuenta() {
  await api.post("/cuenta", cuenta);
  dialogCuenta.value = false;
  obtenerCuentas();
}

function editarCuenta(row) {
  Object.assign(cuenta, row);
  dialogCuentaEdit.value = true;
}

async function actualizarCuenta() {
  let id = cuenta.id;
  const { id: _, empresas, eliminacion, ...rest } = cuenta;
  await api.patch("/cuenta/" + id, rest);
  dialogCuentaEdit.value = false;
  obtenerCuentas();
}

function eliminarCuenta(row) {
  Notify.create({
    timeout: 0,
    message: `¿ Desea eliminar la cuenta ${row.nombre} ?`,
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          await api.delete("/cuenta/" + row.id);
          obtenerCuentas();
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

<style lang="scss" scoped>
// Aprovecha los estilos globales definidos en app.scss
.table-card {
  border-radius: 20px;
  border: 1px solid rgba(var(--q-primary-rgb), 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
