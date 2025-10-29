<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-lg q-mx-auto" style="max-width: 800px">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="edit" class="q-mr-sm" />
          Editar Perfil
        </div>
        <div class="text-caption text-grey-7">
          Actualiza tu información personal y configuración de cuenta
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                filled
                v-model="form.nombre"
                label="Nombre"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input filled v-model="form.apellido" label="Apellido">
                <template v-slot:prepend>
                  <q-icon name="person_outline" />
                </template>
              </q-input>
            </div>
          </div>

          <q-input
            filled
            v-model="form.email"
            label="Correo electrónico"
            type="email"
            :rules="[(val) => !!val || 'El correo es requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input filled v-model="form.telefono" label="Teléfono" type="tel">
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <q-select
            filled
            v-model="form.area"
            :options="opcionesAreas"
            option-value="id"
            option-label="nombre"
            label="Área de Trabajo"
            emit-value
            map-options
            use-input
            input-debounce="0"
            :loading="cargandoOpciones"
            :disable="opcionesAreas.length === 0"
            clearable
            @filter="filtrarAreas"
          >
            <template v-slot:prepend>
              <q-icon name="business" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ cargandoOpciones ? 'Cargando áreas...' : 'No hay áreas disponibles' }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.empresa"
            :options="opcionesEmpresas"
            option-value="id"
            option-label="nombre"
            label="Empresa"
            emit-value
            map-options
            use-input
            input-debounce="0"
            :loading="cargandoOpciones"
            :disable="opcionesEmpresas.length === 0"
            clearable
            @filter="filtrarEmpresas"
          >
            <template v-slot:prepend>
              <q-icon name="domain" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ cargandoOpciones ? 'Cargando empresas...' : 'No hay empresas disponibles' }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-grey-7 q-mb-sm">
            <q-icon name="lock" class="q-mr-xs" />
            Cambio de Contraseña (opcional)
          </div>

          <q-input
            filled
            v-model="form.password"
            label="Nueva Contraseña"
            type="password"
            autocomplete="new-password"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.confirmarPassword"
            label="Confirmar Contraseña"
            type="password"
            autocomplete="new-password"
            :rules="[
              (val) => !form.password || !!val || 'Confirme la contraseña',
              (val) =>
                !form.password ||
                val === form.password ||
                'Las contraseñas no coinciden',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" />
            </template>
          </q-input>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              label="Cancelar"
              color="secondary"
              flat
              @click="goToPerfil"
              :disable="cargandoGuardado"
            />
            <q-btn 
              label="Guardar" 
              type="submit" 
              color="primary" 
              icon="save"
              :loading="cargandoGuardado"
              :disable="cargandoGuardado"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useUsuariostore } from 'src/stores/usuario.store';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const router = useRouter();
const usuarioStore = useUsuariostore();

const form = ref({
  id: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  area: '',
  empresa: '',
  activo: true,
  password: '',
  confirmarPassword: '',
});

const opcionesAreas = ref([]);
const opcionesEmpresas = ref([]);
const cargandoOpciones = ref(false);
const cargandoGuardado = ref(false);

// Arrays para mantener las opciones originales durante el filtrado
const opcionesAreasOriginales = ref([]);
const opcionesEmpresasOriginales = ref([]);

