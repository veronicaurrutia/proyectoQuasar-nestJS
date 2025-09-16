<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="account_circle" />Mantendor de cuentas
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de cuentas<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogCuenta = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
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
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </q-card>
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
    </div>
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
