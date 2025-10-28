<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="q-mb-lg">
      <q-card class="transparent text-white" flat>
        <q-card-section class="text-center q-py-lg">
          <div class="text-h4 q-mb-sm">
            <q-icon name="account_tree" size="md" class="q-mr-sm" />
            Administrador de Menús
          </div>
          <div class="text-subtitle1 text-grey-3">
            Gestiona la estructura de navegación del sistema
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- 🟩 Columna Izquierda: Menús Nivel 1 -->
      <div class="col-12 col-md-5">
        <q-card elevation="2" class="menu-panel">
          <q-card-section class="bg-grey-1">
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-grey-8">
                  <q-icon name="folder_open" class="q-mr-sm" />
                  Módulos Principales
                </div>
                <div class="text-caption text-grey-6">
                  {{ menusNivel1.length }} módulos configurados
                </div>
              </div>
              <div class="row q-gutter-xs">
                <q-btn
                  size="sm"
                  color="info"
                  icon="help_outline"
                  round
                  flat
                  @click="mostrarAyudaIconos"
                >
                  <q-tooltip>Ver iconos disponibles</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="primary"
                  icon="add"
                  round
                  unelevated
                  @click="abrirDialogoMenu1()"
                >
                  <q-tooltip>Agregar módulo</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
            <q-list class="menu-list">
              <q-item
                v-for="menu1 in menusNivel1"
                :key="menu1.id"
                clickable
                :class="{
                  'bg-primary text-white': menuSeleccionado?.id === menu1.id,
                  'menu-item': true,
                }"
                class="menu-item-transition"
                @click="seleccionarMenu(menu1)"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="menu1.icon || 'folder'"
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
                    {{ menu1.descripcion || "Sin descripción" }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side class="q-gutter-xs">
                  <div class="row items-center q-gutter-xs">
                    <q-toggle
                      v-model="menu1.estado"
                      @update:model-value="cambiarEstadoMenu1(menu1)"
                      :color="
                        menuSeleccionado?.id === menu1.id ? 'white' : 'positive'
                      "
                      size="sm"
                      @click.stop
                    />
                    <q-btn
                      size="xs"
                      color="grey-6"
                      icon="edit"
                      round
                      flat
                      @click.stop="editarMenu1(menu1)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      size="xs"
                      color="negative"
                      icon="delete"
                      round
                      flat
                      @click.stop="eliminarMenu1(menu1)"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- 🟦 Columna Derecha: Menús Nivel 2 -->
      <div class="col-12 col-md-7">
        <q-card elevation="2" v-if="menuSeleccionado">
          <q-card-section class="bg-grey-1">
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6 text-grey-8 row items-center">
                  <q-icon
                    :name="menuSeleccionado.icon || 'folder'"
                    class="q-mr-sm"
                    color="primary"
                  />
                  Submenús de {{ menuSeleccionado.nombre }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ menusNivel2.length }} submenús configurados
                </div>
              </div>
              <q-btn
                size="sm"
                color="primary"
                icon="add"
                round
                unelevated
                @click="abrirDialogoMenu2()"
              >
                <q-tooltip>Agregar submenú</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none" v-if="menusNivel2.length">
            <q-list class="submenu-list">
              <q-item
                v-for="menu2 in menusNivel2"
                :key="menu2.id"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="menu2.icon || 'menu'"
                    color="primary"
                    size="20px"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ menu2.nombre }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-6">
                    {{ menu2.descripcion || "Sin descripción" }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-5" v-if="menu2.ruta">
                    <q-icon name="link" size="12px" class="q-mr-xs" />
                    {{ menu2.ruta }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-toggle
                      v-model="menu2.estado"
                      @update:model-value="cambiarEstadoMenu2(menu2)"
                      color="positive"
                      size="sm"
                    />
                    <q-btn
                      size="xs"
                      color="primary"
                      icon="edit"
                      round
                      flat
                      @click="editarMenu2(menu2)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      size="xs"
                      color="negative"
                      icon="delete"
                      round
                      flat
                      @click="eliminarMenu2(menu2)"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section v-else class="text-center q-py-xl">
            <q-icon
              name="folder_open"
              size="48px"
              color="grey-4"
              class="q-mb-md"
            />
            <div class="text-h6 text-grey-5 q-mb-sm">Sin submenús</div>
            <div class="text-body2 text-grey-6 q-mb-lg">
              Este módulo no tiene submenús configurados
            </div>
            <q-btn
              color="primary"
              icon="add"
              label="Crear primer submenú"
              unelevated
              @click="abrirDialogoMenu2()"
            />
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
              Elige un módulo del panel izquierdo para gestionar sus submenús
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 🧩 Diálogo Crear / Editar Menú Nivel 1 -->
    <q-dialog v-model="dialogMenu1" persistent>
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon :name="menu1Editando ? 'edit' : 'add'" class="q-mr-sm" />
            {{
              menu1Editando
                ? "Editar Módulo Principal"
                : "Nuevo Módulo Principal"
            }}
          </div>
          <div class="text-subtitle2">
            {{
              menu1Editando
                ? "Modifica la información del módulo"
                : "Configura un nuevo módulo del sistema"
            }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formMenu1.nombre"
                label="Nombre del módulo"
                outlined
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="label" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="formMenu1.icon"
                label="Icono (Material Icons)"
                outlined
                color="primary"
                hint="ej: dashboard, settings, people"
              >
                <template v-slot:prepend>
                  <q-icon :name="formMenu1.icon || 'help_outline'" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="formMenu1.descripcion"
                label="Descripción"
                outlined
                color="primary"
                type="textarea"
                rows="2"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="formMenu1.ruta"
                label="Ruta de navegación"
                outlined
                color="primary"
                hint="ej: /dashboard, /usuarios"
              >
                <template v-slot:prepend>
                  <q-icon name="link" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            :label="menu1Editando ? 'Actualizar' : 'Crear Módulo'"
            color="primary"
            @click="guardarMenu1"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 🧩 Diálogo Crear / Editar Menú Nivel 2 -->
    <q-dialog v-model="dialogMenu2" persistent>
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon :name="menu2Editando ? 'edit' : 'add'" class="q-mr-sm" />
            {{ menu2Editando ? "Editar Submenú" : "Nuevo Submenú" }}
          </div>
          <div class="text-subtitle2">
            {{
              menu2Editando
                ? "Modifica la información del submenú"
                : `Crear submenú para ${menuSeleccionado?.nombre}`
            }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formMenu2.nombre"
                label="Nombre del submenú"
                outlined
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="label" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="formMenu2.icon"
                label="Icono (Material Icons)"
                outlined
                color="primary"
                hint="ej: list, add, search, settings"
              >
                <template v-slot:prepend>
                  <q-icon :name="formMenu2.icon || 'help_outline'" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="formMenu2.descripcion"
                label="Descripción"
                outlined
                color="primary"
                type="textarea"
                rows="2"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="formMenu2.ruta"
                label="Ruta de navegación"
                outlined
                color="primary"
                hint="ej: /usuarios/lista, /productos/crear"
              >
                <template v-slot:prepend>
                  <q-icon name="link" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            :label="menu2Editando ? 'Actualizar' : 'Crear Submenú'"
            color="primary"
            @click="guardarMenu2"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 🎨 Diálogo de Ayuda para Iconos -->
    <q-dialog v-model="dialogAyudaIconos">
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="bg-info text-white">
          <div class="text-h6">
            <q-icon name="help" class="q-mr-sm" />
            Iconos de Material Design
          </div>
          <div class="text-subtitle2">
            Encuentra el icono perfecto para tu menú
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="text-body1 q-mb-md">
            Puedes usar cualquier icono de Material Design Icons. Algunos
            ejemplos populares:
          </div>

          <div class="row q-col-gutter-sm q-mb-lg">
            <div class="col-6" v-for="icono in iconosEjemplo" :key="icono.name">
              <q-item dense class="bg-grey-1 rounded-borders">
                <q-item-section avatar>
                  <q-icon :name="icono.name" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ icono.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <q-btn
            color="primary"
            icon="open_in_new"
            label="Ver todos los iconos"
            unelevated
            class="full-width"
            @click="abrirPaginaIconos"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useQuasar, Dialog, Notify } from "quasar";
//css
import "/src/css/pages/menusPage.scss";

const $q = useQuasar();

// 🗂️ Datos reactivos
const menusNivel1 = ref([]);
const menusNivel2 = ref([]);
const menuSeleccionado = ref(null);

// Dialogos
const dialogMenu1 = ref(false);
const dialogMenu2 = ref(false);
const dialogAyudaIconos = ref(false);
const menu1Editando = ref(null);
const menu2Editando = ref(null);

// Formularios
const formMenu1 = ref({});
const formMenu2 = ref({});

// Iconos de ejemplo para la ayuda
const iconosEjemplo = ref([
  { name: "dashboard", desc: "Dashboard" },
  { name: "people", desc: "Usuarios" },
  { name: "settings", desc: "Configuración" },
  { name: "inventory", desc: "Inventario" },
  { name: "analytics", desc: "Reportes" },
  { name: "security", desc: "Seguridad" },
  { name: "payment", desc: "Pagos" },
  { name: "mail", desc: "Mensajes" },
]);

// 📦 Cargar menús
const cargarMenus1 = async () => {
  try {
    const { data } = await api.get("/menu-nivel1");

    // Forzar todos los estados a booleanos
    menusNivel1.value = data.map((menu) => ({
      ...menu,
      estado: Boolean(menu.estado),
    }));
  } catch (error) {
    $q.notify({
      message: "Error al cargar los módulos",
      color: "negative",
      icon: "error",
    });
  }
};

const seleccionarMenu = async (menu1) => {
  try {
    menuSeleccionado.value = menu1;
    const { data } = await api.get(`/menu-nivel2/bymenu1/${menu1.id}`);

    // Igual para los nivel 2
    menusNivel2.value = data.map((menu) => ({
      ...menu,
      estado: Boolean(menu.estado),
    }));
  } catch (error) {
    $q.notify({
      message: "Error al cargar los submenús",
      color: "negative",
      icon: "error",
    });
    menusNivel2.value = [];
  }
};

// 🟢 Cambiar estado (habilitar/deshabilitar)
const cambiarEstadoMenu1 = async (menu1) => {
  try {
    await api.patch(`/menu-nivel1/${menu1.id}`, { estado: menu1.estado });
    $q.notify({
      message: `Menú "${menu1.nombre}" ${
        menu1.estado ? "habilitado" : "deshabilitado"
      }`,
      color: "positive",
    });
  } catch {
    $q.notify({ message: "Error al actualizar el estado", color: "negative" });
  }
};

const cambiarEstadoMenu2 = async (menu2) => {
  try {
    await api.patch(`/menu-nivel2/${menu2.id}`, { estado: menu2.estado });
    $q.notify({
      message: `Submenú "${menu2.nombre}" ${
        menu2.estado ? "habilitado" : "deshabilitado"
      }`,
      color: "positive",
    });
  } catch {
    $q.notify({ message: "Error al actualizar el estado", color: "negative" });
  }
};

// 🧩 CRUD Nivel 1
const abrirDialogoMenu1 = () => {
  menu1Editando.value = null;
  formMenu1.value = {
    nombre: "",
    descripcion: "",
    ruta: "",
    icon: "",
    estado: true, // ← ✅ Por defecto habilitado
  };
  dialogMenu1.value = true;
};

const editarMenu1 = (menu) => {
  menu1Editando.value = menu;
  formMenu1.value = { ...menu };
  dialogMenu1.value = true;
};

const guardarMenu1 = async () => {
  if (!formMenu1.value.nombre?.trim()) {
    $q.notify({
      message: "El nombre del módulo es requerido",
      color: "warning",
      icon: "warning",
    });
    return;
  }

  try {
    const payload = { ...formMenu1.value };
    delete payload.id; // eliminar id si existe

    if (menu1Editando.value) {
      await api.patch(`/menu-nivel1/${menu1Editando.value.id}`, payload);
      $q.notify({
        message: "Módulo actualizado correctamente",
        color: "positive",
        icon: "check",
      });
    } else {
      await api.post("/menu-nivel1", payload);
      $q.notify({
        message: "Módulo creado correctamente",
        color: "positive",
        icon: "check",
      });
    }

    dialogMenu1.value = false;
    cargarMenus1();
  } catch (error) {
    $q.notify({
      message: "Error al guardar el módulo",
      color: "negative",
      icon: "error",
    });
  }
};

const eliminarMenu1 = async (menu) => {
  Dialog.create({
    title: "Confirmar eliminación",
    message: `¿Está seguro de eliminar el módulo "${menu.nombre}"? Esta acción también eliminará todos sus submenús.`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    try {
      await api.delete(`/menu-nivel1/${menu.id}`);
      cargarMenus1();
      if (menuSeleccionado.value?.id === menu.id) {
        menuSeleccionado.value = null;
        menusNivel2.value = [];
      }
      $q.notify({
        message: "Módulo eliminado correctamente",
        color: "positive",
        icon: "check",
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        message: "Error al eliminar el módulo",
        color: "negative",
        icon: "error",
      });
    }
  });
};

// 🧩 CRUD Nivel 2
const abrirDialogoMenu2 = () => {
  if (!menuSeleccionado.value) return;

  menu2Editando.value = null;
  formMenu2.value = {
    menu1Id: menuSeleccionado.value.id,
    nombre: "",
    descripcion: "",
    ruta: "",
    icon: "",
    estado: true, // ← ✅ por defecto habilitado
  };
  dialogMenu2.value = true;
};

const editarMenu2 = (menu) => {
  menu2Editando.value = menu;
  formMenu2.value = { ...menu };
  dialogMenu2.value = true;
};

const guardarMenu2 = async () => {
  // Copiamos solo los campos editables
  const payload = {
    nombre: formMenu2.value.nombre,
    descripcion: formMenu2.value.descripcion,
    ruta: formMenu2.value.ruta,
    icon: formMenu2.value.icon,
    estado: formMenu2.value.estado,
  };
  try {
    if (menu2Editando.value) {
      await api.patch(`/menu-nivel2/${menu2Editando.value.id}`, payload);
      Notify.create({
        message: "Menú Nivel 2 actualizado correctamente",
        color: "positive",
        icon: "check",
      });
    } else {
      await api.post("/menu-nivel2", {
        ...payload,
        menu1Id: menuSeleccionado.value.id, // necesario solo al crear
      });
      Notify.create({
        message: "Menú Nivel 2 creado correctamente",
        color: "positive",
        icon: "check",
      });
    }

    dialogMenu2.value = false;
    seleccionarMenu(menuSeleccionado.value);
  } catch (err) {
    console.error(err);
    Notify.create({
      message: "Error al guardar el Menú Nivel 2",
      color: "negative",
      icon: "error",
    });
  }
};

const eliminarMenu2 = async (menu) => {
  Dialog.create({
    title: "Confirmar eliminación",
    message: `¿Está seguro de eliminar el submenú "${menu.nombre}"?`,
    cancel: true,
    persistent: true,
    color: "negative",
  }).onOk(async () => {
    try {
      await api.delete(`/menu-nivel2/${menu.id}`);
      seleccionarMenu(menuSeleccionado.value);
      $q.notify({
        message: "Submenú eliminado correctamente",
        color: "positive",
        icon: "check",
      });
    } catch (err) {
      console.error(err);
      $q.notify({
        message: "Error al eliminar el submenú",
        color: "negative",
        icon: "error",
      });
    }
  });
};

// 🎨 Funciones de ayuda
const mostrarAyudaIconos = () => {
  dialogAyudaIconos.value = true;
};

const abrirPaginaIconos = () => {
  window.open(
    "https://fonts.google.com/icons?icon.set=Material+Icons",
    "_blank"
  );
};

onMounted(() => {
  cargarMenus1();
});
</script>
