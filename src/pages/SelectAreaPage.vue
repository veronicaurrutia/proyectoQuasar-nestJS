<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <!-- Burbujas flotantes lentas -->
    <div class="bubbles-container">
      <div class="bubble" v-for="n in 8" :key="n"></div>
    </div>

    <div style="height: 100%" class="q-pa-md row items-center justify-center">
      <q-card bordered class="area-selection-card q-pa-lg">
        <q-card-section class="text-center">
          <!-- Logo de la empresa -->

          <div v-if="empresa" class="q-mb-lg">
            <img
              :src="empresa.imagenEmpresa"
              alt="Logo empresa"
              class="company-logo"
            />
          </div>
          <div v-else class="q-mb-lg">
            <img
              src="src/assets/quasar-logo-vertical.svg"
              alt="Logo empresa"
              class="company-logo"
            />
          </div>

          <!-- Nombre empresa -->
          <h5 class="text-primary q-mt-none q-mb-sm company-name">
            <div v-if="empresa">
              {{ empresa.nombre }}
            </div>
            <div v-else>Cargando empresa...</div>
          </h5>

          <!-- Subtítulo -->
          <p class="text-grey-7 q-mb-lg company-subtitle">
            Selecciona el área de trabajo
          </p>
        </q-card-section>

        <q-separator class="q-mb-lg" />

        <q-card-section>
          <!-- Selector de área -->
          <q-select
            outlined
            v-model="areaSeleccionada"
            :options="areas"
            option-label="nombre"
            option-value="id"
            label="Área de trabajo"
            emit-value
            map-options
            :loading="cargando"
            class="q-mb-lg area-select"
          >
            <template v-slot:prepend>
              <q-icon name="business" color="primary" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay áreas disponibles
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Botón confirmar -->
          <q-btn
            label="Ingresar al Sistema"
            color="primary"
            size="lg"
            :disable="!areaSeleccionada"
            :loading="cargando"
            @click="confirmarArea"
            class="full-width access-button"
            icon="login"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";
import { useRouter } from "vue-router";
//css
import "src/css/pages/selectAreaPage.scss";

const $q = useQuasar();
const usuarioStore = useUsuariostore();

const router = useRouter();
const areas = ref([]);
const cargando = ref(false);
const areaSeleccionada = ref(null);
const perfil = ref(null);
const empresa = ref(null);

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

async function obtenerEmpresa() {
  try {
    const response = await api.get(`/empresa/${usuarioStore.empresa}`);
    empresa.value = response.data; // o response.data.data si tu backend lo envuelve
    console.log(empresa.value);
  } catch (error) {
    console.error("error al obtener los datos de la empresa: ", error);
  }
}

onMounted(() => {
  cargarAreas();
  obtenerEmpresa();
});
</script>