// Funciones de filtrado para búsqueda en selects
const filtrarAreas = (val, update, abort) => {
  update(() => {
    if (val === '') {
      opcionesAreas.value = opcionesAreasOriginales.value;
    } else {
      const needle = val.toLowerCase();
      opcionesAreas.value = opcionesAreasOriginales.value.filter(
        v => v.nombre.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const filtrarEmpresas = (val, update, abort) => {
  update(() => {
    if (val === '') {
      opcionesEmpresas.value = opcionesEmpresasOriginales.value;
    } else {
      const needle = val.toLowerCase();
      opcionesEmpresas.value = opcionesEmpresasOriginales.value.filter(
        v => v.nombre.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

// Cargar opciones para los selects
const cargarOpciones = async () => {
  cargandoOpciones.value = true;

  try {
    // Cargar áreas
    const areasResponse = await api.get('/areas');
    const areas = areasResponse.data || [];
    opcionesAreas.value = areas;
    opcionesAreasOriginales.value = [...areas]; // Copia para filtrado
    console.log('Áreas cargadas:', areas.length);
  } catch (error) {
    console.error('Error cargando áreas:', error);
    opcionesAreas.value = [];
    opcionesAreasOriginales.value = [];
    
    $q.notify({
      type: 'warning',
      message: 'No se pudieron cargar las áreas',
      caption: error.response?.status === 404 ? 'Endpoint no encontrado' : 'Error de conexión'
    });
  }

  try {
    // Cargar empresas
    const empresasResponse = await api.get('/empresas');
    const empresas = empresasResponse.data || [];
    opcionesEmpresas.value = empresas;
    opcionesEmpresasOriginales.value = [...empresas]; // Copia para filtrado
    console.log('Empresas cargadas:', empresas.length);
  } catch (error) {
    console.error('Error cargando empresas:', error);
    opcionesEmpresas.value = [];
    opcionesEmpresasOriginales.value = [];
    
    $q.notify({
      type: 'warning',
      message: 'No se pudieron cargar las empresas',
      caption: error.response?.status === 404 ? 'Endpoint no encontrado' : 'Error de conexión'
    });
  }

  cargandoOpciones.value = false;
  
  if (opcionesAreas.value.length > 0 || opcionesEmpresas.value.length > 0) {
    $q.notify({
      type: 'positive',
      message: 'Opciones cargadas correctamente'
    });
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
      $q.notify({
        type: 'negative',
        message: 'No hay sesión activa.',
      });
      return;
    }

    // Cargar datos del usuario
    const response = await api.get(`/usuario/${id}`);
    const usuario = response.data;

    form.value = {
      id: usuario.id || id,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email || '',
      telefono: usuario.telefono || usuario.phone || usuario.tel || '', // Múltiples posibilidades
      area: usuario.areaId || usuario.area || '',
      empresa: usuario.empresaId || usuario.empresa || '',
      activo: usuario.activo !== undefined ? usuario.activo : true,
      password: '',
      confirmarPassword: '',
    };

    console.log('Datos del usuario cargados en el formulario:', form.value);

    $q.notify({
      type: 'positive',
      message: 'Datos del usuario cargados correctamente',
    });
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los datos del usuario',
    });
  }
};

function onSubmit() {
  // Validar contraseñas si se está cambiando
  if (
    form.value.password &&
    form.value.password !== form.value.confirmarPassword
  ) {
    $q.notify({
      type: 'negative',
      message: 'Las contraseñas no coinciden',
    });
    return;
  }

  // Preparar datos para enviar
  const datosActualizados = {
    id: form.value.id,
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    email: form.value.email,
    telefono: form.value.telefono, // Asegurar que el teléfono se incluya
    areaId: form.value.area,
    empresaId: form.value.empresa,
    activo: form.value.activo,
  };

  // Solo incluir contraseña si se está cambiando
  if (form.value.password) {
    datosActualizados.password = form.value.password;
  }

  console.log('Datos a actualizar:', datosActualizados);

  // Hacer la llamada real a la API
  actualizarPerfil(datosActualizados);
}

// Función para actualizar el perfil
const actualizarPerfil = async (datos) => {
  try {
    cargandoGuardado.value = true;

    // Llamada real a la API
    const response = await api.put(`/usuario/${datos.id}`, datos);
    
    console.log('Respuesta del servidor:', response.data);
    
    $q.notify({
      type: 'positive',
      message: 'Perfil actualizado correctamente',
      caption: 'Los cambios han sido guardados'
    });

    // Redirigir al perfil después de guardar
    router.push('/perfil');
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    
    let mensaje = 'Error al actualizar el perfil';
    let detalle = 'Inténtalo de nuevo más tarde';
    
    if (error.response?.data?.message) {
      detalle = error.response.data.message;
    } else if (error.response?.status === 404) {
      detalle = 'Endpoint no encontrado - contacta al administrador';
    } else if (error.response?.status === 401) {
      detalle = 'No tienes permisos para realizar esta acción';
    }
    
    $q.notify({
      type: 'negative',
      message: mensaje,
      caption: detalle
    });
  } finally {
    cargandoGuardado.value = false;
  }
};

function onReset() {
  cargarDatosUsuario();
}

function goToPerfil() {
  router.push('/perfil');
}

onMounted(() => {
  cargarOpciones();
  cargarDatosUsuario();
});
</script>
