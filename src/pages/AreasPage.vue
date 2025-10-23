<template>
  <q-page class="areas-page">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-blue">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="badge" size="48px" class="q-mr-md" />
              Gestión de Áreas
            </h1>
            <p class="page-subtitle text-white opacity-90">
              Administra las áreas organizacionales y sus configuraciones
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="blue"
              icon="add_business"
              label="Nueva Área"
              size="lg"
              class="glossy shadow-5"
              @click="dialogArea = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section q-pa-lg">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="blue" size="60px" class="q-mb-md">
                  <q-icon name="business" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ areas.length }}
                </div>
                <div class="stat-label text-grey-7">Total Áreas</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="green" size="60px" class="q-mb-md">
                  <q-icon name="check_circle" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ areasActivas }}
                </div>
                <div class="stat-label text-grey-7">Áreas Activas</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="stat-card hover-lift">
              <q-card-section class="text-center">
                <q-avatar color="orange" size="60px" class="q-mb-md">
                  <q-icon name="domain" size="30px" color="white" />
                </q-avatar>
                <div class="stat-value text-h4 text-weight-bold q-mb-xs">
                  {{ empresasUnicas }}
                </div>
                <div class="stat-label text-grey-7">Empresas</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Areas Table -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="table-card">
          <q-card-section>
            <div class="table-header q-mb-md">
              <div class="row items-center">
                <div class="col">
                  <h3 class="table-title">
                    <q-icon name="list_alt" class="q-mr-sm" />
                    Lista de Áreas ({{ areas.length }})
                  </h3>
                </div>
                <div class="col-auto">
                  <q-input
                    v-model="filter"
                    placeholder="Buscar áreas..."
                    outlined
                    dense
                    clearable
                    style="width: 300px"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <q-table
              bordered
              :rows="areas"
              :columns="columns"
              :rows-per-page-options="[10, 25, 50]"
              :filter="filter"
              :pagination="pagination"
              class="modern-table"
              separator="horizontal"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props" class="text-center">
                  <q-chip 
                    color="blue" 
                    text-color="white" 
                    :label="props.pageIndex + 1"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-nombre="props">
                <q-td :props="props">
                  <div class="area-info">
                    <div class="area-name text-weight-medium">{{ props.row.nombre }}</div>
                    <div class="area-description text-caption text-grey-6">
                      {{ props.row.descripcion || 'Sin descripción' }}
                    </div>
                    <q-chip 
                      v-if="props.row.prefijo"
                      color="blue-grey" 
                      text-color="white" 
                      :label="props.row.prefijo"
                      size="sm"
                      class="q-mt-xs"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-enabledopt="props">
                <q-td :props="props" class="text-center">
                  <q-badge 
                    :color="props.row.estado ? 'green' : 'red'" 
                    :label="props.row.estado ? 'Activa' : 'Inactiva'"
                    class="estado-badge"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <div class="actions-container">
                    <q-btn
                      color="blue"
                      icon="visibility"
                      size="sm"
                      round
                      flat
                      @click="verArea(props.row)"
                    >
                      <q-tooltip>Ver detalles</q-tooltip>
                    </q-btn>
                    <q-btn
                      color="secondary"
                      icon="edit"
                      size="sm"
                      round
                      flat
                      @click="editarArea(props.row)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      :color="props.row.estado ? 'orange' : 'green'"
                      :icon="props.row.estado ? 'lock' : 'lock_open'"
                      size="sm"
                      round
                      flat
                      @click="toggleEstadoArea(props.row)"
                    >
                      <q-tooltip>{{ props.row.estado ? 'Desactivar' : 'Activar' }}</q-tooltip>
                    </q-btn>
                    <q-btn
                      color="negative"
                      icon="delete"
                      size="sm"
                      round
                      flat
                      @click="eliminarArea(props.row)"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Crear Área -->
    <q-dialog v-model="dialogArea" persistent class="area-dialog">
      <q-card class="dialog-card" style="width: 700px; max-width: 90vw">
        <q-card-section class="dialog-header bg-blue text-white">
          <div class="row items-center">
            <q-avatar square icon="add_business" color="white" text-color="blue" />
            <span class="q-ml-sm text-h6">Agregar Nueva Área</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="area.nombre"
                label="Nombre del Área *"
                outlined
                :rules="[val => !!val || 'El nombre es requerido']"
                hint="Nombre descriptivo del área"
              />
            </div>
            
            <div class="col-12">
              <q-input
                v-model="area.descripcion"
                label="Descripción"
                type="textarea"
                rows="3"
                outlined
                hint="Descripción detallada del área y sus funciones"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="area.prefijo"
                label="Prefijo *"
                outlined
                :rules="[val => !!val || 'El prefijo es requerido']"
                hint="Código corto para identificar el área (ej: TI, RRHH)"
                maxlength="10"
                counter
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="area.empresaId"
                :options="empresas"
                label="Empresa *"
                outlined
                map-options
                emit-value
                :rules="[val => !!val || 'Selecciona una empresa']"
              />
            </div>

            <div class="col-12">
              <q-toggle
                v-model="area.estado"
                label="Área activa"
                color="green"
                size="lg"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogArea = false"
            :disable="cargandoIcon"
          />
          <q-btn
            label="Crear Área"
            color="blue"
            icon="add_business"
            @click="crearArea"
            :loading="cargandoIcon"
            class="glossy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Editar Área -->
    <q-dialog v-model="dialogAreaEdit" persistent class="area-dialog">
      <q-card class="dialog-card" style="width: 700px; max-width: 90vw">
        <q-card-section class="dialog-header bg-secondary text-white">
          <div class="row items-center">
            <q-avatar square icon="edit" color="white" text-color="secondary" />
            <span class="q-ml-sm text-h6">Modificar Área</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="area.nombre"
                label="Nombre del Área"
                outlined
              />
            </div>
            
            <div class="col-12">
              <q-input
                v-model="area.descripcion"
                label="Descripción"
                type="textarea"
                rows="3"
                outlined
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="area.prefijo"
                label="Prefijo"
                outlined
                maxlength="10"
                counter
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="area.empresaId"
                :options="empresas"
                label="Empresa"
                outlined
                map-options
                emit-value
              />
            </div>

            <div class="col-12">
              <q-toggle
                v-model="area.estado"
                label="Área activa"
                color="green"
                size="lg"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogAreaEdit = false"
            :disable="cargandoIcon"
          />
          <q-btn
            label="Actualizar"
            color="secondary"
            icon="save"
            @click="actualizarArea"
            :loading="cargandoIcon"
            class="glossy"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

