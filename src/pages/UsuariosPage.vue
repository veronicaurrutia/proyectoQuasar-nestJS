<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="group" />Mantendor de Usuarios
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de usuarios<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogUsuario = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Usuarios"
            :rows="usuarios"
            :columns="columns"
            :filter="filter"
          >
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
                  @click="editarUsuario(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarUsuario(props.row)"
                  flat
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card>
      <q-dialog v-model="dialogUsuario" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="group" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nuevo Usuario</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="usuario.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="usuario.apellido"
              label="Apellido"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="usuario.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="usuario.password"
              label="Password"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              dense
              v-if="cuentaId == null"
              v-model="usuario.cuentaId"
              :options="cuentas"
              label="Cuenta"
              map-options
              emit-value
            />
            <q-select
              dense
              v-if="usuario.cuentaId != null"
              v-model="usuario.empresasId"
              :options="empresas"
              label="Empresa"
              map-options
              emit-value
              multiple
              use-chips
            />
            <q-select
              dense
              v-if="usuario.empresasId != null"
              v-model="usuario.centroId"
              :options="centros"
              label="Centro"
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
                @click="dialogUsuario = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="crearUsuario()"
              />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogUsuarioEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="group" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar Usuario</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="usuario.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="usuario.apellido"
              label="Apellido"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="usuario.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="usuario.password"
              label="Password"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              dense
              v-if="cuentaId == null"
              v-model="usuario.cuentaId"
              :options="cuentas"
              label="Cuenta"
              map-options
              emit-value
            />
            <q-select
              dense
              v-if="usuario.cuentaId != null"
              v-model="usuario.empresasId"
              :options="empresas"
              label="Empresa"
              map-options
              emit-value
              multiple
              use-chips
            />
            <q-select
              dense
              v-if="usuario.empresasId != null"
              v-model="usuario.centroId"
              :options="centros"
              label="Centro"
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
                @click="dialogUsuarioEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarUsuario()"
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
import { ref, reactive, watch, onMounted } from "vue";
import { Notify } from "quasar";
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";

// ----- STATE -----
const filter = ref("");
const dialogUsuario = ref(false);
const dialogUsuarioEdit = ref(false);
const cargandoIcon = ref(false);

const usuarios = ref([]);
const cuentas = ref([]);
const empresas = ref([]);
const centros = ref([]);

const usuarioStore = useUsuariostore();
const cuentaId = ref(usuarioStore.cuentaId);

const usuario = reactive({
  id: null,
  nombre: null,
  apellido: null,
  email: null,
  password: null,
  centroId: null,
  cuentaId: null,
  empresasId: null,
  estado: true,
});

// ----- TABLE COLUMNS -----
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
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    headerClasses: "bg-primary glossy text-white",
    style: "max-width: 150px",
  },
  {
    name: "apellido",
    label: "Apellido",
    align: "left",
    field: (row) => row.apellido,
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
    name: "cuenta",
    label: "Cuenta",
    field: (row) => (row.cuenta ? row.cuenta.nombre : "Sin cuenta"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "empresa",
    label: "Empresa",
    field: (row) => (row.empresa ? row.empresa.nombre : "Sin Empresa"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "centro",
    label: "Centro",
    field: (row) => (row.centro ? row.centro.nombre : "Sin centro"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "enabledopt",
    label: "Estado",
    field: "enabledopt",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
];

// ----- WATCHERS -----
watch(dialogUsuario, async (val) => {
  if (val) {
    Object.assign(usuario, {
      id: null,
      nombre: null,
      apellido: null,
      email: null,
      password: null,
      centroId: null,
      cuentaId: null,
      empresasId: null,
      estado: true,
    });
    await obtenerUsuarios();
  } else {
    await obtenerUsuarios();
  }
});

watch(
  () => usuario.cuentaId,
  async (valor) => {
    if (valor != null) await obtenerEmpresasCuenta(valor);
  }
);

watch(
  () => usuario.empresasId,
  async (valor) => {
    if (valor != null) await obtenerCentrosEmpresa(valor);
  }
);

// ----- METHODS -----
const obtenerCuentas = async () => {
  try {
    const response = await api.get("/cuenta");
    cuentas.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
  }
};

const obtenerUsuarios = async () => {
  try {
    const response = await api.get("/usuario");
    usuarios.value = response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

const crearUsuario = async () => {
  try {
    await api.post("/usuario", usuario);
    dialogUsuario.value = false;
    await obtenerUsuarios();
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
};

const editarUsuario = (row) => {
  dialogUsuarioEdit.value = true;
  Object.assign(usuario, row);
};

const actualizarUsuario = async () => {
  try {
    const payload = { ...usuario };
    const id = payload.id;
    delete payload.id;
    delete payload.cuenta;
    delete payload.empresa;
    delete payload.centro;
    delete payload.eliminacion;
    await api.patch(`/usuario/${id}`, payload);
    dialogUsuarioEdit.value = false;
    await obtenerUsuarios();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
};

const obtenerEmpresasCuenta = async (valor) => {
  try {
    const response = await api.get(`/empresa/cuenta/${valor}`);
    empresas.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  } catch (error) {
    console.error("Error al obtener empresas:", error);
  }
};

const obtenerCentrosEmpresa = async (valor) => {
  try {
    const response = await api.get(`/centro/empresa/${valor}`);
    centros.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  } catch (error) {
    console.error("Error al obtener centros:", error);
  }
};

const obtenerCuentaUser = async () => {
  try {
    const response = await api.get(`/cuenta/${cuentaId.value}`);
    cuentas.value = [{ label: response.data.nombre, value: response.data.id }];
    usuario.cuentaId = response.data.id;
  } catch (error) {
    console.error("Error al obtener cuenta:", error);
  }
};

const eliminarUsuario = (row) => {
  Notify.create({
    timeout: 0,
    message: `¿Desea eliminar el usuario ${row.nombre} ${row.apellido}?`,
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          try {
            await api.delete(`/usuario/${row.id}`);
            await obtenerUsuarios();
          } catch (error) {
            console.error("Error al eliminar usuario:", error);
          }
        },
      },
      { label: "Cancelar", handler: () => {} },
    ],
  });
};

// ----- ON MOUNT -----
onMounted(async () => {
  if (!cuentaId.value) {
    await obtenerCuentas();
  } else {
    await obtenerCuentaUser();
  }
  await obtenerUsuarios();
});
</script>
