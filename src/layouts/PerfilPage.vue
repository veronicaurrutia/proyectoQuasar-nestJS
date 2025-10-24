<template>
  <q-page class="q-pa-md flex flex-center" style="min-height: 100vh">
    <q-card style="max-width: 600px; width: 100%; min-height: 500px">
      <q-card-section class="text-center">
        <q-avatar size="100px">
          <template v-if="user.avatar">
            <img :src="user.avatar" alt="Avatar" />
          </template>
          <template v-else>
            <q-icon name="person" size="80px" />
          </template>
        </q-avatar>
        <div class="text-h6 q-mt-md">
          {{ user.nombre || "Sin nombre" }}
          <span v-if="user.apellido"> {{ user.apellido }}</span>
        </div>
        <div class="text-subtitle2 text-grey">
          {{ user.email || "Sin correo" }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="business" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Área</q-item-label>
              <q-item-label caption>{{ user.area }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-center">
        <q-btn
          color="primary"
          class="glossy shadow-4"
          label="Editar perfil"
          @click="goToEditPerfil"
          style="margin-right: 12px"
        />
        <q-btn
          color="primary"
          class="glossy shadow-4"
          label="Cerrar sesión"
          v-close-popup
          @click="logout"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUsuariostore } from "src/stores/usuario.store";
import { useRouter } from "vue-router";
import { Dialog, Notify } from "quasar";
import { api } from "src/boot/axios";

const usuarioStore = useUsuariostore();
const router = useRouter();
const user = ref({
  nombre: "",
  apellido: "",
  avatar: null,
  area: "",
});
console.log("UsuarioStore:", usuarioStore);
const cargarDatosUsuario = async () => {
  try {
    // Usar el id del usuario desde el store si existe, si no desde localStorage
    let id = usuarioStore.usuario;
    if (typeof id === "object" && id !== null && id.id) {
      id = id.id;
    }
    if (!id) {
      id = localStorage.getItem("usuarioId");
    }
    const token = usuarioStore.token || localStorage.getItem("token");
    if (!id || !token) {
      if (Notify && typeof Notify.create === "function") {
        Notify.create({ type: "negative", message: "No hay sesión activa." });
      } else {
        alert("No hay sesión activa.");
      }
      return;
    }
    const response = await api.get(`/usuario/${id}`);
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
    console.log("Datos usuario cargados:", user.value);
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
};

onMounted(() => {
  cargarDatosUsuario();
});

function goToEditPerfil() {
  router.push("/edit-perfil");
}

function logout() {
  router.push("/");
}
</script>
