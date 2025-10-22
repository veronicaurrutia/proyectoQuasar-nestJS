<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="group" /> Mantenedor de Usuarios
        </h5>
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
        >
          Agregar
        </q-btn>

        <!-- 🔹 Agregamos las pestañas -->
        <q-tabs
          v-model="tab"
          dense
          class="text-primary q-mt-md"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="miArea" label="Usuarios de mi Área" icon="groups" />
          <q-tab name="sinArea" label="Usuarios para Asignar" icon="person" />
        </q-tabs>

        <q-separator />

        <!-- 🔹 Paneles que contienen las tablas -->
        <q-tab-panels v-model="tab" animated>
          <!-- 🟩 Panel 1: Usuarios de mi área -->
          <q-tab-panel name="miArea">
            <q-table
              bordered
              title="Usuarios de mi Área"
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
                  placeholder="Buscar..."
                  style="border: 1px solid #bbb; border-radius: 6px"
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
                  <q-btn
                    color="orange"
                    icon="public_off"
                    @click="eliminarArea(props.row)"
                    flat
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- 🟥 Panel 2: Usuarios sin área -->
          <q-tab-panel name="sinArea">
            <q-table
              bordered
              title="Usuarios para Asignar"
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
                  placeholder="Buscar..."
                  style="border: 1px solid #bbb; border-radius: 6px"
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
                    color="orange"
                    icon="public"
                    @click="abrirDialogArea(props.row)"
                    flat
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
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
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              stack-label
              dense
              lazy-rules
              color="primary"
              :rules="[
                (val) => !!val || 'El password es requerido',
                (val) => (val && val.length >= 6) || 'Mínimo 6 caracteres',
                (val) =>
                  /[A-Z]/.test(val) || 'Debe tener al menos una mayúscula',
                (val) => /[0-9]/.test(val) || 'Debe tener al menos un número',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
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
            <q-select
              dense
              v-model="usuario.areaId"
              :options="areas"
              label="Area"
              map-options
              emit-value
              readonly=""
            />
            <q-select
              dense
              v-model="perfil"
              :options="perfiles"
              option-label="nombre"
              option-value="id"
              label="Perfil"
              map-options
              emit-value
            />
          </q-card-section>
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn
                color="primary"
                class="glossy shadow-4"
                label="Cancelar"
                v-close-popup
                @click="dialogUsuario = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                class="glossy shadow-4"
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
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              stack-label
              dense
              lazy-rules
              color="primary"
              :rules="[
                (val) => !!val || 'El password es requerido',
                (val) => (val && val.length >= 6) || 'Mínimo 6 caracteres',
                (val) =>
                  /[A-Z]/.test(val) || 'Debe tener al menos una mayúscula',
                (val) => /[0-9]/.test(val) || 'Debe tener al menos un número',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Recuperar"
                  @click="recuperarPassword"
                />
              </template>
            </q-input>
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
                color="primary"
                class="glossy shadow-4"
                label="Cancelar"
                v-close-popup
                @click="dialogUsuarioEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                class="glossy shadow-4"
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
      <q-dialog v-model="dialogArea" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-select
            dense
            v-model="usuario.areaId"
            :options="areas"
            label="Area"
            map-options
            emit-value
            readonly=""
          />
          <q-select
            dense
            v-model="perfil"
            :options="perfiles"
            option-label="nombre"
            option-value="id"
            label="Perfil"
            map-options
            emit-value
          />
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn
                color="primary"
                class="glossy shadow-4"
                label="Cancelar"
                v-close-popup
                @click="dialogArea = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                class="glossy shadow-4"
                @click="agregarUsuarioArea()"
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
import { computed } from "vue";
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";

// ----- STATE -----
const showPassword = ref(false);
// ----- RECUPERAR PASSWORD -----
function recuperarPassword() {
  Notify.create({
    color: "info",
    message: "Funcionalidad de recuperación de contraseña (simulada).",
    icon: "info",
  });
}

const dialogArea = ref(false);
const tab = ref("miArea");
const filter = ref("");
const dialogUsuario = ref(false);
const dialogUsuarioEdit = ref(false);
const cargandoIcon = ref(false);

const usuarios = ref([]);
const cuentas = ref([]);
const empresas = ref([]);
const centros = ref([]);
const perfiles = ref([]);
const perfil = ref(null);
const areas = ref([]);
const usuarioSeleccionado = ref(null);

const usuarioStore = useUsuariostore();
const cuentaId = ref(usuarioStore.cuentaId);