// --------------------
// Estado reactivo
// --------------------
const filter = ref("");
const dialogArea = ref(false);
const cargandoIcon = ref(false);
const dialogAreaEdit = ref(false);

const areas = ref([]);
const paises = ref([]);
const cuentas = ref([]);
const empresas = ref([]);

const usuarioStore = useUsuariostore();
const empresaUsuario = ref(usuarioStore.empresa);
const empresasUsuario = ref([]);

const area = ref({
  nombre: null,
  descripcion: null,
  prefijo: null,
  estado: true,
  empresaId: null,
});

// Computed
const areasActivas = computed(() => {
  return areas.value.filter(a => a.estado).length;
});

const empresasUnicas = computed(() => {
  const empresasSet = new Set(areas.value.map(a => a.empresa?.id).filter(Boolean));
  return empresasSet.size;
});

const columns = [
  {
    name: "index",
    label: "#",
    headerClasses: "bg-blue text-white",
    align: "center",
    field: (row) => row.id,
  },
  {
    name: "nombre",
    required: true,
    label: "Área",
    align: "left",
    field: "nombre",
    headerClasses: "bg-blue text-white",
    style: "min-width: 250px",
  },
  {
    name: "Empresa",
    label: "Empresa",
    field: (row) => (row.empresa ? row.empresa.nombre : "Sin Empresa"),
    align: "center",
    headerClasses: "bg-blue text-white",
  },
  {
    name: "enabledopt",
    label: "Estado",
    field: "estado",
    align: "center",
    headerClasses: "bg-blue text-white",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-blue text-white",
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 15,
});

// --------------------
// Métodos
// --------------------
async function obtenerAreas() {
  try {
    if (usuarioStore.cuentaId == null) {
      const response = await api.get("/area");
      areas.value = response.data;
    } else {
      if (empresaUsuario.value != null) {
        const response = await api.get("/area/empresa/" + empresaUsuario.value);
        areas.value = response.data;
      }
    }
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al cargar las áreas'
    });
  }
}

async function obtenerEmpresas() {
  try {
    empresas.value = [];
    const response = await api.get("/empresa");
    response.data.forEach((item) => {
      let dato = { value: item.id, label: item.nombre };
      empresas.value.push(dato);
    });
  } catch (error) {
    console.error('Error al obtener empresas:', error);
  }
}

