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
              :label="$q.screen.xs ? '' : 'Nuevo Usuario'"
              size="lg"
              class="glossy shadow-5"
              @click="dialogUsuario = true"
            />
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
                <div class="row q-gutter-sm justify-start">
                  <q-btn
                    color="primary"
                    icon="filter_list"
                    :label="$q.screen.xs ? '' : 'Aplicar'"
                    @click="aplicarFiltros"
                    :size="$q.screen.xs ? 'sm' : 'md'"
                  />
                  <q-btn
                    color="grey-7"
                    icon="clear"
                    :label="$q.screen.xs ? '' : 'Limpiar'"
                    outline
                    @click="limpiarFiltros"
                    :size="$q.screen.xs ? 'sm' : 'md'"
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
              </div>
            </div>
            <q-tabs
              v-model="tab"
              dense
              class="text-primary"
              :align="$q.screen.xs ? 'left' : 'justify'"
              active-color="primary"
              indicator-color="primary"
              :mobile-arrows="$q.screen.xs"
              :outside-arrows="$q.screen.xs"
            >
              <q-tab
                name="usuariosArea"
                :label="$q.screen.xs ? 'Mi Área' : 'Usuarios de mi Área'"
                icon="group"
              />
              <q-tab
                name="usuariosNoArea"
                :label="$q.screen.xs ? 'Sin Área' : 'Usuarios sin Área'"
                icon="person_off"
              />
            </q-tabs>

            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <!-- 🔸 TAB 1: Usuarios de mi Área -->
              <q-tab-panel name="usuariosArea">
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
                    :grid="$q.screen.xs"
                    :columns-mobile="columnsMobile"
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
                                  getInitials(
                                    props.row.nombre,
                                    props.row.apellido,
                                  )
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
                              props.row.estado ? 'Desactivar' : 'Activar'
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
                    <template v-slot:body-cell-area="props">
                      <q-td :props="props">
                        <div class="actions-container">
                          <q-btn
                            color="primary"
                            icon="label_off"
                            size="sm"
                            round
                            flat
                            @click="eliminarArea(props.row)"
                          >
                            <q-tooltip>Eliminar del Area</q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>
              <q-tab-panel name="usuariosNoArea">
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
                    :grid="$q.screen.xs"
                    :columns-mobile="columnsMobile"
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
                                  getInitials(
                                    props.row.nombre,
                                    props.row.apellido,
                                  )
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
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-area="props">
                      <q-td :props="props">
                        <div class="actions-container">
                          <q-btn
                            color="primary"
                            icon="new_label"
                            size="sm"
                            round
                            flat
                            @click="abrirDialogArea(props.row)"
                          >
                            <q-tooltip>Agregar al Area</q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-tab-panel>
            </q-tab-panels>

            <!-- Card View -->
            <!-- <div v-else-if="vistaActual === 'cards'" class="cards-view">
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
            </div> -->
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Crear Usuario -->
    <q-dialog v-model="dialogUsuario" persistent class="user-dialog">
      <q-card
        class="dialog-card"
        style="width: 100%; max-width: 900px; max-height: 90vh"
      >
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

            <!-- <div class="col-12"> -->
            <!-- <q-input
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
              > -->
            <!-- <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  /> -->
            <!-- </template>
              </q-input>
            </div> -->

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
              <q-select
                dense
                v-model="area"
                :options="areas"
                label="Area"
                map-options
                emit-value
                readonly=""
              />
            </div>
            <div class="col-12 col-md-6">
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
            </div>

            <div class="col-12 col-md-6">
              <q-toggle
                v-model="usuario.estado"
                label="Usuario activo"
                color="green"
                size="lg"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="row q-gutter-sm justify-end items-center">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  v-close-popup
                  @click="dialogUsuario = false"
                  :disable="cargandoIcon"
                  size="md"
                />
                <q-btn
                  label="Crear Usuario"
                  color="accent"
                  icon="person_add"
                  @click="crearUsuario"
                  :loading="cargandoIcon"
                  class="glossy"
                  size="md"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog Editar Usuario -->
    <q-dialog v-model="dialogUsuarioEdit" persistent class="user-dialog">
      <q-card
        class="dialog-card"
        style="width: 100%; max-width: 900px; max-height: 90vh"
      >
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

            <!-- <div class="col-12">
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
            </div> -->

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
            size="sm"
          />
          <q-btn
            label="Actualizar"
            color="secondary"
            icon="save"
            @click="actualizarUsuario"
            :loading="cargandoIcon"
            class="glossy"
            size="sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Dialog Agregar Perfil y Area -->
    <q-dialog v-model="dialogArea" persistent class="user-dialog">
      <q-card
        class="dialog-card area-dialog-card"
        style="width: 100%; max-width: 900px; max-height: 90vh"
      >
        <q-card-section class="dialog-header bg-accent text-white">
          <div class="row items-center">
            <q-avatar
              square
              icon="person_add"
              color="white"
              text-color="accent"
            />
            <span class="q-ml-sm text-h6">Agregar Nuevo Usuario al Area</span>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                dense
                v-model="area"
                :options="areas"
                label="Area"
                map-options
                emit-value
                readonly=""
              />
            </div>

            <div class="col-12 col-md-6">
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
            </div>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right" class="q-pa-md dialog-actions">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogArea = false"
            :disable="cargandoIcon"
            class="cancel-btn"
            size="sm"
          />
          <q-btn
            label="Agregar Usuario"
            color="accent"
            icon="person_add"
            @click="agregarUsuarioArea()"
            :loading="cargandoIcon"
            class="glossy action-btn"
            size="sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { useUsuariostore } from 'src/stores/usuario.store';
