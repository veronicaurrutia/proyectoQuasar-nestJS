<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-lg q-mx-auto" style="max-width: 500px">
      <q-card-section>
        <div class="text-h6">Editar Perfil</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="form.nombre"
            label="Nombre"
            :rules="[(val) => !!val || 'El nombre es requerido']"
          />
          <q-input
            filled
            v-model="form.email"
            label="Correo electrónico"
            type="email"
            :rules="[(val) => !!val || 'El correo es requerido']"
          />
          <q-input filled v-model="form.telefono" label="Teléfono" type="tel" />
          <q-input
            filled
            v-model="form.password"
            label="Nueva Contraseña"
            type="password"
            autocomplete="new-password"
          />
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="secondary"
              flat
              @click="goToPerfil"
            />
            <q-btn label="Guardar" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const form = ref({
  nombre: "",
  email: "",
  telefono: "",
  password: "",
});

function onSubmit() {
  // Aquí puedes agregar la lógica para guardar los cambios del perfil
  $q.notify({
    type: "positive",
    message: "Perfil actualizado correctamente",
  });
}

function goToPerfil() {
  router.push("/perfil");
}
</script>
