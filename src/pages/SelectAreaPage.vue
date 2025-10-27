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

<style scoped>
.area-selection-card {
  max-width: 450px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
}

/* Contenedor de burbujas lentas */
.bubbles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

/* Estilos de las burbujas lentas */
.bubble {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: float-slow linear infinite;
}

/* Solo 8 burbujas con movimiento MUY lento */
.bubble:nth-child(1) {
  width: 100px;
  height: 100px;
  left: 8%;
  animation-duration: 25s;
  animation-delay: 0s;
}

.bubble:nth-child(2) {
  width: 140px;
  height: 140px;
  left: 18%;
  animation-duration: 30s;
  animation-delay: 5s;
}

.bubble:nth-child(3) {
  width: 80px;
  height: 80px;
  left: 35%;
  animation-duration: 22s;
  animation-delay: 8s;
}

.bubble:nth-child(4) {
  width: 120px;
  height: 120px;
  left: 50%;
  animation-duration: 28s;
  animation-delay: 3s;
}

.bubble:nth-child(5) {
  width: 160px;
  height: 160px;
  left: 65%;
  animation-duration: 35s;
  animation-delay: 12s;
}

.bubble:nth-child(6) {
  width: 90px;
  height: 90px;
  left: 78%;
  animation-duration: 24s;
  animation-delay: 7s;
}

.bubble:nth-child(7) {
  width: 110px;
  height: 110px;
  left: 88%;
  animation-duration: 26s;
  animation-delay: 15s;
}

.bubble:nth-child(8) {
  width: 130px;
  height: 130px;
  left: 25%;
  animation-duration: 32s;
  animation-delay: 10s;
}

/* Animación muy lenta de flotación */
@keyframes float-slow {
  0% {
    bottom: -150px;
    opacity: 0;
    transform: translateX(0px) rotate(0deg);
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    bottom: 100vh;
    opacity: 0;
    transform: translateX(-30px) rotate(180deg);
  }
}

.company-logo {
  max-width: 150px;
  max-height: 120px;
  width: auto;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  object-fit: contain;
}

.company-logo:hover {
  transform: scale(1.05);
}

.company-name {
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.company-subtitle {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.8;
}

.area-select {
  font-size: 1.1rem;
}

.area-select .q-field__control {
  border-radius: 8px;
}

.access-button {
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.25);
  transition: all 0.3s ease;
}

.access-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.35);
}

.full-width {
  width: 100%;
}

/* Responsive design */
@media (max-width: 768px) {
  /* Burbujas más pequeñas en tablets */
  .bubble:nth-child(1) {
    width: 60px;
    height: 60px;
  }
  .bubble:nth-child(2) {
    width: 80px;
    height: 80px;
  }
  .bubble:nth-child(3) {
    width: 50px;
    height: 50px;
  }
  .bubble:nth-child(4) {
    width: 70px;
    height: 70px;
  }
  .bubble:nth-child(5) {
    width: 90px;
    height: 90px;
  }
  .bubble:nth-child(6) {
    width: 55px;
    height: 55px;
  }

  /* Solo 6 burbujas en tablets */
  .bubble:nth-child(n + 7) {
    display: none;
  }
}

@media (max-width: 480px) {
  .area-selection-card {
    max-width: 95%;
    margin: 0 8px;
  }

  .company-name {
    font-size: 1.2rem;
  }

  .company-subtitle {
    font-size: 0.9rem;
  }

  /* Burbujas más pequeñas en móviles */
  .bubble:nth-child(1) {
    width: 40px;
    height: 40px;
  }
  .bubble:nth-child(2) {
    width: 60px;
    height: 60px;
  }
  .bubble:nth-child(3) {
    width: 35px;
    height: 35px;
  }
  .bubble:nth-child(4) {
    width: 50px;
    height: 50px;
  }
  .bubble:nth-child(5) {
    width: 70px;
    height: 70px;
  }

  /* Solo 5 burbujas en móviles */
  .bubble:nth-child(n + 6) {
    display: none;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.area-selection-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>