//css
import 'src/css/pages/usuariosPage.scss';

// ----- STATE -----
const filter = ref('');
const dialogUsuario = ref(false);
const dialogUsuarioEdit = ref(false);
const cargandoIcon = ref(false);
const vistaActual = ref('tabla');
const dialogArea = ref(false);
const tab = ref('usuariosArea');
const perfiles = ref([]);
const perfil = ref(null);
const usuarioSeleccionado = ref(null);

// Filtros
const estadoFilter = ref(null);

const usuarios = ref([]);
const cuentas = ref([]);
const centros = ref([]);
const areas = ref([]);
const area = ref(null);

const usuarioStore = useUsuariostore();
const cuentaId = ref(usuarioStore.cuentaId);

const usuario = reactive({
  nombre: null,
  apellido: null,
  email: null,
  password: null,
  centroId: null,
  cuentaId: null,
  estado: true,
  areaIds: [],
  empresaId: null,
  perfilesPorArea: [],
});

// ----- COMPUTED -----
const usuariosFiltrados = computed(() => {
  let filtrados = usuarios.value;

  if (estadoFilter.value !== null) {
    filtrados = filtrados.filter((u) => u.estado === estadoFilter.value);
  }

  return filtrados;
});

const estadoFilterOptions = computed(() => [
  { label: 'Activos', value: true },
  { label: 'Inactivos', value: false },
]);

const vistaOptions = [
  { label: 'Tabla', value: 'tabla', icon: 'table_view' },
  { label: 'Tarjetas', value: 'cards', icon: 'view_module' },
];

// ----- TABLE COLUMNS -----
const columns = [
  {
    name: 'index',
    label: '#',
    headerClasses: 'bg-primary text-white',
    align: 'center',
    field: (row) => row.id,
  },
  {
    name: 'usuario',
    label: 'Usuario',
    align: 'left',
    field: 'usuario',
    headerClasses: 'bg-primary text-white',
    style: 'min-width: 250px',
  },
  {
    name: 'cuenta',
    label: 'Cuenta',
    field: (row) => (row.cuenta ? row.cuenta.nombre : 'Sin cuenta'),
    align: 'center',
    headerClasses: 'bg-primary text-white',
  },
  {
    name: 'empresa',
    label: 'Empresa',
    field: (row) => (row.empresa ? row.empresa.nombre : 'Sin Empresa'),
    align: 'center',
    headerClasses: 'bg-primary text-white',
  },
  {
    name: 'centro',
    label: 'Centro',
    field: (row) => (row.centro ? row.centro.nombre : 'Sin centro'),
    align: 'center',
    headerClasses: 'bg-primary text-white',
  },
  {
    name: 'enabledopt',
    label: 'Estado',
    field: 'enabledopt',
    align: 'center',
    headerClasses: 'bg-primary text-white',
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
    headerClasses: 'bg-primary text-white',
  },
  {
    name: 'area',
    label: 'Area',
    field: 'area',
    align: 'center',
    headerClasses: 'bg-primary text-white',
  },
];

