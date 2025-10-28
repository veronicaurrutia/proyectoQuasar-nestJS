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
              Gestiona las cuentas principales del sistema de manera eficiente
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add_circle"
              label="Nueva Cuenta"
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
    <q-dialog v-model="dialogCuenta" persistent class="cuenta-dialog">
      <q-card class="dialog-card responsive-dialog">
        <q-card-section class="dialog-header bg-primary text-white">
          <div class="row items-center">
            <q-avatar square icon="domain" color="white" text-color="primary" />
            <span class="q-ml-sm text-h6">Agregar Nueva Cuenta</span>
          </div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="cuenta.nombre"
                label="Nombre de la Cuenta *"
                outlined
                dense
                :rules="[(val) => !!val || 'El nombre es requerido']"
                hint="Ingresa el nombre de la cuenta"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="cuenta.email"
                label="Correo Electrónico *"
                type="email"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'El correo es requerido',
                  (val) =>
                    /\S+@\S+\.\S+/.test(val) || 'Formato de correo inválido',
                ]"
                hint="correo@ejemplo.com"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="cuenta.telefono"
                label="Teléfono *"
                outlined
                dense
                mask="(###) ###-####"
                :rules="[(val) => !!val || 'El teléfono es requerido']"
                hint="Número de contacto"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                v-model="cuenta.paisId"
                :options="paises"
                label="País *"
                outlined
                dense
                emit-value
                map-options
                :rules="[(val) => !!val || 'Selecciona un país']"
                hint="Selecciona el país"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="cuenta.direccion"
                label="Dirección Completa *"
                type="direccion"
                :rows="$q.screen.xs ? 2 : 3"
                outlined
                dense
                :rules="[(val) => !!val || 'La dirección es requerida']"
                hint="Dirección completa de la cuenta"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <div class="full-width">
            <div class="row q-gutter-sm justify-end">
              <q-btn
                flat
                label="Cancelar"
                color="grey-7"
                v-close-popup
                @click="dialogCuenta = false"
                :disable="cargandoIcon"
                class="action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
              <q-btn
                label="Crear Cuenta"
                color="primary"
                icon="add"
                @click="crearCuenta()"
                :loading="cargandoIcon"
                :disable="!puedeConfirmar"
                class="glossy action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO DE EDITAR CUENTA  -->
    <q-dialog v-model="dialogCuentaEdit" persistent class="cuenta-dialog">
      <q-card class="dialog-card responsive-dialog">
        <q-card-section class="dialog-header bg-secondary text-white">
          <div class="row items-center">
            <q-avatar square icon="edit" color="white" text-color="secondary" />
            <span class="q-ml-sm text-h6">Editar Cuenta</span>
          </div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="cuenta.nombre"
                label="Nombre de la Cuenta"
                outlined
                dense
                hint="Ingresa el nombre de la cuenta"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="cuenta.email"
                label="Correo Electrónico"
                type="email"
                outlined
                dense
                hint="correo@ejemplo.com"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                v-model="cuenta.telefono"
                label="Teléfono"
                outlined
                dense
                mask="(###) ###-####"
                hint="Número de contacto"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-select
                v-model="cuenta.paisId"
                :options="paises"
                label="País"
                outlined
                dense
                emit-value
                map-options
                hint="Selecciona el país"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="cuenta.direccion"
                label="Dirección Completa"
                type="textarea"
                :rows="$q.screen.xs ? 2 : 3"
                outlined
                dense
                hint="Dirección completa de la cuenta"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <div class="full-width">
            <div class="row q-gutter-sm justify-end">
              <q-btn
                flat
                label="Cancelar"
                color="grey-7"
                v-close-popup
                @click="dialogCuentaEdit = false"
                :disable="cargandoIcon"
                class="action-btn"
                :class="{ 'col-12 col-sm-auto': $q.screen.xs }"
              />
              <q-btn
                label="Actualizar"
                color="secondary"
                icon="save"
                @click="actualizarCuenta()"
                :loading="cargandoIcon"
                :disable="!puedeConfirmar"
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
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { ref, reactive, computed, watch, onMounted } from "vue";
//css
import "src/css/pages/cuentasPage.scss";

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
