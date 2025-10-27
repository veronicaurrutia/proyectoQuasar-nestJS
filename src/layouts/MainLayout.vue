<template>
  <q-layout view="lHh Lpr lFf" class="custom-background">
    <q-header class="modern-header" elevated>
      <q-toolbar class="header-toolbar">
        <!-- Logo y botón menú -->
        <div class="header-left">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            class="menu-btn"
          />
          <div class="header-logo">
            <img
              src="src/assets/loginsa.png"
              alt="Logo"
              class="header-logo-img"
            />
            <span class="header-title">Central de Requerimientos</span>
          </div>
        </div>

        <!-- Controles centrales -->
        <div class="header-center">
          <q-select
            class="area-selector"
            dark
            dense
            outlined
            v-model="area"
            :options="areaOptions"
            label="Área Actual"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            readonly
            :display-value="areaDisplayText"
          >
            <template v-slot:prepend>
              <q-icon name="business" />
            </template>
            <template v-slot:selected>
              <span class="current-area-text">
                {{ areaDisplayText }}
              </span>
            </template>
          </q-select>
          <q-btn
            class="change-area-btn"
            unelevated
            dense
            label="Cambiar Área"
            color="white"
            text-color="primary"
            @click="cambioArea"
            icon="swap_horiz"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="handleDrawerMouseOver"
      @mouseout="handleDrawerMouseOut"
      bordered
      class="modern-drawer"
      :width="280"
      :mini-width="70"
    >
      <div class="drawer-content">
        <!-- Header del drawer -->
        <div class="drawer-header">
          <div class="company-info">
            <img src="src/assets/loginsa.png" alt="Logo" class="drawer-logo" />
            <div class="company-details" v-if="!miniState">
              <div class="company-name">Loginsa</div>
              <div class="department-name">Tecnologías de la Información</div>
            </div>
          </div>
        </div>

        <q-separator class="drawer-separator" />

        <!-- Información del usuario -->
        <div
          class="user-section"
          v-if="!miniState"
          @mouseenter="handleUserSectionMouseEnter"
          @mouseleave="handleUserSectionMouseLeave"
        >
          <div class="user-card">
            <q-avatar size="48px" class="user-main-avatar">
              <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
              <q-icon v-else name="person" color="white" size="24px" />
            </q-avatar>
            <div class="user-main-info">
              <div class="user-main-name">
                {{ user.nombre || "Sin nombre" }}
                <span v-if="user.apellido"> {{ user.apellido }}</span>
              </div>
              <div class="user-main-email">
                {{ user.email || "Sin correo" }}
              </div>
              <div class="user-status"></div>
            </div>
          </div>
        </div>

        <q-separator class="drawer-separator" v-if="!miniState" />

        <!-- Menú de navegación -->
        <q-scroll-area
          class="menu-scroll-area"
          :horizontal-thumb-style="{ opacity: 0 }"
        >
          <div class="menu-container">
            <template
              v-for="menuItem in menu"
              :key="menuItem.id || menuItem.nombre"
            >
              <!-- Menús con submenús -->
              <div
                v-if="menuItem.nivel2 && menuItem.nivel2.length > 0"
                class="menu-group"
              >
                <q-expansion-item
                  expand-icon-class="text-primary expansion-icon"
                  expand-separator
                  :icon="menuItem.icono"
                  :label="menuItem.nombre"
                  class="main-menu-item"
                  header-class="menu-header"
                >
                  <div class="submenu-container">
                    <q-item
                      v-for="submenu in menuItem.nivel2"
                      :key="submenu.id || submenu.nombre"
                      dense
                      @click="router.push(submenu.ruta)"
                      clickable
                      v-ripple
                      active-class="submenu-active"
                      class="submenu-item"
                    >
                      <q-item-section avatar>
                        <q-icon :name="submenu.icon" size="18px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="submenu-label">{{
                          submenu.nombre
                        }}</q-item-label>
                        <q-item-label caption class="submenu-caption">
                          {{ submenu.caption }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-expansion-item>
              </div>

              <!-- Menús simples -->
              <div v-else-if="menuItem.active" class="menu-group">
                <q-item
                  clickable
                  v-ripple
                  active-class="menu-active"
                  class="main-menu-item simple-menu"
                  @click="navigateToMenu(menuItem)"
                >
                  <q-item-section avatar>
                    <q-icon
                      :name="menuItem.icon || menuItem.icono"
                      size="20px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="menu-label">{{
                      menuItem.nombre
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </template>
          </div>
        </q-scroll-area>

        <!-- Footer del drawer -->
        <div class="drawer-footer">
          <q-separator class="drawer-separator" />

          <q-item
            clickable
            @click="router.push('/perfil')"
            v-ripple
            active-class="footer-active"
            class="footer-item"
          >
            <q-item-section avatar>
              <q-icon name="person" size="20px" />
            </q-item-section>
            <q-item-section v-if="!miniState">
              <q-item-label>Mi Perfil</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            @click="logout()"
            v-ripple
            class="footer-item logout-item"
          >
            <q-item-section avatar>
              <q-icon name="logout" color="negative" size="20px" />
            </q-item-section>
            <q-item-section v-if="!miniState">
              <q-item-label class="logout-label">Cerrar Sesión</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
import { api } from "src/boot/axios";

// Stores y Router
const usuarioStore = useUsuariostore();
const router = useRouter();

// Estado reactivo
const usuario = ref(null);
const perfilArea = ref(null);
const area = ref(null);
const empresa = ref(usuarioStore.empresa);
const url = ref("");
const miniState = ref(true);
const leftDrawerOpen = ref(false);
const empresas = ref(null);
const areaOptions = ref([]); // se llenará con la data del endpoint
const perfilOptions = ref([]);
const perfil = ref(null);
const menu = ref([]);
const user = ref({
  nombre: "",
  apellido: "",
  avatar: null,
  area: "",
  email: "",
});

// Computed properties
const currentAreaName = computed(() => {
  if (!area.value || !areaOptions.value.length) {
    return "Seleccionar Área";
  }

  const currentArea = areaOptions.value.find((a) => a.value === area.value);
  return currentArea ? currentArea.label : "Área no encontrada";
});

const areaDisplayText = computed(() => {
  return currentAreaName.value === "Seleccionar Área"
    ? "Seleccionar Área"
    : `📍 ${currentAreaName.value}`;
});

// Funciones mejoradas
function navigateToMenu(menuItem) {
  if (menuItem.ruta) {
    router.push(menuItem.ruta);
  } else if (menuItem.url) {
    router.push(menuItem.url);
  }
}
async function usuarioVista(id) {
  // Chequeo y log del id recibido
  let userId = id;
  if (!userId) {
    // Intentar obtener el id desde el store o localStorage
    userId = usuarioStore.usuario;
    if (typeof userId === "object" && userId !== null && userId.id) {
      userId = userId.id;
    }
    if (!userId) {
      userId = localStorage.getItem("usuarioId");
    }
  }
  console.log("ID usado para cargar usuario:", userId);
  if (!userId) {
    if (Notify && typeof Notify.create === "function") {
      Notify.create({
        type: "negative",
        message: "No se encontró el ID del usuario.",
      });
    } else {
      alert("No se encontró el ID del usuario.");
    }
    return;
  }
  try {
    const response = await api.get(`/usuario/${userId}`);
    const u = response.data;
    user.value = {
      nombre: u.nombre || "Sin nombre",
      apellido: u.apellido || "",
      email: u.email || "Sin correo",
      avatar: u.avatar || null,
      birthdate: u.fechaNacimiento || u.birthdate || "",
      phone: u.telefono || u.phone || "",
      address: u.direccion || u.address || "",
      area: u.area || "",
    };
  } catch (error) {
    if (Notify && typeof Notify.create === "function") {
      Notify.create({
        type: "negative",
        message: "Error al cargar datos del usuario.",
      });
    } else {
      alert("Error al cargar datos del usuario.");
    }
  }
}

// Menu
// const menu = ref([
//   {
//     menu: "Administración",
//     icon: "admin_panel_settings",
//     url: "Administración",
//     active: true,
//     submenu: [
//       {
//         icon: "account_circle",
//         menu: "Cuentas",
//         caption: "Mantenedor",
//         url: "cuentas",
//         active: false,
//       },
//       {
//         icon: "domain",
//         menu: "Empresas",
//         caption: "Mantenedor",
//         url: "empresas",
//         active: false,
//       },
//       {
//         icon: "badge",
//         menu: "Areas",
//         caption: "Mantenedor",
//         url: "areas",
//         active: false,
//       },
//       {
//         icon: "group",
//         menu: "Usuarios",
//         caption: "Mantenedor",
//         url: "usuarios",
//         active: true,
//       },
//       {
//         icon: "warehouse",
//         menu: "Centros",
//         caption: "Mantenedor",
//         url: "centros",
//         active: true,
//       },
//       {
//         icon: "change_circle",
//         menu: "Categorias",
//         caption: "Mantenedor",
//         url: "categorias",
//         active: true,
//       },
//       {
//         icon: "change_circle",
//         menu: "Estados",
//         caption: "Mantenedor",
//         url: "estados",
//         active: true,
//       },
//     ],
//   },
//   {
//     menu: "Dashboard",
//     icon: "dashboard",
//     url: "dashboard",
//     active: true,
//   },
//   {
//     menu: "Requerimientos",
//     icon: "description",
//     url: "requerimientos en proceso",
//     active: true,
//     submenu: [
//       {
//         menu: "Nueva solicitud",
//         caption: "Requerimientos",
//         icon: "add_circle",
//         url: "nueva solicitud",
//       },
//       {
//         menu: "Solicitudes en proceso",
//         caption: "Requerimientos",
//         url: "roles",
//         icon: "fast_forward",
//         active: false,
//       },
//       {
//         menu: "Solicitudes finalizados",
//         caption: "Requerimientos",
//         icon: "check",
//         url: "requerimientos finalizados",
//       },
//       {
//         menu: "Tickets asignados",
//         caption: "Requerimientos",
//         icon: "supervisor_account",
//         url: "requerimientos asignados",
//       },
//       {
//         menu: "Gestionar tickets",
//         caption: "Requerimientos",
//         icon: "engineering",
//         url: "gestionar requerimientos",
//       },
//     ],
//   },
// ]);

// Watchers
watch(
  () => usuarioStore.area,
  (newArea, oldArea) => {
    console.log("👀 Area cambió en store:", { old: oldArea, new: newArea });
    if (newArea && areaOptions.value.length > 0) {
      const existe = areaOptions.value.find((a) => a.value === newArea);
      if (existe && area.value !== newArea) {
        area.value = newArea;
        console.log("✅ Área sincronizada desde store:", existe.label);
      }
    }
  },
  { immediate: true }
);

watch(area, (newValue, oldValue) => {
  console.log("👀 Area cambió en componente:", {
    old: oldValue,
    new: newValue,
  });
  if (newValue && newValue !== usuarioStore.area) {
    usuarioStore.setArea(newValue);
    obtenerPerfilAreaUsuario();
    console.log("✅ Store actualizado con nueva área");
  }
});

watch(
  areaOptions,
  (newOptions) => {
    console.log("👀 Opciones de área actualizadas:", newOptions);
    if (newOptions.length > 0 && !area.value) {
      actualizarAreaActual();
    }
  },
  { deep: true }
);

// watch(empresa, (newValue) => {
//   usuarioStore.setEmpresa(newValue);
// });
// watch(area, (newValue) => {
//   usuarioStore.setArea(newValue);
//   obtenerPerfilAreaUsuario();
// });
// watch(perfil, (newValue) => {
//   usuarioStore.setPerfil(newValue);
// });

// Variables para control del drawer
const isUserInteracting = ref(false);
const drawerTimeout = ref(null);

// Métodos
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function handleDrawerMouseOver() {
  // Cancelar cualquier timeout pendiente
  if (drawerTimeout.value) {
    clearTimeout(drawerTimeout.value);
    drawerTimeout.value = null;
  }
  miniState.value = false;
}

function handleDrawerMouseOut(event) {
  // Solo minimizar si no estamos interactuando con la sección de usuario
  if (!isUserInteracting.value) {
    // Agregar un pequeño delay para evitar parpadeos
    drawerTimeout.value = setTimeout(() => {
      if (!isUserInteracting.value) {
        miniState.value = true;
      }
    }, 100);
  }
}

function handleUserSectionMouseEnter() {
  isUserInteracting.value = true;
  // Cancelar cualquier timeout de cierre
  if (drawerTimeout.value) {
    clearTimeout(drawerTimeout.value);
    drawerTimeout.value = null;
  }
}

function handleUserSectionMouseLeave() {
  isUserInteracting.value = false;
  // Iniciar el timeout para cerrar después de un breve delay
  drawerTimeout.value = setTimeout(() => {
    if (!isUserInteracting.value) {
      miniState.value = true;
    }
  }, 300); // 300ms de delay
}

function logout() {
  usuarioStore.logout();
  Notify.create({
    message: "Hasta luego.",
    icon: "waving_hand",
    color: "positive",
  });
  router.push("/login");
}

function obtenerEmpresas() {
  // empresas.value = JSON.parse(localStorage.getItem('empresas')) || [];
  // empresa.value = empresas.value[0]?.value;
}
async function obtenerAreasUsuario() {
  try {
    console.log("Obteniendo áreas para usuario:", usuarioStore.usuario);
    const response = await api.get(`/area/usuario/${usuarioStore.usuario}`);
    areaOptions.value = response.data.map((a) => ({
      label: a.nombre,
      value: a.id,
    }));

    console.log("Áreas obtenidas:", areaOptions.value);
    console.log("Área actual en store:", usuarioStore.area);

    // Priorizar el área del store si existe
    if (usuarioStore.area) {
      const existe = areaOptions.value.find(
        (a) => a.value === usuarioStore.area
      );
      if (existe) {
        area.value = usuarioStore.area;
        console.log("✅ Área cargada desde store:", existe.label);
        return;
      } else {
        console.log("⚠️ Área del store no encontrada en opciones disponibles");
      }
    }

    // Si no hay área en el store pero hay opciones, usar la primera
    if (areaOptions.value.length > 0) {
      area.value = areaOptions.value[0].value;
      usuarioStore.setArea(area.value);
      console.log(
        "✅ Área predeterminada asignada:",
        areaOptions.value[0].label
      );
    } else {
      console.log("❌ No hay áreas disponibles para el usuario");
    }
  } catch (error) {
    console.error("❌ Error al obtener las Areas:", error);
    Notify.create({
      type: "negative",
      message: "Error al cargar las áreas del usuario",
    });
  }
}

async function obtenerPerfiles() {
  try {
    const response = await api.get("/perfil");
    perfilOptions.value = response.data.map((a) => ({
      label: a.nombre,
      value: a.id,
    }));
  } catch (error) {
    console.error("error al obtener los perfiles", error);
  }
}

async function obtenerPerfilAreaUsuario() {
  try {
    const response = await api.get(
      `/usuario/${usuarioStore.usuario}/perfil-en-area/${usuarioStore.area}`
    );
    perfil.value = response.data;
    obtenerMenuPerfil();
  } catch (error) {
    console.error("error al obtener los datos", error);
  }
}

async function obtenerMenuPerfil() {
  try {
    console.log(usuarioStore.perfil, "el perfil en la funcion");
    const response = await api.get(
      `/permisos/perfilactivo/${usuarioStore.perfil}`
    );
    console.log(response.data, "los permisos", usuarioStore.perfil);
    menu.value = response.data;
    usuario.value = response.data.id;
    area.value = response.data.areaId;
    perfilArea.value = response.data.perfilesPorArea;
  } catch (error) {
    console.error("error al obtener los datos", error);
  }
}

const cambioArea = () => {
  router.push("/select-area");
};

// Función para forzar actualización del área
function actualizarAreaActual() {
  if (usuarioStore.area && areaOptions.value.length > 0) {
    const existe = areaOptions.value.find((a) => a.value === usuarioStore.area);
    if (existe) {
      area.value = usuarioStore.area;
      console.log("🔄 Área actualizada:", existe.label);
    }
  }
}

// Funciones que quieres ejecutar al cargar la página
onMounted(async () => {
  console.log("🚀 Montando MainLayout...");
  await obtenerAreasUsuario();
  obtenerPerfiles();
  await usuarioVista();
  obtenerMenuPerfil();

  // Actualizar área después de cargar todo
  setTimeout(() => {
    actualizarAreaActual();
  }, 500);
});

// Limpiar timeouts al desmontar el componente
onUnmounted(() => {
  if (drawerTimeout.value) {
    clearTimeout(drawerTimeout.value);
  }
});
</script>

<style lang="scss" scoped>
// ==============================================
// LAYOUT MODERNO - HEADER
// ==============================================

.modern-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.header-toolbar {
  padding: 0 16px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  color: white;
  margin-right: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
}

.header-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.area-selector {
  min-width: 200px;

  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  :deep(.q-field__native) {
    color: white;
  }

  :deep(.q-field__label) {
    color: rgba(255, 255, 255, 0.8);
  }

  :deep(.q-field__append) {
    color: rgba(255, 255, 255, 0.8);
  }
}

.current-area-text {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.change-area-btn {
  font-weight: 500;
  border-radius: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
}

.modern-drawer {
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.company-details {
  flex: 1;
}

.company-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1976d2;
  line-height: 1.2;
}

.department-name {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.2;
}

.drawer-separator {
  margin: 0;
  background: #e9ecef;
}

.user-section {
  padding: 16px;
  background: white;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.user-main-avatar {
  border: 2px solid #1976d2;
  background: #1976d2;
}

.user-main-info {
  flex: 1;
}

.user-main-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
  line-height: 1.2;
  margin-bottom: 2px;
}

.user-main-email {
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1.2;
  margin-bottom: 6px;
}

.user-status {
  display: flex;
  align-items: center;
}

.menu-scroll-area {
  flex: 1;
}

.menu-container {
  padding: 8px 0;
}

.menu-group {
  margin-bottom: 4px;
}

.main-menu-item {
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
  }

  &.simple-menu {
    color: #2c3e50;
  }

  :deep(.q-item__section--avatar) {
    color: #1976d2;
    min-width: 40px;
  }
}

.menu-header {
  color: #2c3e50;
  font-weight: 600;

  &:hover {
    background: rgba(25, 118, 210, 0.05);
  }
}

.menu-label {
  font-weight: 500;
  color: #2c3e50;
}

.menu-active {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;

  :deep(.q-item__section--avatar) {
    color: white;
  }

  .menu-label {
    color: white;
  }
}

.expansion-icon {
  color: #1976d2;
}

.submenu-container {
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.submenu-item {
  margin: 0 16px 0 32px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.08);
  }

  :deep(.q-item__section--avatar) {
    color: #6c757d;
    min-width: 32px;
  }
}