// Columnas para vista móvil
const columnsMobile = [
  {
    name: 'usuario',
    label: 'Usuario',
    align: 'left',
    field: 'usuario',
  },
  {
    name: 'enabledopt',
    label: 'Estado',
    field: 'enabledopt',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
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
    if (valor != null) {
      await obtenerCentrosCuenta(valor);
    }
  },
);

watch(tab, async (valor) => {
  if (valor === 'usuariosArea') {
    await obtenerUsuarios(); // llama a la función directamente
  } else if (valor === 'usuariosNoArea') {
    await obtenerUsuariosNoArea(); // también directamente
  }
  // console.log(valor, "el valor");
});

// ----- METHODS -----
const obtenerCuentas = async () => {
  try {
    const response = await api.get('/cuenta');
    cuentas.value = response.data.map((item) => ({
      value: item.id,
      label: item.nombre,
    }));
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
  }
};

const obtenerUsuarios = async () => {
  usuarios.value = [];
  try {
    const response = await api.get(`/usuario/area/${usuarioStore.area}`);
    usuarios.value = response.data;
    console.log(usuarios.value, 'los usuarios');
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
};

const obtenerUsuariosNoArea = async () => {
  usuarios.value = [];
  try {
    const response = await api.get(
      `/usuario/no-in-area/${usuarioStore.area}/empresa/${usuarioStore.empresa}`,
    );
    usuarios.value = response.data;
    console.log(usuarios.value, 'los usuarios sin mi area');
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
};

const crearUsuario = async () => {
  cargandoIcon.value = true;
  usuario.areaIds.push(area.value);
  usuario.empresaId = usuarioStore.empresa;
  usuario.cuentaId = usuarioStore.cuentaId;
  usuario.perfilesPorArea.push({
    perfilId: perfil.value,
    areaIds: [area.value],
  });
  console.log(usuario, 'el usuario');
  try {
    await api.post('/usuario', usuario);
    Notify.create({
      type: 'positive',
      message: 'Usuario creado exitosamente',
      icon: 'check_circle',
    });
    dialogUsuario.value = false;
    await obtenerUsuarios();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al crear el usuario',
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
    type: 'info',
    message: `Visualizando perfil de ${row.nombre} ${row.apellido}`,
    icon: 'visibility',
  });
};

const toggleEstadoUsuario = async (row) => {
  try {
    const nuevoEstado = !row.estado;
    await api.patch(`/usuario/${row.id}`, { estado: nuevoEstado });

    Notify.create({
      type: 'positive',
      message: `Usuario ${
        nuevoEstado ? 'activado' : 'desactivado'
      } exitosamente`,
      icon: nuevoEstado ? 'lock_open' : 'lock',
    });

    await obtenerUsuarios();
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al cambiar el estado del usuario',
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
      type: 'positive',
      message: 'Usuario actualizado exitosamente',
      icon: 'save',
    });
    dialogUsuarioEdit.value = false;
    await obtenerUsuarios();
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al actualizar el usuario',
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
    console.error('Error al obtener centros:', error);
  }
};

const obtenerCuentaUser = async () => {
  try {
    const response = await api.get(`/cuenta/${cuentaId.value}`);
    cuentas.value = [{ label: response.data.nombre, value: response.data.id }];
    usuario.cuentaId = response.data.id;
  } catch (error) {
    console.error('Error al obtener cuenta:', error);
  }
};

