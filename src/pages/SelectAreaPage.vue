<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <div
      class="q-pa-md flex flex-center column bg-white rounded-xl shadow-md"
      style="max-width: 400px; margin: auto"
    >
      <!-- Logo de la empresa -->
      <div class="q-mb-md flex flex-center">
        <q-avatar size="100px" rounded>
          <img
            :src="'https://cdn.quasar.dev/logo-v2/svg/logo.svg'"
            alt="Logo empresa"
          />
        </q-avatar>
      </div>

      <!-- Nombre empresa -->
      <div class="text-h6 text-primary q-mb-md text-center">
        EL NOMBRE DE LA EMPRESA
      </div>

      <!-- Selector de área -->
      <q-select
        filled
        v-model="areaSeleccionada"
        :options="areas"
        option-label="nombre"
        option-value="id"
        label="Selecciona un área"
        emit-value
        map-options
        :loading="cargando"
        class="q-mb-md"
      />

      <!-- Botón confirmar -->
      <q-btn
        label="Ingresar"
        color="primary"
        :disable="!areaSeleccionada"
        @click="confirmarArea"
        class="full-width"
      />
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";
import { useRouter } from "vue-router";

const $q = useQuasar();
const usuarioStore = useUsuariostore();

const router = useRouter();
const areas = ref([]);
const cargando = ref(false);
const areaSeleccionada = ref(null);
const perfil = ref(null);

const cargarAreas = async () => {
  try {
    cargando.value = true;
    const { data } = await api.get(`/area/usuario/${usuarioStore.usuario}`);
    areas.value = data;
    areaSeleccionada.value = areas.value[0].id;
  } catch (error) {
    console.error("Error al cargar áreas:", error);
    $q.notify({
      type: "negative",
      message: "No se pudieron cargar las áreas",
    });
  } finally {
    cargando.value = false;
  }
};

const confirmarArea = () => {
  $q.notify({
    type: "positive",
    message: `Área seleccionada: ${
      areas.value.find((a) => a.id === areaSeleccionada.value)?.nombre
    }`,
  });
  usuarioStore.area = areaSeleccionada.value;
  // Puedes redirigir o emitir un evento
  console.log(areaSeleccionada.value, "el area seleccionada");
  usuarioStore.setArea(areaSeleccionada.value);
  obtenerPerfilAreaUsuario();
};

async function obtenerPerfilAreaUsuario() {
  try {
    const response = await api.get(
      `/usuario/${usuarioStore.usuario}/perfil-en-area/${usuarioStore.area}`
    );
    perfil.value = response.data;
    usuarioStore.setPerfil(perfil.value);
    router.push("/");
  } catch (error) {
    console.error("error al obtener los datos", error);
  }
}

onMounted(() => {
  cargarAreas();
});
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
