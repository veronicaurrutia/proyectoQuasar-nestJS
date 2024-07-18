<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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

        <q-list darkbordered padding class="text-primary">
          <q-item v-ripple>
            <q-item-section avatar>
              <q-avatar letter color="" text-color="" icon="face" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">Kurt Muller </q-item-label>
              <q-item-label lines="1">kmuller@loginsa.com </q-item-label>
              <q-item-label lines="1">Administrador </q-item-label>

            </q-item-section>

          </q-item>
          <q-item v-ripple>
            <q-item-section>
              <q-item-label lines="2">Tecnologias de la información. </q-item-label>
              <q-item-label lines="2">Loginsa. </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />

          <q-item :active="url === menu.url" @click="url = menu.url" v-for="menu in menu" :key="menu" clickable v-ripple
            active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon :name="menu.icon" />
            </q-item-section>

            <q-item-section>{{ menu.menu }}</q-item-section>
          </q-item>



          <q-separator spaced />

          <q-item clickable v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Configuración</q-item-section>
          </q-item>

          <q-item clickable v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>Salir</q-item-section>
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
import { ref } from 'vue'

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
    'menu': 'dashboard',
    'icon': 'dashboard',
    'url': 'dashboard'
  },
  {
    'menu': 'nueva solicitud',
    'icon': 'add_circle',
    'url': 'nueva solicitud'
  },
  {
    'menu': 'requerimientos en proceso',
    'icon': 'fast_forward',
    'url': 'requerimientos en proceso'
  },
  {
    'menu': 'requerimientos finalizados',
    'icon': 'check',
    'url': 'requerimientos finalizados'
  },
  {
    'menu': 'requerimientos asignados',
    'icon': 'supervisor_account',
    'url': 'requerimientos asignados'
  },
  {
    'menu': 'gestionar requerimientos',
    'icon': 'engineering',
    'url': 'gestionar requerimientos'
  },
])



//let drawer = false
let miniState = ref(true)

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