.submenu-label {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.submenu-caption {
  font-size: 0.75rem;
  color: #6c757d;
}

.submenu-active {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 3px solid #1976d2;

  .submenu-label {
    color: #1976d2;
    font-weight: 600;
  }

  :deep(.q-item__section--avatar) {
    color: #1976d2;
  }
}

.drawer-footer {
  margin-top: auto;
  padding: 8px;
  background: white;
}

.footer-item {
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(25, 118, 210, 0.1);
  }

  :deep(.q-item__section--avatar) {
    color: #6c757d;
    min-width: 40px;
  }
}

.footer-active {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;

  :deep(.q-item__section--avatar) {
    color: #1976d2;
  }
}

.logout-item {
  &:hover {
    background: rgba(244, 67, 54, 0.1);
  }

  :deep(.q-item__section--avatar) {
    color: #f44336;
  }
}

.logout-label {
  color: #f44336;
  font-weight: 500;
}

// ==============================================
// RESPONSIVE DESIGN
// ==============================================

@media (max-width: 1023px) {
  .header-center {
    display: none;
  }

  .header-title {
    display: none;
  }

  .company-details {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-toolbar {
    padding: 0 8px;
  }

  .header-left {
    gap: 8px;
  }

  .header-logo-img {
    width: 32px;
    height: 32px;
  }

  .drawer-header {
    padding: 12px;
  }

  .user-section {
    padding: 12px;
  }

  .modern-drawer {
    :deep(.q-drawer) {
      width: 260px !important;
    }
  }
}

@media (max-width: 480px) {
  .modern-drawer {
    :deep(.q-drawer) {
      width: 260px !important;
    }
  }
}

// ==============================================
// ANIMACIONES Y TRANSICIONES
// ==============================================

.modern-drawer {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.menu-container {
  :deep(.q-expansion-item) {
    transition: all 0.2s ease;
  }

  :deep(.q-expansion-item__content) {
    transition: all 0.3s ease;
  }
}

// Animación de entrada para elementos del menú
.main-menu-item,
.submenu-item,
.footer-item {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// ==============================================
// TEMA PERSONALIZADO
// ==============================================

:deep(.q-list) {
  padding: 0;
}

:deep(.q-item) {
  min-height: 44px;
}

:deep(.q-expansion-item__header) {
  min-height: 48px;
  padding: 8px 16px;
}

:deep(.q-btn-dropdown .q-btn-dropdown__arrow) {
  color: rgba(255, 255, 255, 0.8);
}

// Estados de hover globales
.header-toolbar :deep(.q-btn:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

// Scrollbar personalizado
:deep(.q-scrollarea__thumb) {
  background: rgba(25, 118, 210, 0.3);
  border-radius: 4px;

  &:hover {
    background: rgba(25, 118, 210, 0.5);
  }
}
</style>