async function obtenerEmpresa() {
  try {
    empresas.value = [];
    let item = usuarioStore.empresas.find(
      (empresa) => empresa.value === empresaUsuario.value
    );
    if (item) {
      empresas.value.push(item);
    }
  } catch (error) {
    console.error('Error al obtener empresa:', error);
  }
}

async function crearArea() {
  cargandoIcon.value = true;
  try {
    await api.post("/area", area.value);
    Notify.create({
      type: 'positive',
      message: 'Área creada exitosamente',
      icon: 'check_circle'
    });
    dialogArea.value = false;
    await obtenerAreas();
  } catch (error) {
    console.error('Error al crear área:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al crear el área'
    });
  } finally {
    cargandoIcon.value = false;
  }
}

function verArea(row) {
  Notify.create({
    type: 'info',
    message: `Visualizando área: ${row.nombre}`,
    icon: 'visibility'
  });
}

function editarArea(row) {
  dialogAreaEdit.value = true;
  area.value = { ...row };
}

async function toggleEstadoArea(row) {
  try {
    const nuevoEstado = !row.estado;
    await api.patch(`/area/${row.id}`, { estado: nuevoEstado });
    
    Notify.create({
      type: 'positive',
      message: `Área ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente`,
      icon: nuevoEstado ? 'lock_open' : 'lock'
    });
    
    await obtenerAreas();
  } catch (error) {
    console.error("Error al cambiar estado del área:", error);
    Notify.create({
      type: 'negative',
      message: 'Error al cambiar el estado del área'
    });
  }
}

async function actualizarArea() {
  cargandoIcon.value = true;
  try {
    let id = area.value.id;
    let payload = { ...area.value };
    delete payload.id;
    delete payload.empresa;
    delete payload.eliminacion;

    await api.patch("/area/" + id, payload);
    Notify.create({
      type: 'positive',
      message: 'Área actualizada exitosamente',
      icon: 'save'
    });
    dialogAreaEdit.value = false;
    await obtenerAreas();
  } catch (error) {
    console.error('Error al actualizar área:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al actualizar el área'
    });
  } finally {
    cargandoIcon.value = false;
  }
}

function eliminarArea(row) {
  Notify.create({
    timeout: 0,
    message: `¿Desea eliminar el Área "${row.nombre}"?`,
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          try {
            await api.delete("/area/" + row.id);
            Notify.create({
              type: 'positive',
              message: 'Área eliminada exitosamente'
            });
            await obtenerAreas();
          } catch (error) {
            console.error("Error al eliminar el Área:", error);
            Notify.create({
              type: 'negative',
              message: 'Error al eliminar el área'
            });
          }
        },
      },
      { label: "Cancelar", handler: () => {} },
    ],
  });
}

// --------------------
// Watchers
// --------------------
watch(dialogArea, (val) => {
  if (val === true) {
    area.value = {
      nombre: null,
      descripcion: null,
      prefijo: null,
      estado: true,
      empresaId: null,
    };
  } else {
    obtenerAreas();
  }
});

watch(dialogAreaEdit, (val) => {
  if (val === false) {
    obtenerAreas();
  } else {
    obtenerEmpresas();
  }
});

// --------------------
// Ciclo de vida
// --------------------
onMounted(() => {
  if (usuarioStore.empresas != null) {
    obtenerEmpresa();
  } else {
    obtenerEmpresas();
  }
  obtenerAreas();
});
</script>

<style lang="scss" scoped>
.areas-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  line-height: 1.5;
}

.stats-section {
  margin-top: -40px;
  position: relative;
  z-index: 1;
}

.stat-card {
  border-radius: 15px;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  }
}

.stat-value {
  background: linear-gradient(45deg, #1976D2, #42A5F5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.table-card {
  border-radius: 15px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.table-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modern-table {
  border-radius: 10px;
  overflow: hidden;
}

.area-info {
  min-width: 200px;
}

.area-name {
  font-size: 1rem;
  color: #2c3e50;
}

.area-description {
  margin-top: 4px;
  line-height: 1.3;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.actions-container {
  display: flex;
  gap: 4px;
}

.dialog-card {
  border-radius: 15px;
  overflow: hidden;
}

.dialog-header {
  padding: 20px 24px;
}

.estado-badge {
  font-weight: 600;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .stats-section {
    margin-top: -20px;
  }
  
  .page-header {
    text-align: center;
  }
  
  .actions-container {
    justify-content: center;
  }
}
</style>
