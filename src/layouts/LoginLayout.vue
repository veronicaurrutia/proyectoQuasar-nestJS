<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <div style="height: 100%" class="q-pa-md row items-center justify-center">
      <q-card bordered class="my-card q-pa-md">
        <q-form @submit.prevent="login">
          <q-card-section>
            <h6 color="primary" class="row justify-center">Bienvenido</h6>
            <h6 class="row justify-center">Central de requerimientos</h6>
            <q-select
              v-model="empresaSeleccionada"
              :options="empresas"
              option-label="nombre"
              option-value="id"
              label="Seleccionar Empresa"
              outlined
              dense
              class="q-mb-sm"
            />
            <q-input
              ref="emailRef"
              autocomplete="current-password"
              v-model="email"
              label="email"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              ref="passwordRef"
              v-model="password"
              autocomplete="current-password"
              :type="isPwd ? 'password' : 'text'"
              label="Contraseña"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div>
              <q-checkbox
                dense
                class="text-primary q-mt-md"
                left-label
                v-model="rememberMe"
                label="Recordar Usuario"
              />
            </div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section class="row justify-center">
            <q-btn type="submit" flat color="primary" label="iniciar sesion" />
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

const emailRef = ref(null);
const passwordRef = ref(null);
const empresaSeleccionada = ref(null);
const empresas = ref(null);

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
