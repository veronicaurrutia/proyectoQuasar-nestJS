<template>
  <q-page class="q-pa-md flex flex-center" style="min-height: 100vh">
    <q-card
      style="max-width: 700px; width: 100%; min-height: 600px"
      class="shadow-10"
    >
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
          {{ user.nombre || 'Sin nombre' }}
          <span v-if="user.apellido"> {{ user.apellido }}</span>
        </div>
        <div class="text-subtitle2 text-grey">
          {{ user.email || 'Sin correo' }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nombre</q-item-label>
              <q-item-label caption>{{
                user.nombre || 'Sin nombre'
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="person_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Apellido</q-item-label>
              <q-item-label caption>{{
                user.apellido || 'Sin apellido'
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="email" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Correo Electrónico</q-item-label>
              <q-item-label caption>{{
                user.email || 'Sin correo'
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="phone" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Teléfono</q-item-label>
              <q-item-label caption>{{
                user.phone || 'No registrado'
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="business" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Área de Trabajo</q-item-label>
              <q-item-label caption>{{
                user.areaNombre || user.area || 'Sin área asignada'
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="domain" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Empresa</q-item-label>
              <q-item-label caption>{{
                user.empresa || 'No especificada'
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="user.ultimoAcceso">
            <q-item-section avatar>
              <q-icon name="access_time" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Último Acceso</q-item-label>
              <q-item-label caption>{{
                formatearFecha(user.ultimoAcceso)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <!-- Sección de estadísticas del usuario -->
      <q-card-section>
        <div class="text-h6 q-mb-md text-center">
          <q-icon name="analytics" class="q-mr-sm" />
          Estadísticas de Actividad
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-card flat bordered class="text-center q-pa-sm">
              <q-icon name="local_activity" size="24px" />
              <div class="text-h6 q-mt-xs">{{ user.totalTickets || 0 }}</div>
              <div class="text-caption text-grey">Total Tickets</div>
            </q-card>
          </div>
          <div class="col-6">
            <q-card flat bordered class="text-center q-pa-sm">
              <q-icon name="schedule" size="24px" />
              <div class="text-h6 q-mt-xs">
                {{ user.ticketsPendientes || 0 }}
              </div>
              <div class="text-caption text-grey">Pendientes</div>
            </q-card>
          </div>
          <div class="col-6">
            <q-card flat bordered class="text-center q-pa-sm">
              <q-icon name="check_circle" size="24px" />
              <div class="text-h6 q-mt-xs">
                {{ user.ticketsResueltos || 0 }}
              </div>
              <div class="text-caption text-grey">Resueltos</div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-center q-pa-lg">
        <q-btn
          color="primary"
          icon="edit"
          class="glossy shadow-4 q-mr-sm"
          label="Editar Perfil"
          @click="goToEditPerfil"
        />
        <q-btn
          color="negative"
          icon="logout"
          class="glossy shadow-4"
          label="Cerrar Sesión"
          @click="logout"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsuariostore } from 'src/stores/usuario.store';
import { useRouter } from 'vue-router';
import { Dialog, Notify } from 'quasar';
import { api } from 'src/boot/axios';

const usuarioStore = useUsuariostore();
const router = useRouter();
const user = ref({
  id: '',
  nombre: '',
  apellido: '',
  email: '',
  avatar: null,
  phone: '',
  area: '',
  areaNombre: '',
  empresa: '',
  fechaRegistro: '',
  ultimoAcceso: '',
  activo: true,
  totalTickets: 0,
  ticketsPendientes: 0,
  ticketsResueltos: 0,
  diasActivo: 0,
});

console.log('UsuarioStore:', usuarioStore);

// Función para formatear fechas
const formatearFecha = (fecha) => {
  if (!fecha) return 'No disponible';

  try {
    const fechaObj = new Date(fecha);
    const opciones = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  } catch (error) {
    return 'Fecha inválida';
  }
};

const cargarDatosUsuario = async () => {
  try {
    // Usar el id del usuario desde el store si existe, si no desde localStorage
    let id = usuarioStore.usuario;
    if (typeof id === 'object' && id !== null && id.id) {
      id = id.id;
    }
    if (!id) {
      id = localStorage.getItem('usuarioId');
    }
    const token = usuarioStore.token || localStorage.getItem('token');
    if (!id || !token) {
      if (Notify && typeof Notify.create === 'function') {
        Notify.create({ type: 'negative', message: 'No hay sesión activa.' });
      } else {
        alert('No hay sesión activa.');
      }
      return;
    }

    // Cargar datos completos del usuario
    const response = await api.get(`/usuario/${id}`);
    const u = response.data;

    // Cargar información adicional del área si existe
    let areaNombre = '';
    let empresaNombre = '';

    try {
      if (u.areaId || usuarioStore.area) {
        const areaResponse = await api.get(
          `/area/${u.areaId || usuarioStore.area}`,
        );
        areaNombre = areaResponse.data.nombre || '';
      }
    } catch (error) {
      console.log('No se pudo cargar información del área');
    }

    try {
      if (u.empresaId || usuarioStore.empresa) {
        const empresaResponse = await api.get(
          `/empresa/${u.empresaId || usuarioStore.empresa}`,
        );
        empresaNombre = empresaResponse.data.nombre || '';
      }
    } catch (error) {
      console.log('No se pudo cargar información de la empresa');
    }

    // Cargar estadísticas del usuario
    try {
      const statsResponse = await api.get(`/usuario/${id}/estadisticas`);
      const stats = statsResponse.data;

      user.value.totalTickets = stats.totalTickets || 0;
      user.value.ticketsPendientes = stats.ticketsPendientes || 0;
      user.value.ticketsResueltos = stats.ticketsResueltos || 0;
      user.value.diasActivo = stats.diasActivo || 0;
    } catch (error) {
      console.log('No se pudieron cargar las estadísticas del usuario');
      // Calcular días activo basado en fecha de registro si está disponible
      if (user.value.fechaRegistro) {
        const fechaRegistro = new Date(user.value.fechaRegistro);
        const ahora = new Date();
        const diffTime = Math.abs(ahora - fechaRegistro);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        user.value.diasActivo = diffDays;
      }
    }

    user.value = {
      id: u.id || id,
      nombre: u.nombre || 'Sin nombre',
      apellido: u.apellido || '',
      email: u.email || 'Sin correo',
      avatar: u.avatar || null,
      phone: u.telefono || u.phone || u.tel || '', // Múltiples posibilidades
      area: u.area || areaNombre || '',
      areaNombre: areaNombre || u.area || 'Sin área asignada',
      empresa: empresaNombre || u.empresa || 'No especificada',
      fechaRegistro: u.created_at || u.fechaRegistro || '',
      ultimoAcceso: u.ultimo_acceso || u.ultimoAcceso || '',
      activo: u.activo !== undefined ? u.activo : true,
      totalTickets: user.value.totalTickets,
      ticketsPendientes: user.value.ticketsPendientes,
      ticketsResueltos: user.value.ticketsResueltos,
      diasActivo: user.value.diasActivo,
    };

    console.log('Datos usuario cargados:', user.value);
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    if (Notify && typeof Notify.create === 'function') {
      Notify.create({
        type: 'negative',
        message: 'Error al cargar datos del usuario.',
      });
    } else {
      alert('Error al cargar datos del usuario.');
    }
  }
};

onMounted(() => {
  cargarDatosUsuario();
});

function goToEditPerfil() {
  router.push('/edit-perfil');
}

function logout() {
  router.push('/');
}
</script>
