<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <!-- Burbujas flotantes lentas -->
    <div class="bubbles-container">
      <div class="bubble" v-for="n in 8" :key="n"></div>
    </div>

    <div style="height: 100%" class="q-pa-md row items-center justify-center">
      <q-card bordered class="my-card q-pa-md">
        <q-form @submit.prevent="login">
          <q-card-section>
            <!-- Logo/Imagen arriba de Bienvenido -->
            <div class="text-center q-mb-md">
              <img 
                src="src/assets/loginsa.png" 
                alt="Logo" 
                class="login-image" 
              />
            </div>
            
            <h6
              color="primary"
              class="row justify-center text-primary q-mt-none q-mb-sm"
            >
              Bienvenido
            </h6>
            <h6 class="row justify-center text-grey-6 q-mt-none q-mb-lg">
              Central de Requerimientos
            </h6>

            <q-select
              v-model="empresaSeleccionada"
              :options="empresas"
              option-label="nombre"
              option-value="id"
              label="Seleccionar Empresa"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="domain" color="primary" />
              </template>
            </q-select>

            <q-input
              ref="emailRef"
              autocomplete="current-password"
              v-model="email"
              label="Correo Electrónico"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <q-input
              ref="passwordRef"
              v-model="password"
              autocomplete="current-password"
              :type="isPwd ? 'password' : 'text'"
              label="Contraseña"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="q-mb-lg">
              <q-checkbox
                v-model="rememberMe"
                label="Recordar mi usuario"
                color="primary"
                class="custom-checkbox"
              />
            </div>
          </q-card-section>

          <q-card-section class="row justify-center q-pt-none">
            <q-btn
              type="submit"
              color="primary"
              label="Iniciar Sesión"
              class="full-width login-btn"
              size="lg"
              icon="login"
              :loading="loading"
              no-caps
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";

const email = ref("");
const password = ref("");
const isPwd = ref(true);
const rememberMe = ref(true);
const loading = ref(false);

const emailRef = ref(null);
const passwordRef = ref(null);
const empresaSeleccionada = ref(null);
const empresas = ref([]);

const router = useRouter();
const quasar = useQuasar();
const usuarioStore = useUsuariostore();

// ----- FUNCIONES -----
const login = async () => {
  if (!email.value) return emailRef.value?.focus();
  if (!password.value) return passwordRef.value?.focus();

  // Guardar email en localStorage si rememberMe está activo
  if (rememberMe.value) localStorage.setItem("email", email.value);
  else localStorage.removeItem("email");

  try {
    loading.value = true;
    console.log(empresaSeleccionada.value.id, "la empresa");
    const response = await usuarioStore.loginEmpresa(
      email.value,
      password.value,
      empresaSeleccionada.value.id
    );

    if (response.estado === "OK") {
      router.push("/select-area");
      quasar.notify({
        message: `Bienvenido ${response.data?.usuario?.nombre ?? ""}`,
        icon: "waving_hand",
        color: "positive",
      });
    } else {
      quasar.notify({
        message:
          response.data?.response?.data?.message ??
          response.data?.message ??
          "Error en login",
        icon: "close",
        color: "negative",
      });
    }
  } catch (error) {
    quasar.notify({
      message: error.message || "Error al intentar iniciar sesión",
      icon: "close",
      color: "negative",
    });
  } finally {
    loading.value = false;
  }
};

const getEmpresas = async () => {
  const response = await api.get("/empresa");
  empresas.value = response.data;
};

// ----- ON MOUNT -----
onMounted(() => {
  const storedEmail = localStorage.getItem("email");
  getEmpresas();
  if (storedEmail) {
    email.value = storedEmail;
    rememberMe.value = true;
  }
});
</script>

<style scoped>
.my-card {
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: white;
  position: relative;
  z-index: 2;
}

.full-width {
  width: 100%;
}

h6 {
  font-weight: 600;
  font-size: 1.25rem;
}

/* Estilos para la imagen del login */
.login-image {
  max-width: 120px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.login-image:hover {
  transform: scale(1.05);
}

/* Estilos para el checkbox personalizado */
.custom-checkbox {
  font-size: 14px;
  color: #666;
}

.custom-checkbox :deep(.q-checkbox__bg) {
  border: 2px solid #1976d2;
  border-radius: 3px;
  width: 18px;
  height: 18px;
}

.custom-checkbox :deep(.q-checkbox__svg) {
  width: 14px;
  height: 14px;
}

/* Estilos para el botón de login */
.login-btn {
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 0;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
  transform: translateY(-1px);
}

.login-btn :deep(.q-btn__content) {
  font-weight: 600;
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



/* Responsive */
@media (max-width: 768px) {
  /* Burbujas más pequeñas en tablets */
  .bubble:nth-child(1) { width: 60px; height: 60px; }
  .bubble:nth-child(2) { width: 80px; height: 80px; }
  .bubble:nth-child(3) { width: 50px; height: 50px; }
  .bubble:nth-child(4) { width: 70px; height: 70px; }
  .bubble:nth-child(5) { width: 90px; height: 90px; }
  .bubble:nth-child(6) { width: 55px; height: 55px; }
  
  /* Solo 6 burbujas en tablets */
  .bubble:nth-child(n+7) {
    display: none;
  }
}

@media (max-width: 480px) {
  .my-card {
    max-width: 95%;
    margin: 0 8px;
  }

  /* Burbujas más pequeñas en móviles */
  .bubble:nth-child(1) { width: 40px; height: 40px; }
  .bubble:nth-child(2) { width: 60px; height: 60px; }
  .bubble:nth-child(3) { width: 35px; height: 35px; }
  .bubble:nth-child(4) { width: 50px; height: 50px; }
  .bubble:nth-child(5) { width: 70px; height: 70px; }
  
  /* Solo 5 burbujas en móviles */
  .bubble:nth-child(n+6) {
    display: none;
  }
}
</style>
