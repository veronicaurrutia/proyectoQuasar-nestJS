<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- 🟩 Columna Izquierda: Menús Nivel 1 -->
      <div class="col-4">
        <q-card class="q-pa-md">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-primary">Menús Nivel 1</div>
            <div class="text-p text-primary">
              <a
                href="https://fonts.google.com/icons?icon.set=Material+Icons"
                target="_blank"
                class="text-primary"
                style="text-decoration: none"
              >
                https://fonts.google.com/icons?icon.set=Material+Icons
              </a>
              &nbsp;para agregar íconos
            </div>
            <q-btn
              dense
              flat
              icon="add"
              color="primary"
              @click="abrirDialogoMenu1()"
            />
          </q-card-section>

          <q-separator />

          <q-list bordered>
            <q-item
              v-for="menu1 in menusNivel1"
              :key="menu1.id"
              clickable
              :active="menuSeleccionado?.id === menu1.id"
              active-class="bg-blue-1 text-primary"
              @click="seleccionarMenu(menu1)"
            >
              <q-item-section avatar>
                <q-icon :name="menu1.icon || 'folder'" color="primary" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ menu1.nombre }}</q-item-label>
                <q-item-label caption>{{ menu1.descripcion }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-toggle
                  v-model="menu1.estado"
                  @update:model-value="cambiarEstadoMenu1(menu1)"
                  color="green"
                  keep-color
                />
              </q-item-section>

              <q-item-section side>
                <q-btn
                  dense
                  flat
                  icon="edit"
                  color="primary"
                  @click.stop="editarMenu1(menu1)"
                />
                <q-btn
                  dense
                  flat
                  icon="delete"
                  color="negative"
                  @click.stop="eliminarMenu1(menu1)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- 🟦 Columna Derecha: Menús Nivel 2 -->
      <div class="col-8">
        <q-card class="q-pa-md">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-primary">
              Menús Nivel 2
              <span v-if="menuSeleccionado"
                >de {{ menuSeleccionado.nombre }}</span
              >
            </div>
            <q-btn
              dense
              flat
              icon="add"
              color="primary"
              :disable="!menuSeleccionado"
              @click="abrirDialogoMenu2()"
            />
          </q-card-section>

          <q-separator />

          <q-list bordered v-if="menusNivel2.length">
            <q-item v-for="menu2 in menusNivel2" :key="menu2.id">
              <q-item-section avatar>
                <q-icon :name="menu2.icon || 'menu'" color="primary" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ menu2.nombre }}</q-item-label>
                <q-item-label caption>{{ menu2.descripcion }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-toggle
                  v-model="menu2.estado"
                  @update:model-value="cambiarEstadoMenu2(menu2)"
                  color="green"
                  keep-color
                />
              </q-item-section>

              <q-item-section side>
                <q-btn
                  dense
                  flat
                  icon="edit"
                  color="primary"
                  @click="editarMenu2(menu2)"
                />
                <q-btn
                  dense
                  flat
                  icon="delete"
                  color="negative"
                  @click="eliminarMenu2(menu2)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else class="text-center text-grey q-mt-md">
            <q-icon name="info" />
            <div>Selecciona un menú de nivel 1 para ver o crear submenús.</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- 🧩 Diálogo Crear / Editar Menú Nivel 1 -->
    <q-dialog v-model="dialogMenu1">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">
          {{ menu1Editando ? "Editar Menú Nivel 1" : "Nuevo Menú Nivel 1" }}
        </q-card-section>
        <q-card-section>
          <q-input v-model="formMenu1.nombre" label="Nombre" outlined dense />
          <q-input
            v-model="formMenu1.descripcion"
            label="Descripción"
            outlined
            dense
          />
          <q-input v-model="formMenu1.ruta" label="Ruta" outlined dense />
          <q-input v-model="formMenu1.icon" label="Ícono" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar" @click="guardarMenu1" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 🧩 Diálogo Crear / Editar Menú Nivel 2 -->
    <q-dialog v-model="dialogMenu2">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">
          {{ menu2Editando ? "Editar Menú Nivel 2" : "Nuevo Menú Nivel 2" }}
        </q-card-section>
        <q-card-section>
          <q-input v-model="formMenu2.nombre" label="Nombre" outlined dense />
          <q-input
            v-model="formMenu2.descripcion"
            label="Descripción"
            outlined
            dense
          />
          <q-input v-model="formMenu2.ruta" label="Ruta" outlined dense />
          <q-input v-model="formMenu2.icon" label="Ícono" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar" @click="guardarMenu2" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useQuasar, Dialog, Notify } from "quasar";

const $q = useQuasar();

// 🗂️ Datos reactivos
const menusNivel1 = ref([]);
const menusNivel2 = ref([]);
const menuSeleccionado = ref(null);

// Dialogos
const dialogMenu1 = ref(false);
const dialogMenu2 = ref(false);
const menu1Editando = ref(null);
const menu2Editando = ref(null);

// Formularios
const formMenu1 = ref({});
const formMenu2 = ref({});

// 📦 Cargar menús
const cargarMenus1 = async () => {
  const { data } = await api.get("/menu-nivel1");

  // Forzar todos los estados a booleanos
  menusNivel1.value = data.map((menu) => ({
    ...menu,
    estado: Boolean(menu.estado),
  }));

  console.log(menusNivel1.value, "los menu");
};

const seleccionarMenu = async (menu1) => {
  menuSeleccionado.value = menu1;

  const { data } = await api.get(`/menu-nivel2/bymenu1/${menu1.id}`);

  // Igual para los nivel 2
  menusNivel2.value = data.map((menu) => ({
    ...menu,
    estado: Boolean(menu.estado),
  }));
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
  const payload = { ...formMenu1.value };
  delete payload.id; // eliminar id si existe

  if (menu1Editando.value) {
    await api.patch(`/menu-nivel1/${menu1Editando.value.id}`, payload);
  } else {
    await api.post("/menu-nivel1", payload);
  }

  dialogMenu1.value = false;
  cargarMenus1();
};

const eliminarMenu1 = async (menu) => {
  const confirmar = window.confirm(`¿Eliminar el menú ${menu.nombre}?`);
  if (!confirmar) return;

  try {
    await api.delete(`/menu-nivel1/${menu.id}`);
    cargarMenus1();
    $q.notify({ message: "Menú eliminado", color: "positive", icon: "check" });
  } catch (err) {
    console.error(err);
    $q.notify({
      message: "Error eliminando el menú",
      color: "negative",
      icon: "error",
    });
  }
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
  const confirmar = window.confirm(`¿Eliminar el submenú ${menu.nombre}?`);
  if (!confirmar) return;

  try {
    await api.delete(`/menu-nivel2/${menu.id}`);
    seleccionarMenu(menuSeleccionado.value);
    $q.notify({
      message: "Submenú eliminado",
      color: "positive",
      icon: "check",
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      message: "Error eliminando el submenú",
      color: "negative",
      icon: "error",
    });
  }
};

onMounted(() => {
  cargarMenus1();
});
</script>
