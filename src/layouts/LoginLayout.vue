<template>
  <q-layout view="hHr LpR lFf" class="flex flex-center custom-background">
    <div style="height: 100%;" class="q-pa-md row items-center justify-center">
      <q-card bordered class="my-card q-pa-md">
        <q-form @submit.prevent="login">

          <q-card-section>
            <h6 color="primary" class="row justify-center">Bienvenido</h6>
            <h6 class="row justify-center"> Central de requerimientos</h6>
            <q-input ref="emailRef" autocomplete="current-password" v-model="email" label="email">
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input ref="passwordRef" v-model="password" autocomplete="current-password"
              :type="isPwd ? 'password' : 'text'" label="Contraseña">
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>

            <div>
              <q-checkbox dense class="text-primary q-mt-md" left-label v-model="rememberMe" label="Recordar Usuario" />
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

<script>
import { useQuasar } from 'quasar';
import { useUsuariostore } from 'src/stores/usuario.store';
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router';

export default {
  setup() {
    const password = ref('');
    const email = ref('');
    const isPwd = ref(true);
    const rememberMe = ref(true); // crear funcion rememberMe

    const router = useRouter();
    const usuarioStore = useUsuariostore();
    const emailRef = ref(null);
    const passwordRef = ref(null);

    const quasar = useQuasar()


    async function login() {
      if (email.value === '' || email.value === null) {
        return emailRef.value?.focus();
      }

      if (password.value === '' || password.value === null) {
        return passwordRef.value?.focus();
      }

      if (rememberMe.value === true) {
        localStorage.setItem('email', email.value)
      } else {
        localStorage.removeItem('email')
      }

      const response = await usuarioStore.login(email.value, password.value)
      if (response.estado == 'OK') {
        router.push('/')
        quasar.notify({
          message: 'Bienvenido.', //agregar nombre
          icon: 'waving_hand',
          color: 'positive',
        })
      }
      else {
        quasar.notify({
          message: response.data?.response?.data?.message ?? response.data.message,
          icon: 'close',
          color: 'negative',
        })
      }
    }

    watchEffect(() => {
      const emailLocal = localStorage.getItem('email')
      if (emailLocal) {
        email.value = emailLocal
        rememberMe.value = true
      }
    })

    return {
      password,
      email,
      isPwd,
      rememberMe,
      emailRef,
      passwordRef,
      quasar,
      login
    }
  }
}
</script>
