<template>
  <q-layout view="lHh Lpr lFf" class="custom-background ">
    <q-header class="transparent-background" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Central de requerimientos
        </q-toolbar-title>

        <q-select class="q-mr-md" dark dense outlined v-model="empresa" :options="['Loginsa', 'otra Empresa']"
          label="Empresa" />

        <q-select dark dense outlined v-model="area" :options="['tecnologias de la informacion', 'otra area']"
          label="Area" />
        <div v-if="false">Quasar v{{ $q.version }}</div>

        <q-item clickable v-ripple>
          <q-avatar letter color="primary" text-color="white" icon="face" />
        </q-item>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :mini="miniState" @mouseover="miniState = false"
      @mouseout="miniState = true" bordered>
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">

        <q-list dark bordered padding class="text-primary">
          <q-item v-ripple>
            <q-item-section avatar>
              <q-avatar letter color="" text-color="" icon="face" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1"><strong>Kurt Muller</strong> </q-item-label>
              <q-item-label lines="1"><strong>kmuller@loginsa.com</strong> </q-item-label>
              <q-item-label lines="1"><strong>Administrador</strong> </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple>
            <q-item-section>
              <q-item-label lines="2"> <strong>Tecnologias de la información.</strong> </q-item-label>
              <q-item-label lines="2"> <strong>Loginsa.</strong> </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />

          <q-item :active="url === menu.url" @click="url = menu.url" v-for="menu in menu" :key="menu" clickable v-ripple
            active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon :name="menu.icon" />
            </q-item-section>

            <q-item-section><strong>{{ menu.menu }}</strong> </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item clickable @click="router.push('/')" v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section><strong>home</strong>
            </q-item-section>
          </q-item>

          <q-item clickable @click="router.push('/perfil')" v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section><strong>perfil</strong> </q-item-section>
          </q-item>


          <q-item clickable v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section><strong>Configuración</strong> </q-item-section>
          </q-item>

          <q-item clickable @click="logout()" v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section> <strong>Salir</strong> </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useUsuariostore } from 'src/stores/usuario.store';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MainLayout'
})

const area = ref('tecnologias de la informacion')
const empresa = ref('Loginsa.')
const url = ref('')
const menu = ref([
  {
    'menu': 'Administración',
    'icon': 'admin_panel_settings',
    'url': 'Administración'
  },
  {
    'menu': 'Dashboard',
    'icon': 'dashboard',
    'url': 'dashboard'
  },
  {
    'menu': 'Nueva solicitud',
    'icon': 'add_circle',
    'url': 'nueva solicitud'
  },
  {
    'menu': 'Requerimientos en proceso',
    'icon': 'fast_forward',
    'url': 'requerimientos en proceso'
  },
  {
    'menu': 'Requerimientos finalizados',
    'icon': 'check',
    'url': 'requerimientos finalizados'
  },
  {
    'menu': 'Requerimientos asignados',
    'icon': 'supervisor_account',
    'url': 'requerimientos asignados'
  },
  {
    'menu': 'Gestionar requerimientos',
    'icon': 'engineering',
    'url': 'gestionar requerimientos'
  },
])

const usuarioStore = useUsuariostore();
const router = useRouter();
const quasar = useQuasar()



//let drawer = false
let miniState = ref(true)

const leftDrawerOpen = ref(false)

function logout() {
  usuarioStore.logout()
  router.push('/login')
  quasar.notify({
    message: 'Hasta luego.', //agregar nombre
    icon: 'waving_hand',
    color: 'positive',
  })
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