const obtenerArea = async () => {
  try {
    const response = await api.get(`/area/${usuarioStore.area}`);
    areas.value = [{ label: response.data.nombre, value: response.data.id }];
    area.value = usuarioStore.area;
    console.log(areas.value, 'el area', usuarioStore.area);
  } catch (error) {
    console.error('error al obtener el area: ', error);
  }
};

const eliminarUsuario = (row) => {
  Notify.create({
    timeout: 0,
    message: `¿Desea eliminar el usuario ${row.nombre} ${row.apellido}?`,
    actions: [
      {
        label: 'Eliminar',
        color: 'red',
        handler: async () => {
          try {
            await api.delete(`/usuario/${row.id}`);
            Notify.create({
              type: 'positive',
              message: 'Usuario eliminado exitosamente',
            });
            await obtenerUsuarios();
          } catch (error) {
            console.error('Error al eliminar usuario:', error);
            Notify.create({
              type: 'negative',
              message: 'Error al eliminar el usuario',
            });
          }
        },
      },
      { label: 'Cancelar', handler: () => {} },
    ],
  });
};

const obtenerPerfiles = async () => {
  try {
    const response = await api.get(`/perfil/colaborador`);
    perfiles.value = response.data;
    // console.log(usuarios, "los usuarios");
    console.log(perfiles.value, 'los perfiles');
  } catch (error) {
    console.error('Error al obtener los perfiles:', error);
  }
};

const eliminarArea = async (row) => {
  try {
    const response = await api.delete(`/usuario/${row.id}/areas`, {
      data: {
        areaIds: [String(usuarioStore.area)], // 👈 array de strings
      },
    });
    if (response.status === 200) {
      const resp = await api.delete(
        `/usuario/${row.id}/perfil-area/${usuarioStore.area}`,
      );
      if (response.status == 200) {
        obtenerUsuarios();
        dialogArea.value = false;
      }
    } else {
      obtenerUsuarios();
    }
  } catch (error) {
    console.error('error al elminar el area del usuario', error);
  }
};

const agregarUsuarioArea = async () => {
  try {
    const data = {
      areaIds: [String(usuarioStore.area)], // array de strings
    };

    const body = {
      perfilId: perfil.value,
      areaId: usuarioStore.area,
    };

    // Primero agrega el área al usuario
    const response = await api.post(
      `/usuario/${usuarioSeleccionado.value.id}/areas`,
      data,
    );
    console.log(response, 'la respuesta');
    if (response.status === 201) {
      // Luego asigna el perfil en esa área
      const resp = await api.post(
        `/usuario/${usuarioSeleccionado.value.id}/perfil-area`,
        body, // ✅ sin { body }
      );

      if (resp.estado === 'OK') {
        obtenerUsuariosNoArea();
        dialogArea.value = false;
      } else {
        obtenerUsuariosNoArea();
        dialogArea.value = false;
      }
    }
  } catch (error) {
    console.error('Error al agregar el área del usuario', error);
  }
};

const abrirDialogArea = (usuario) => {
  usuarioSeleccionado.value = usuario; // guardamos el usuario
  perfil.value = usuario.perfilId; // si quieres cargar su perfil actual
  dialogArea.value = true; // abrimos el diálogo
};

const recuperarPassword = () => {
  Notify.create({
    color: 'info',
    message: 'Funcionalidad de recuperación de contraseña (simulada).',
    icon: 'info',
  });
};

const aplicarFiltros = () => {
  Notify.create({
    type: 'info',
    message: 'Filtros aplicados',
    icon: 'filter_list',
  });
};

const limpiarFiltros = () => {
  estadoFilter.value = null;
  filter.value = '';
  Notify.create({
    type: 'info',
    message: 'Filtros limpiados',
    icon: 'clear',
  });
};

const exportarUsuarios = () => {
  Notify.create({
    type: 'info',
    message: 'Exportando usuarios...',
    icon: 'download',
  });
};

const getInitials = (nombre, apellido) => {
  const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : '';
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
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
  await obtenerPerfiles();
  await obtenerArea();
});
</script>
