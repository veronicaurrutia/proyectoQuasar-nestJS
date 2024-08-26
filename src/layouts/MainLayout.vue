<template>
  <q-layout view="lHh Lpr lFf" class="custom-background ">
    <q-header class="transparent-background" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Central de requerimientos
        </q-toolbar-title>

        <q-select class="q-mr-md" dark dense outlined v-model="empresa" :options="empresas" label="Empresa" map-options
          emit-value />

        <q-select v-if="false" dark dense outlined v-model="area"
          :options="['tecnologias de la informacion', 'otra area']" label="Area" />
        <div v-if="false">Quasar v{{ $q.version }}</div>

        <q-item v-if="false" clickable v-ripple>
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
              <q-item-label lines="1">Kurt Muller </q-item-label>
              <q-item-label lines="1">kmuller@loginsa.com </q-item-label>
              <q-item-label v-if="false" lines="1">Administrador </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple>
            <q-item-section>
              <q-item-label lines="2"> Tecnologias de la información. </q-item-label>
              <q-item-label lines="2"> Loginsa. </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced />

          <template v-for="menu in menu" :key="menu">
            <div v-if="menu.submenu && menu.active">
              <q-expansion-item expand-icon-class="text-primary" expand-separator :icon="menu.icon" :label="menu.menu">
                <q-separator />
                <q-card v-if="menu.submenu">
                  <q-card-section v-for="submenu in menu.submenu" :key="submenu">
                    <q-item dense @click="router.push(submenu.url)" clickable v-ripple active-class="my-menu-url">
                      <q-item-section avatar>
                        <q-icon :name="submenu.icon" />
                      </q-item-section>
                      <q-item-section>
                        <div class="">{{ submenu.menu }}</div>

                        <div class="text-caption text-grey">{{ submenu.caption }}</div>

                      </q-item-section>
                    </q-item>
                  </q-card-section>
                </q-card>
                <q-separator />
              </q-expansion-item>
            </div>
            <div v-else-if="menu.active">
              <q-item clickable v-ripple active-class="my-menu-url">
                <q-item-section avatar>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>{{ menu.menu }} </q-item-section>
              </q-item>
            </div>
          </template>

          <!--

          <q-item :active="url === menu.url" @click="url = menu.url" v-for="menu in menu" :key="menu" clickable v-ripple
            active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon :name="menu.icon" />
            </q-item-section>


            <q-item-section>{{ menu.menu }} </q-item-section>
          </q-item>

-->
          <q-separator spaced />
          <q-item v-if="false" clickable @click="router.push('/')" v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>home
            </q-item-section>
          </q-item>

          <q-item clickable @click="router.push('/perfil')" v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Perfil </q-item-section>
          </q-item>


          <q-item v-if="false" clickable v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Configuración </q-item-section>
          </q-item>

          <q-item clickable @click="logout()" v-ripple active-class="my-menu-url">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section> Salir </q-item-section>
          </q-item>
        </q-list>

      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useUsuariostore } from 'src/stores/usuario.store';
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { Notify } from "quasar";
export default {
  data() {
    return {
      area: ref('tecnologias de la informacion'),
      empresa: null,
      url: ref(''),
      menu: ref([
        {
          'menu': 'Administración',
          'icon': 'admin_panel_settings',
          'url': 'Administración',
          'active': true,
          'submenu': [
            {
              'icon': 'account_circle',
              'menu': 'Cuentas',
              'caption': 'Mantenedor',
              'url': 'cuentas',
              'active': false
            },
            {
              'icon': 'domain',
              'menu': 'Empresas',
              'caption': 'Mantenedor',
              'url': 'empresas',
              'active': false
            },
            {
              'icon': 'badge',
              'menu': 'Areas',
              'caption': 'Mantenedor',
              'url': 'areas',
              'active': false
            },
            {
              'icon': 'group',
              'menu': 'Usuarios',
              'caption': 'Mantenedor',
              'url': 'usuarios',
              'active': true
            },
            {
              'icon': 'warehouse',
              'menu': 'Centros',
              'caption': 'Mantenedor',
              'url': 'centros',
              'active': true
            },

          ]
        },
        {
          'menu': 'Dashboard',
          'icon': 'dashboard',
          'url': 'dashboard',
          'active': true,

        },

        {
          'menu': 'Requerimientos',
          'icon': 'description',
          'url': 'requerimientos en proceso',
          'active': true,
          'submenu': [
            {
              'menu': 'Nueva solicitud',
              'caption': 'Requerimientos',
              'icon': 'add_circle',
              'url': 'nueva solicitud'
            },
            {
              'menu': 'Solicitudes en proceso',
              'caption': 'Requerimientos',
              'url': 'roles',
              'icon': 'fast_forward',
              'active': false
            },
            {
              'menu': 'Solicitudes finalizados',
              'caption': 'Requerimientos',
              'icon': 'check',
              'url': 'requerimientos finalizados'
            },
            {
              'menu': 'Tickets asignados',
              'caption': 'Requerimientos',
              'icon': 'supervisor_account',
              'url': 'requerimientos asignados'
            },
            {
              'menu': 'Gestionar tickets',
              'caption': 'Requerimientos',
              'icon': 'engineering',
              'url': 'gestionar requerimientos'
            },

          ]
        },
      ]),
      empresas: null,
      router: null,
      miniState: ref(true),
      leftDrawerOpen: ref(false),
      usuarioStore: null,
    }
  },
  watch: {
    empresa() {
      this.usuarioStore.setEmpresa(this.empresa);
    }
  },
  created() {
    this.usuarioStore = useUsuariostore();
    this.router = useRouter();
    this.empresas = this.usuarioStore.empresas
    // if (this.empresas != null) {
    //   this.obtenerEmpresas()
    // }
  },
  methods: {
    obtenerEmpresas() {
      // this.empresas = JSON.parse(localStorage.getItem('empresas')) || [];
      this.empresa = this.empresas[0].value
    },
    logout() {
      const usuarioStore = useUsuariostore();
      usuarioStore.logout()
      Notify.create({
        message: "Hasta luego.",
        icon: "waving_hand",
        color: "positive",
      });
      this.router.push('/login')
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  },
};
</script>