const usuario = reactive({
  nombre: null,
  apellido: null,
  email: null,
  password: null,
  centroId: null,
  cuentaId: null,
  empresaId: null,
  areaId: null,
  areaIds: [],
  estado: true,
  perfilesPorArea: [],
});
const usuariosFiltrados = computed(() => {
  if (!filter.value) return usuarios.value;
  const letra = filter.value.trim().toLowerCase()[0];
  if (!letra) return usuarios.value;
  return usuarios.value.filter((u) => {
    return (
      (u.nombre && u.nombre[0]?.toLowerCase() === letra) ||
      (u.apellido && u.apellido[0]?.toLowerCase() === letra) ||
      (u.email && u.email[0]?.toLowerCase() === letra)
    );
  });
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
      nombre: null,
      apellido: null,
      email: null,
      password: null,
      centroId: null,
      cuentaId: null,
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

watch(tab, async (valor) => {
  if (valor === "miArea") {
    await obtenerUsuarios(); // llama a la función directamente
  } else if (valor === "sinArea") {
    await obtenerUsuariosNoArea(); // también directamente
  }
  console.log(valor, "el valor");
});

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
    const response = await api.get(`/usuario/area/${usuarioStore.area}`);
    usuarios.value = response.data;
    console.log(usuarios.value, "los usuarios");
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

const obtenerUsuariosNoArea = async () => {
  try {
    const response = await api.get(
      `/usuario/no-in-area/${usuarioStore.area}/empresa/${usuarioStore.empresa}`
    );
    usuarios.value = response.data;
    console.log(usuarios.value, "los usuarios sin mi area");
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

const crearUsuario = async () => {
  usuario.empresaId = usuarioStore.empresa;
  usuario.perfilesPorArea.push({
    perfilId: perfil.value,
    areasId: [usuarioStore.area],
  });
  console.log(usuario, "el usuario a insertar");
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

const obtenerArea = async () => {
  try {
    const response = await api.get(`/area/${usuarioStore.area}`);
    areas.value = [{ label: response.data.nombre, value: response.data.id }];
    usuario.areaId = usuarioStore.area;
    console.log(areas.value, "el area", usuarioStore.area);
  } catch (error) {
    console.error("error al obtener el area: ", error);
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

const obtenerPerfiles = async () => {
  try {
    const response = await api.get(`/perfil/colaborador`);
    perfiles.value = response.data;
    // console.log(usuarios, "los usuarios");
    console.log(perfiles.value, "los perfiles");
  } catch (error) {
    console.error("Error al obtener los perfiles:", error);
  }
};

const eliminarArea = async (row) => {
  const eliminar = { areaIds: [usuarioStore.area] };
  try {
    const response = await api.delete(`/usuario/${row.id}/areas`, {
      data: {
        areaIds: [String(usuarioStore.area)], // 👈 array de strings
      },
    });
    if (response.estado === "OK") {
      obtenerUsuarios();
    } else {
      obtenerUsuarios();
    }
  } catch (error) {
    console.error("error al elminar el area del usuario", error);
  }
};

const agregarUsuarioArea = async () => {
  try {
    const data = {
      areaIds: [String(usuarioStore.area)], // 👈 array de strings
    };
    const response = await api.post(
      `/usuario/${usuarioSeleccionado.value.id}/areas`,
      data
    );
    if (response.estado == "OK") {
      const resp = await api.patch(
        `/usuario/${usuarioSeleccionado.value.id}/cambiar-perfil-area`,
        {
          data: {
            perfilId: perfil.value,
            areaId: usuarioStore.area,
          },
        }
      );
      if (resp.estado === "OK") {
        obtenerUsuariosNoArea();
        dialogArea.value = false;
      } else {
        obtenerUsuariosNoArea();

        dialogArea.value = false;
      }
    }
  } catch (error) {
    console.error("error al agregar el area del usuario", error);
  }
};

const abrirDialogArea = (usuario) => {
  usuarioSeleccionado.value = usuario; // guardamos el usuario
  perfil.value = usuario.perfilId; // si quieres cargar su perfil actual
  dialogArea.value = true; // abrimos el diálogo
};

// ----- ON MOUNT -----
onMounted(async () => {
  if (!cuentaId.value) {
    await obtenerCuentas();
  } else {
    await obtenerCuentaUser();
  }
  await obtenerUsuarios();
  await obtenerPerfiles();
  await obtenerArea();
});
</script>
