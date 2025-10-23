<template>
  <q-page class="usuarios-page">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-accent">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="group" size="48px" class="q-mr-md" />
              Gestión de Usuarios
            </h1>
            <p class="page-subtitle text-white opacity-90">
              Administra usuarios, perfiles y permisos del sistema
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="accent"
              icon="person_add"
              label="Nuevo Usuario"
              size="lg"
              class="glossy shadow-5"
              @click="dialogUsuario = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section q-pa-lg">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="primary" size="60px" class="q-mb-md">
                  <q-icon name="people" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ usuarios.length }}
                </div>
                <div class="stat-label text-grey-7">Total Usuarios</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="green" size="60px" class="q-mb-md">
                  <q-icon name="check_circle" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ usuariosActivos }}
                </div>
                <div class="stat-label text-grey-7">Usuarios Activos</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="orange" size="60px" class="q-mb-md">
                  <q-icon name="access_time" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ usuariosRecientes }}
                </div>
                <div class="stat-label text-grey-7">Nuevos (7 días)</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="blue" size="60px" class="q-mb-md">
                  <q-icon name="domain" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ empresasUnicas }}
                </div>
                <div class="stat-label text-grey-7">Empresas</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section q-pa-lg">
      <div class="container">
        <q-card class="filters-card">
          <q-card-section>
            <div class="row q-col-gutter-md items-end">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="filter"
                  placeholder="Buscar usuarios..."
                  outlined
                  dense
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 col-md-2">
                <q-select
                  v-model="estadoFilter"
                  :options="estadoFilterOptions"
                  label="Estado"
                  outlined
                  dense
                  clearable
                  map-options
                  emit-value
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="row q-gutter-sm">
                  <q-btn
                    color="primary"
                    icon="filter_list"
                    label="Aplicar"
                    @click="aplicarFiltros"
                  />
                  <q-btn
                    color="grey-7"
                    icon="clear"
                    label="Limpiar"
                    outline
                    @click="limpiarFiltros"
                  />
                  <q-btn
                    color="secondary"
                    icon="download"
                    label="Exportar"
                    outline
                    @click="exportarUsuarios"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="table-card">
          <q-card-section>
            <div class="table-header q-mb-md">
              <div class="row items-center">
                <div class="col">
                  <h3 class="table-title">
                    <q-icon name="people_outline" class="q-mr-sm" />
                    Lista de Usuarios ({{ usuariosFiltrados.length }})
                  </h3>
                </div>
                <div class="col-auto">
                  <q-btn-toggle
                    v-model="vistaActual"
                    :options="vistaOptions"
                    color="primary"
                    outline
                  />
                </div>
              </div>
            </div>

            <!-- Table View -->
            <div v-if="vistaActual === 'tabla'">
              <q-table
                bordered
                :rows="usuariosFiltrados"
                :columns="columns"
                :filter="filter"
                class="modern-table"
                separator="horizontal"
                :pagination="{ rowsPerPage: 15 }"
              >
                <template v-slot:body-cell-index="props">
                  <q-td :props="props" class="text-center">
                    <q-chip
                      color="primary"
                      text-color="white"
                      :label="props.pageIndex + 1"
                      size="sm"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-usuario="props">
                  <q-td :props="props">
                    <div class="user-info">
                      <div class="row items-center">
                        <div class="col-auto">
                          <q-avatar
                            color="primary"
                            text-color="white"
                            size="40px"
                          >
                            {{
                              getInitials(props.row.nombre, props.row.apellido)
                            }}
                          </q-avatar>
                        </div>
                        <div class="col q-ml-md">
                          <div class="text-weight-medium">
                            {{ props.row.nombre }} {{ props.row.apellido }}
                          </div>
                          <div class="text-caption text-grey-6">
                            {{ props.row.email }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-enabledopt="props">
                  <q-td :props="props" class="text-center">
                    <q-badge
                      :color="props.row.estado ? 'green' : 'red'"
                      :label="props.row.estado ? 'Activo' : 'Inactivo'"
                      class="estado-badge"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <div class="actions-container">
                      <q-btn
                        color="primary"
                        icon="visibility"
                        size="sm"
                        round
                        flat
                        @click="verUsuario(props.row)"
                      >
                        <q-tooltip>Ver perfil</q-tooltip>
                      </q-btn>
                      <q-btn
                        color="secondary"
                        icon="edit"
                        size="sm"
                        round
                        flat
                        @click="editarUsuario(props.row)"
                      >
                        <q-tooltip>Editar</q-tooltip>
                      </q-btn>
                      <q-btn
                        :color="props.row.estado ? 'orange' : 'green'"
                        :icon="props.row.estado ? 'lock' : 'lock_open'"
                        size="sm"
                        round
                        flat
                        @click="toggleEstadoUsuario(props.row)"
                      >
                        <q-tooltip>{{
                          props.row.estado ? "Desactivar" : "Activar"
                        }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        color="negative"
                        icon="delete"
                        size="sm"
                        round
                        flat
                        @click="eliminarUsuario(props.row)"
                      >
                        <q-tooltip>Eliminar</q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </div>

            <!-- Card View -->
            <div v-else-if="vistaActual === 'cards'" class="cards-view">
              <div class="row q-col-gutter-md">
                <div
                  class="col-12 col-md-6 col-xl-4"
                  v-for="usuario in usuariosFiltrados"
                  :key="usuario.id"
                >
                  <q-card class="user-card hover-lift">
                    <q-card-section>
                      <div class="row items-center q-mb-md">
                        <div class="col-auto">
                          <q-avatar
                            color="primary"
                            text-color="white"
                            size="60px"
                          >
                            {{ getInitials(usuario.nombre, usuario.apellido) }}
                          </q-avatar>
                        </div>
                        <div class="col q-ml-md">
                          <h4 class="user-name q-my-xs">
                            {{ usuario.nombre }} {{ usuario.apellido }}
                          </h4>
                          <div class="user-email text-grey-7">
                            {{ usuario.email }}
                          </div>
                          <q-badge
                            :color="usuario.estado ? 'green' : 'red'"
                            :label="usuario.estado ? 'Activo' : 'Inactivo'"
                            class="q-mt-xs"
                          />
                        </div>
                      </div>

                      <div class="user-details">
                        <div class="detail-row">
                          <q-icon name="domain" class="q-mr-sm" />
                          <span>{{
                            usuario.empresa?.nombre || "Sin empresa"
                          }}</span>
                        </div>
                        <div class="detail-row">
                          <q-icon name="location_city" class="q-mr-sm" />
                          <span>{{
                            usuario.centro?.nombre || "Sin centro"
                          }}</span>
                        </div>
                        <div class="detail-row">
                          <q-icon name="account_balance" class="q-mr-sm" />
                          <span>{{
                            usuario.cuenta?.nombre || "Sin cuenta"
                          }}</span>
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-actions align="right">
                      <q-btn
                        flat
                        color="primary"
                        icon="visibility"
                        @click="verUsuario(usuario)"
                      >
                        Ver
                      </q-btn>
                      <q-btn
                        flat
                        color="secondary"
                        icon="edit"
                        @click="editarUsuario(usuario)"
                      >
                        Editar
                      </q-btn>
                      <q-btn
                        flat
                        :color="usuario.estado ? 'orange' : 'green'"
                        :icon="usuario.estado ? 'lock' : 'lock_open'"
                        @click="toggleEstadoUsuario(usuario)"
                      >
                        {{ usuario.estado ? "Desactivar" : "Activar" }}
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Crear Usuario -->
    <q-dialog v-model="dialogUsuario" persistent class="user-dialog">
      <q-card class="dialog-card" style="width: 900px; max-width: 95vw">
        <q-card-section class="dialog-header bg-accent text-white">
          <div class="row items-center">
            <q-avatar
              square
              icon="person_add"
              color="white"
              text-color="accent"
            />
            <span class="q-ml-sm text-h6">Agregar Nuevo Usuario</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.nombre"
                label="Nombre *"
                outlined
                :rules="[(val) => !!val || 'El nombre es requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="usuario.apellido"
                label="Apellido *"
                outlined
                :rules="[(val) => !!val || 'El apellido es requerido']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="usuario.email"
                label="Correo Electrónico *"
                type="email"
                outlined
                :rules="[
                  (val) => !!val || 'El correo es requerido',
                  (val) => /.+@.+\..+/.test(val) || 'Ingresa un correo válido',
                ]"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="usuario.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña *"
                outlined
                :rules="[
                  (val) => !!val || 'La contraseña es requerida',
                  (val) => (val && val.length >= 6) || 'Mínimo 6 caracteres',
                  (val) =>
                    /[A-Z]/.test(val) || 'Debe tener al menos una mayúscula',
                  (val) => /[0-9]/.test(val) || 'Debe tener al menos un número',
                ]"
                hint="Mínimo 6 caracteres, una mayúscula y un número"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6" v-if="cuentaId == null">
              <q-select
                v-model="usuario.cuentaId"
                :options="cuentas"
                label="Cuenta *"
                outlined
                map-options
                emit-value
                :rules="[(val) => !!val || 'Selecciona una cuenta']"
              />
            </div>

            <div class="col-12 col-md-6" v-if="usuario.cuentaId != null">
              <q-select
                v-model="usuario.centroId"
                :options="centros"
                label="Centro"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-toggle
                v-model="usuario.estado"
                label="Usuario activo"
                color="green"
                size="lg"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogUsuario = false"
            :disable="cargandoIcon"
          />
          <q-btn
            label="Crear Usuario"
            color="accent"
            icon="person_add"
            @click="crearUsuario"
            :loading="cargandoIcon"
            class="glossy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Editar Usuario -->
    <q-dialog v-model="dialogUsuarioEdit" persistent class="user-dialog">
      <q-card class="dialog-card" style="width: 900px; max-width: 95vw">
        <q-card-section class="dialog-header bg-secondary text-white">
          <div class="row items-center">
            <q-avatar square icon="edit" color="white" text-color="secondary" />
            <span class="q-ml-sm text-h6">Modificar Usuario</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="usuario.nombre" label="Nombre" outlined />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="usuario.apellido" label="Apellido" outlined />
            </div>

            <div class="col-12">
              <q-input
                v-model="usuario.email"
                label="Correo Electrónico"
                type="email"
                outlined
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="usuario.password"
                :type="showPassword ? 'text' : 'password'"
                label="Nueva Contraseña"
                outlined
                hint="Deja en blanco para mantener la actual"
                :rules="[
                  (val) => !val || val.length >= 6 || 'Mínimo 6 caracteres',
                  (val) =>
                    !val ||
                    /[A-Z]/.test(val) ||
                    'Debe tener al menos una mayúscula',
                  (val) =>
                    !val ||
                    /[0-9]/.test(val) ||
                    'Debe tener al menos un número',
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
            </div>

            <div class="col-12 col-md-6" v-if="cuentaId == null">
              <q-select
                v-model="usuario.cuentaId"
                :options="cuentas"
                label="Cuenta"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6" v-if="usuario.cuentaId != null">
              <q-select
                v-model="usuario.centroId"
                :options="centros"
                label="Centro"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-toggle
                v-model="usuario.estado"
                label="Usuario activo"
                color="green"
                size="lg"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogUsuarioEdit = false"
            :disable="cargandoIcon"
          />
          <q-btn
            label="Actualizar"
            color="secondary"
            icon="save"
            @click="actualizarUsuario"
            :loading="cargandoIcon"
            class="glossy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { Notify } from "quasar";
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";

