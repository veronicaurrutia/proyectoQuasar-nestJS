<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <div style="height: 100%;" class="q-pa-md row items-center justify-center">
      <q-card bordered class="my-card q-pa-md">
        <q-card-section>
          <h6 color="primary" class="row justify-center">Bienvenido</h6>
          <h6 class="row justify-center"> Central de requerimientos</h6>
          <q-input label="Email">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input v-model="password" :type="isPwd ? 'password' : 'text'" label="Contraseña">
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section class="row justify-center">
          <q-btn @click="this.$router.push({ path: '/' })" flat color="primary" label="iniciar sesion" />
        </q-card-section>
      </q-card>
    </div>
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      password: ref(''),
      isPwd: ref(true),
    }
  }
}
</script>
