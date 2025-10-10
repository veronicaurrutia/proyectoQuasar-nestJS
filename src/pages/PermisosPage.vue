<template>
  <q-page class="q-pa-md">
    <!-- Título -->
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="badge" /> Mantenedor de Permisos
        </h5>
      </q-card-section>
    </div>

    <!-- Selector de perfil -->
    <q-card class="q-pa-md q-mb-md" bordered>
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
    </q-card>

    <!-- Contenido principal -->
    <div v-if="perfilSeleccionado" class="row q-col-gutter-md">
      <!-- Menús Nivel 1 -->
      <div class="col-3">
        <q-card
          v-for="menu1 in permisos"
          :key="menu1.id"
          class="q-mb-sm cursor-pointer"
          @click="seleccionarMenu(menu1)"
          :class="{ 'bg-grey-2': menuSeleccionado?.id === menu1.id }"
        >
          <q-card-section class="row items-center justify-between">
            <div class="row items-center">
              <q-icon
                :name="menu1.icono || 'folder'"
                size="24px"
                class="q-mr-sm"
              />
              <div class="text-subtitle2">{{ menu1.nombre }}</div>
            </div>
            <q-toggle
              v-model="menu1.habilitado"
              @click.stop="togglePermiso(menu1)"
              color="primary"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Menús Nivel 2 -->
      <div class="col">
        <q-card v-if="menuSeleccionado">
          <q-card-section>
            <div class="text-h6 row items-center">
              <q-icon
                :name="menuSeleccionado.icono || 'folder'"
                class="q-mr-sm"
              />
              {{ menuSeleccionado.nombre }}
            </div>
            <div class="text-caption text-grey">Submenús disponibles</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div
                v-for="submenu in menuSeleccionado.nivel2"
                :key="submenu.id"
                class="col-6 col-md-4"
              >
                <q-card flat bordered class="q-pa-sm">
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-icon
                        :name="submenu.icon || 'menu'"
                        size="22px"
                        class="q-mr-sm"
                      />
                      <div>{{ submenu.nombre }}</div>
                    </div>
                    <q-toggle
                      v-model="submenu.habilitado"
                      color="primary"
                      @click.stop="togglePermiso(submenu, menuSeleccionado)"
                    />
                  </div>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div v-else class="text-white text-center q-mt-xl">
          <q-icon name="arrow_back" size="40px" class="q-mb-sm" />
          <div>Selecciona un menú de la izquierda</div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-grey q-mt-lg">
      <q-icon name="person_search" size="40px" class="q-mb-sm" />
      <div>Selecciona un perfil para administrar permisos</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const perfiles = ref([]);
const perfilSeleccionado = ref(null);
const permisos = ref([]);
const menuSeleccionado = ref(null);

//Cargar perfiles desde backend
const cargarPerfiles = async () => {
  try {
    const { data } = await api.get("/perfil");
    perfiles.value = data;
  } catch (err) {
    $q.notify({ message: "Error al cargar perfiles", color: "negative" });
    console.error(err);
  }
};

//Cargar permisos según perfil seleccionado
const cargarPermisos = async () => {
  if (!perfilSeleccionado.value) return;
  try {
    const { data } = await api.get(
      `/permisos/perfil/${perfilSeleccionado.value.id}`
    );
    permisos.value = data;
    menuSeleccionado.value = null;
  } catch (err) {
    $q.notify({ message: "Error al cargar permisos", color: "negative" });
    console.error(err);
  }
};

//Seleccionar un menú nivel 1
const seleccionarMenu = (menu) => {
  menuSeleccionado.value = menu;
};

//Cambiar estado de un permiso (nivel 1 o nivel 2)
const togglePermiso = async (permiso, parent = null) => {
  try {
    await api.patch(`/permisos/${permiso.idPermiso}`, {
      habilitado: permiso.habilitado,
    });
    $q.notify({
      message: `${permiso.nombre} ${
        permiso.habilitado ? "habilitado" : "deshabilitado"
      }`,
      color: "positive",
      icon: "check",
    });
  } catch (err) {
    permiso.habilitado = !permiso.habilitado; // revertir si falla
    $q.notify({
      message: "Error al actualizar el permiso",
      color: "negative",
      icon: "error",
    });
    console.error(err);
  }
};

onMounted(() => {
  cargarPerfiles();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