// ----- STATE -----
const showPassword = ref(false);
const filter = ref("");
const dialogUsuario = ref(false);
const dialogUsuarioEdit = ref(false);
const cargandoIcon = ref(false);
const vistaActual = ref("tabla");

// Filtros
const estadoFilter = ref(null);

const usuarios = ref([]);
const cuentas = ref([]);
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
  estado: true,
});

// ----- COMPUTED -----
const usuariosFiltrados = computed(() => {
  let filtrados = usuarios.value;

  if (estadoFilter.value !== null) {
    filtrados = filtrados.filter((u) => u.estado === estadoFilter.value);
  }

  return filtrados;
});

const usuariosActivos = computed(() => {
  return usuarios.value.filter((u) => u.estado).length;
});

const usuariosRecientes = computed(() => {
  // Simulación de usuarios recientes (últimos 7 días)
  return Math.min(3, usuarios.value.length);
});

const empresasUnicas = computed(() => {
  const empresasSet = new Set(
    usuarios.value.map((u) => u.empresa?.id).filter(Boolean)
  );
  return empresasSet.size;
});

const estadoFilterOptions = computed(() => [
  { label: "Activos", value: true },
  { label: "Inactivos", value: false },
]);

const vistaOptions = [
  { label: "Tabla", value: "tabla", icon: "table_view" },
  { label: "Tarjetas", value: "cards", icon: "view_module" },
];

