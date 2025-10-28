<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="security" size="48px" class="q-mr-md" />
              Administrador de Permisos
            </h1>
            <p class="page-subtitle text-white">
              Gestiona los permisos y accesos por perfil de usuario
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Selector de perfil -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="q-mb-lg table-card" elevation="2">
          <q-card-section class="q-pb-none">
            <h3 class="table-title q-mb-sm">
              <q-icon name="person" class="q-mr-sm" />
              Selección de Perfil
            </h3>
            <div class="text-caption text-grey-6 q-mb-md">
              Elige el perfil de usuario para administrar sus permisos
            </div>
          </q-card-section>

          <q-separator class="q-mx-md" />

          <q-card-section>
            <q-select
              v-model="perfilSeleccionado"
              :options="perfiles"
              option-label="nombre"
              option-value="id"
              label="Seleccionar Perfil"
              outlined
              dense
              class="q-mb-sm"
              @update:model-value="cargarPermisos"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-if="perfilSeleccionado" class="row q-col-gutter-lg">
      <!-- Panel de navegación - Menús Nivel 1 -->
      <div class="col-12 col-md-4">
        <q-card elevation="2" class="modules-panel">
          <q-card-section class="bg-grey-1">
            <h3 class="table-title">
              <q-icon name="account_tree" class="q-mr-sm" />
              Módulos Principales
            </h3>
            <div class="text-caption text-grey-6">
              {{ permisos.length }} módulos disponibles
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
            <q-list class="modules-list">
              <q-item
                v-for="menu1 in permisos"
                :key="menu1.id"
                clickable
                @click="seleccionarMenu(menu1)"
                :class="{
                  'bg-primary text-white': menuSeleccionado?.id === menu1.id,
                  'menu-item': true,
                }"
                class="menu-item-transition"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="menu1.icono || 'folder'"
                    size="24px"
                    :color="
                      menuSeleccionado?.id === menu1.id ? 'white' : 'primary'
                    "
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ menu1.nombre }}
                  </q-item-label>
                  <q-item-label
                    caption
                    :class="
                      menuSeleccionado?.id === menu1.id
                        ? 'text-grey-3'
                        : 'text-grey-6'
                    "
                  >
                    {{ menu1.nivel2?.length || 0 }} submenús
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-toggle
                    v-model="menu1.habilitado"
                    @click.stop="togglePermiso(menu1)"
                    :color="
                      menuSeleccionado?.id === menu1.id ? 'white' : 'primary'
                    "
                    size="sm"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Panel de detalles - Menús Nivel 2 -->
      <div class="col-12 col-md-8">
        <q-card v-if="menuSeleccionado" elevation="2">
          <q-card-section class="bg-grey-1">
            <div class="row items-center justify-between">
              <div>
                <h3 class="table-title row items-center">
                  <q-icon
                    :name="menuSeleccionado.icono || 'folder'"
                    class="q-mr-sm"
                    color="primary"
                  />
                  {{ menuSeleccionado.nombre }}
                </h3>
                <div class="text-caption text-grey-6">
                  Configuración de submenús y permisos específicos
                </div>
              </div>
              <q-badge
                :color="menuSeleccionado.habilitado ? 'positive' : 'negative'"
                :label="
                  menuSeleccionado.habilitado ? 'Habilitado' : 'Deshabilitado'
                "
                class="q-px-sm"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section
            v-if="menuSeleccionado.nivel2 && menuSeleccionado.nivel2.length > 0"
          >
            <div class="row q-col-gutter-md">
              <div
                v-for="submenu in menuSeleccionado.nivel2"
                :key="submenu.id"
                class="col-12 col-sm-6 col-lg-4"
              >
                <q-card
                  flat
                  bordered
                  class="submenu-card"
                  :class="{ 'submenu-disabled': !submenu.habilitado }"
                >
                  <q-card-section class="q-pa-md">
                    <div class="row items-center justify-between q-mb-sm">
                      <div class="row items-center">
                        <q-icon
                          :name="submenu.icon || 'menu'"
                          size="20px"
                          class="q-mr-sm"
                          :color="submenu.habilitado ? 'primary' : 'grey-5'"
                        />
                        <div
                          class="text-subtitle2 text-weight-medium"
                          :class="
                            submenu.habilitado ? 'text-grey-8' : 'text-grey-5'
                          "
                        >
                          {{ submenu.nombre }}
                        </div>
                      </div>
                      <q-toggle
                        v-model="submenu.habilitado"
                        color="primary"
                        @click.stop="togglePermiso(submenu, menuSeleccionado)"
                        size="sm"
                      />
                    </div>
                    <div
                      class="text-caption"
                      :class="
                        submenu.habilitado ? 'text-grey-6' : 'text-grey-4'
                      "
                    >
                      Acceso al módulo {{ submenu.nombre.toLowerCase() }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-section v-else class="text-center q-py-xl">
            <q-icon
              name="folder_open"
              size="48px"
              color="grey-4"
              class="q-mb-md"
            />
            <div class="text-h6 text-grey-5 q-mb-sm">Sin submenús</div>
            <div class="text-body2 text-grey-6">
              Este módulo no tiene submenús configurados
            </div>
          </q-card-section>
        </q-card>

        <!-- Estado inicial -->
        <q-card v-else class="text-center q-py-xl" elevation="2">
          <q-card-section>
            <q-icon
              name="touch_app"
              size="48px"
              color="grey-4"
              class="q-mb-md"
            />
            <div class="text-h6 text-grey-5 q-mb-sm">Selecciona un módulo</div>
            <div class="text-body2 text-grey-6">
              Elige un módulo del panel izquierdo para gestionar sus permisos
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Estado sin perfil seleccionado -->
    <q-card v-else class="text-center q-py-xl" elevation="2">
      <q-card-section>
        <q-icon
          name="person_search"
          size="64px"
          color="grey-4"
          class="q-mb-md"
        />
        <div class="text-h5 text-grey-5 q-mb-sm">
          Administración de Permisos
        </div>
        <div class="text-body1 text-grey-6 q-mb-lg">
          Selecciona un perfil de usuario para comenzar a gestionar sus permisos
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
//css
import "/src/css/pages/permisosPage.scss";

const $q = useQuasar();

const perfiles = ref([]);
const perfilSeleccionado = ref(null);
const permisos = ref([]);
const menuSeleccionado = ref(null);
const cargando = ref(false);

// Computed para estadísticas
const estadisticas = computed(() => {
  if (!permisos.value.length) return null;

  const totalModulos = permisos.value.length;
  const modulosHabilitados = permisos.value.filter((m) => m.habilitado).length;
  const totalSubmenus = permisos.value.reduce(
    (acc, m) => acc + (m.nivel2?.length || 0),
    0
  );
  const submenusHabilitados = permisos.value.reduce(
    (acc, m) => acc + (m.nivel2?.filter((s) => s.habilitado).length || 0),
    0
  );

  return {
    totalModulos,
    modulosHabilitados,
    totalSubmenus,
    submenusHabilitados,
  };
});

//Cargar perfiles desde backend
const cargarPerfiles = async () => {
  try {
    cargando.value = true;
    const { data } = await api.get("/perfil");
    perfiles.value = data;

    if (data.length === 0) {
      $q.notify({
        message: "No hay perfiles disponibles",
        color: "warning",
        icon: "warning",
      });
    }
  } catch (err) {
    $q.notify({
      message: "Error al cargar perfiles",
      color: "negative",
      icon: "error",
    });
    console.error(err);
  } finally {
    cargando.value = false;
  }
};

//Cargar permisos según perfil seleccionado
const cargarPermisos = async () => {
  if (!perfilSeleccionado.value) {
    permisos.value = [];
    menuSeleccionado.value = null;
    return;
  }

  try {
    cargando.value = true;
    const { data } = await api.get(
      `/permisos/perfil/${perfilSeleccionado.value.id}`
    );
    permisos.value = data;
    menuSeleccionado.value = null;

    $q.notify({
      message: `Permisos cargados para ${perfilSeleccionado.value.nombre}`,
      color: "positive",
      icon: "check_circle",
    });
  } catch (err) {
    $q.notify({
      message: "Error al cargar permisos",
      color: "negative",
      icon: "error",
    });
    console.error(err);
    permisos.value = [];
  } finally {
    cargando.value = false;
  }
};

//Seleccionar un menú nivel 1
const seleccionarMenu = (menu) => {
  menuSeleccionado.value = menu;
};

//Cambiar estado de un permiso (nivel 1 o nivel 2)
const togglePermiso = async (permiso, parent = null) => {
  const estadoAnterior = permiso.habilitado;

  try {
    await api.patch(`/permisos/${permiso.idPermiso}`, {
      habilitado: permiso.habilitado,
    });

    const accion = permiso.habilitado ? "habilitado" : "deshabilitado";
    const tipoPermiso = parent ? "submenú" : "módulo";

    $q.notify({
      message: `${tipoPermiso} "${permiso.nombre}" ${accion} correctamente`,
      color: "positive",
      icon: permiso.habilitado ? "check_circle" : "block",
      position: "top-right",
    });

    // Si es un módulo principal y se deshabilita, deshabilitar todos sus submenús
    if (!parent && !permiso.habilitado && permiso.nivel2) {
      permiso.nivel2.forEach((submenu) => {
        if (submenu.habilitado) {
          submenu.habilitado = false;
          // Aquí podrías hacer llamadas individuales a la API si es necesario
        }
      });
    }
  } catch (err) {
    // Revertir el cambio si falla
    permiso.habilitado = estadoAnterior;

    $q.notify({
      message: "Error al actualizar el permiso",
      color: "negative",
      icon: "error",
      position: "top-right",
    });
    console.error(err);
  }
};

onMounted(() => {
  cargarPerfiles();
});
</script>