// ----- TABLE COLUMNS -----
const columns = [
  {
    name: "index",
    label: "#",
    headerClasses: "bg-primary text-white",
    align: "center",
    field: (row) => row.id,
  },
  {
    name: "usuario",
    label: "Usuario",
    align: "left",
    field: "usuario",
    headerClasses: "bg-primary text-white",
    style: "min-width: 250px",
  },
  {
    name: "cuenta",
    label: "Cuenta",
    field: (row) => (row.cuenta ? row.cuenta.nombre : "Sin cuenta"),
    align: "center",
    headerClasses: "bg-primary text-white",
  },
  {
    name: "empresa",
    label: "Empresa",
    field: (row) => (row.empresa ? row.empresa.nombre : "Sin Empresa"),
    align: "center",
    headerClasses: "bg-primary text-white",
  },
  {
    name: "centro",
    label: "Centro",
    field: (row) => (row.centro ? row.centro.nombre : "Sin centro"),
    align: "center",
    headerClasses: "bg-primary text-white",
  },
  {
    name: "enabledopt",
    label: "Estado",
    field: "enabledopt",
    align: "center",
    headerClasses: "bg-primary text-white",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-primary text-white",
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
    if (valor != null) {
      await obtenerCentrosCuenta(valor);
    }
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
  cargandoIcon.value = true;
  try {
    await api.post("/usuario", usuario);
    Notify.create({
      type: "positive",
      message: "Usuario creado exitosamente",
      icon: "check_circle",
    });
    dialogUsuario.value = false;
    await obtenerUsuarios();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    Notify.create({
      type: "negative",
      message: "Error al crear el usuario",
    });
  } finally {
    cargandoIcon.value = false;
  }
};

const editarUsuario = (row) => {
  dialogUsuarioEdit.value = true;
  Object.assign(usuario, row);
};

const verUsuario = (row) => {
  Notify.create({
    type: "info",
    message: `Visualizando perfil de ${row.nombre} ${row.apellido}`,
    icon: "visibility",
  });
};

const toggleEstadoUsuario = async (row) => {
  try {
    const nuevoEstado = !row.estado;
    await api.patch(`/usuario/${row.id}`, { estado: nuevoEstado });

    Notify.create({
      type: "positive",
      message: `Usuario ${
        nuevoEstado ? "activado" : "desactivado"
      } exitosamente`,
      icon: nuevoEstado ? "lock_open" : "lock",
    });

    await obtenerUsuarios();
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    Notify.create({
      type: "negative",
      message: "Error al cambiar el estado del usuario",
    });
  }
};

const actualizarUsuario = async () => {
  cargandoIcon.value = true;
  try {
    const payload = { ...usuario };
    const id = payload.id;
    delete payload.id;
    delete payload.cuenta;
    delete payload.empresa;
    delete payload.centro;
    delete payload.eliminacion;

    // Si no hay password, no enviarlo
    if (!payload.password) {
      delete payload.password;
    }

    await api.patch(`/usuario/${id}`, payload);
    Notify.create({
      type: "positive",
      message: "Usuario actualizado exitosamente",
      icon: "save",
    });
    dialogUsuarioEdit.value = false;
    await obtenerUsuarios();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    Notify.create({
      type: "negative",
      message: "Error al actualizar el usuario",
    });
  } finally {
    cargandoIcon.value = false;
  }
};

const obtenerCentrosCuenta = async (valor) => {
  try {
    const response = await api.get(`/centro/cuenta/${valor}`);
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
            Notify.create({
              type: "positive",
              message: "Usuario eliminado exitosamente",
            });
            await obtenerUsuarios();
          } catch (error) {
            console.error("Error al eliminar usuario:", error);
            Notify.create({
              type: "negative",
              message: "Error al eliminar el usuario",
            });
          }
        },
      },
      { label: "Cancelar", handler: () => {} },
    ],
  });
};

const recuperarPassword = () => {
  Notify.create({
    color: "info",
    message: "Funcionalidad de recuperación de contraseña (simulada).",
    icon: "info",
  });
};

const aplicarFiltros = () => {
  Notify.create({
    type: "info",
    message: "Filtros aplicados",
    icon: "filter_list",
  });
};

const limpiarFiltros = () => {
  estadoFilter.value = null;
  filter.value = "";
  Notify.create({
    type: "info",
    message: "Filtros limpiados",
    icon: "clear",
  });
};

const exportarUsuarios = () => {
  Notify.create({
    type: "info",
    message: "Exportando usuarios...",
    icon: "download",
  });
};

const getInitials = (nombre, apellido) => {
  const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : "";
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : "";
  return inicial1 + inicial2;
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

<style lang="scss" scoped>
.usuarios-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.bg-gradient-accent {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  line-height: 1.5;
}

.stats-section {
  margin-top: -40px;
  position: relative;
  z-index: 1;
}

.stat-card {
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
}

.stat-value {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filters-section {
  margin-top: -20px;
  position: relative;
  z-index: 1;
}

.filters-card,
.table-card {
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modern-table {
  border-radius: 10px;
  overflow: hidden;
}

.user-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.user-email {
  font-size: 0.9rem;
}

.user-details {
  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #5f6368;
  }
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.actions-container {
  display: flex;
  gap: 4px;
}

.dialog-card {
  border-radius: 15px;
  overflow: hidden;
}

.dialog-header {
  padding: 20px 24px;
}

.estado-badge {
  font-weight: 600;
}

.user-info {
  min-width: 200px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.cards-view {
  min-height: 300px;
}

@media (max-width: 768px) {
  .stats-section {
    margin-top: -20px;
  }

  .filters-section {
    margin-top: -10px;
  }

  .page-header {
    text-align: center;
  }

  .actions-container {
    justify-content: center;
  }
}
</style>
