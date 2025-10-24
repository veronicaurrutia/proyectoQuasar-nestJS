<template>
  <q-page class="q-pa-md">
    <!-- Header Section -->
    <div class="page-header q-pa-lg bg-gradient-primary">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="page-title text-white q-mb-sm">
              <q-icon name="domain" size="48px" class="q-mr-md" />
              Mantenedor de Empresas
            </h1>
            <p class="page-subtitle text-white">
              Gestiona y administra las empresas del sistema
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn
              color="white"
              text-color="primary"
              icon="add"
              label="Nueva Empresa"
              size="lg"
              class="glossy shadow-5"
              @click="dialogEmpresa = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="table-section q-pa-lg">
      <div class="container">
        <q-card class="q-mb-lg table-card" elevation="2">
          <q-card-section class="q-pb-none">
            <div class="row items-center justify-between q-mb-md">
              <div class="col-auto">
                <h3 class="table-title">
                  <q-icon name="business" class="q-mr-sm" />
                  Lista de Empresas
                </h3>
                <div class="text-caption text-grey-6">
                  Administra la información de las empresas registradas
                </div>
              </div>
            </div>
          </q-card-section>
      <q-separator class="q-mx-md" />
      <q-card-section>
        <q-table
          flat
          bordered
          :rows="empresas"
          :columns="columns"
          :filter="filter"
          row-key="id"
          :pagination="pagination"
          class="empresa-table"
        >
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar empresa..."
              outlined
              class="search-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="filter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click="filter = ''"
                />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-index="props">
            <q-td :props="props" class="text-center">
              <q-chip size="sm" color="grey-3" text-color="grey-8">
                {{ props.pageIndex + 1 }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-enabledopt="props">
            <q-td :props="props" class="text-center">
              <q-badge
                :color="props.row.estado ? 'positive' : 'negative'"
                :label="props.row.estado ? 'Activa' : 'Inactiva'"
                class="q-px-sm"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <div class="q-gutter-xs">
                <q-btn
                  size="sm"
                  color="primary"
                  icon="edit"
                  round
                  flat
                  @click="editarEmpresa(props.row)"
                >
                  <q-tooltip>Editar empresa</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  round
                  flat
                  @click="eliminarEmpresa(props.row)"
                >
                  <q-tooltip>Eliminar empresa</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
      </div>
    </div>
    <!-- DIALOGO CREAR EMPRESA -->
    <q-dialog v-model="dialogEmpresa" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="add_business" class="q-mr-sm" />
            Nueva Empresa
          </div>
          <div class="text-subtitle2">
            Completa la información de la nueva empresa
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="empresa.nombre"
                label="Nombre de la empresa"
                outlined
                lazy-rules
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="empresa.email"
                label="Correo electrónico"
                outlined
                lazy-rules
                color="primary"
                type="email"
                :rules="[(val) => !!val || 'El correo es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="empresa.razon_social"
                label="Razón Social"
                outlined
                lazy-rules
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="assignment" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="empresa.telefono"
                label="Teléfono"
                outlined
                lazy-rules
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="empresa.paisId"
                :options="paises"
                label="País"
                outlined
                map-options
                emit-value
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="public" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                v-model="empresa.direccion"
                label="Dirección"
                outlined
                lazy-rules
                color="primary"
                type="textarea"
                rows="2"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>
            </div>

            <div class="col-12" v-if="cuentas.length > 0">
              <q-select
                v-model="empresa.cuentaId"
                :options="cuentas"
                label="Cuenta"
                outlined
                map-options
                emit-value
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="account_balance" />
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogEmpresa = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Crear Empresa"
            color="primary"
            @click="crearEmpresa()"
            :loading="cargandoIcon"
            :disable="cargandoIcon"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO EDITAR EMPRESA -->
    <q-dialog v-model="dialogEmpresaEdit" persistent>
      <q-card style="width: 800px; max-width: 90vw">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="edit_note" class="q-mr-sm" />
            Editar Empresa
          </div>
          <div class="text-subtitle2">
            Modifica la información de la empresa
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="empresa.nombre"
                label="Nombre de la empresa"
                outlined
                lazy-rules
                color="primary"
                :rules="[(val) => !!val || 'El nombre es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="empresa.email"
                label="Correo electrónico"
                outlined
                lazy-rules
                color="primary"
                type="email"
                :rules="[(val) => !!val || 'El correo es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="empresa.razon_social"
                label="Razón Social"
                outlined
                lazy-rules
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="assignment" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="empresa.telefono"
                label="Teléfono"
                outlined
                lazy-rules
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="empresa.paisId"
                :options="paises"
                label="País"
                outlined
                map-options
                emit-value
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="public" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                v-model="empresa.direccion"
                label="Dirección"
                outlined
                lazy-rules
                color="primary"
                type="textarea"
                rows="2"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            @click="dialogEmpresaEdit = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Actualizar"
            color="primary"
            @click="actualizarEmpresa()"
            :loading="cargandoIcon"
            :disable="cargandoIcon"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

// ✅ store
const usuarioStore = useUsuariostore();
const cuentaId = ref(usuarioStore.cuentaId);

// ✅ states
const filter = ref("");
const dialogEmpresa = ref(false);
const cargandoIcon = ref(false);
const dialogEmpresaEdit = ref(false);

const empresas = ref([]);
const paises = ref([]);
const cuentas = ref([]);

const empresa = reactive({
  nombre: null,
  email: null,
  razon_social: null,
  telefono: null,
  direccion: null,
  paisId: null,
  estado: true,
  cuentaId: null,
});

const columns = [
  {
    name: "index",
    label: "#",
    headerClasses: "bg-primary text-white glossy",
    align: "center",
    field: (row) => row.id,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.nombre,
    format: (val) => `${val}`,
    headerClasses: "bg-primary text-white glossy",
    style: "max-width: 150px",
  },
  {
    name: "email",
    label: "Correo",
    field: "email",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "direccion",
    label: "Dirección",
    field: "direccion",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "cuenta",
    label: "Cuenta",
    field: (row) => (row.cuenta ? row.cuenta.nombre : "Sin cuenta"),
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
  {
    name: "enabledopt",
    label: "Estado",
    field: "estado",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
    format: (val) =>
      val
        ? '<q-icon name="check_circle" color="green" />'
        : '<q-icon name="cancel" color="red" />',
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
    headerClasses: "bg-primary text-white glossy",
  },
];

const estados = [
  { label: "Activada", value: true },
  { label: "Desactivada", value: false },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// ✅ methods
const obtenerPaises = async () => {
  const response = await api.get("pais");
  paises.value = response.data.map((item) => ({
    value: item.id,
    label: item.nombre + " [" + item.codigo + "]",
  }));
};

const obtenerEmpresas = async () => {
  if (cuentaId.value == null) {
    const response = await api.get("/empresa");
    empresas.value = response.data;
  } else {
    const response = await api.get("/empresa/cuenta/" + cuentaId.value);
    empresas.value = response.data;
  }
};

const obtenerCuentas = async () => {
  const response = await api.get("/cuenta");
  cuentas.value = response.data.map((item) => ({
    value: item.id,
    label: item.nombre,
  }));
};

const obtenerCuentaMaestra = async () => {
  const response = await api.get("/cuenta/" + cuentaId.value);
  cuentas.value.push({ value: response.data.id, label: response.data.nombre });
};

const crearEmpresa = async () => {
  try {
    cargandoIcon.value = true;
    const payload = { ...empresa };
    if (payload.paisId && typeof payload.paisId === "object") {
      payload.paisId = payload.paisId.value;
    }
    await api.post("/empresa", payload);

    Notify.create({
      type: "positive",
      message: "Empresa creada exitosamente",
      position: "top-right",
    });

    dialogEmpresa.value = false;
    obtenerEmpresas();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear la empresa",
      position: "top-right",
    });
  } finally {
    cargandoIcon.value = false;
  }
};

const editarEmpresa = (row) => {
  dialogEmpresaEdit.value = true;
  Object.assign(empresa, row);
};

const actualizarEmpresa = async () => {
  try {
    cargandoIcon.value = true;
    const id = empresa.id;
    const payload = { ...empresa };
    delete payload.id;
    delete payload.cuenta;
    delete payload.eliminacion;

    await api.patch("/empresa/" + id, payload);

    Notify.create({
      type: "positive",
      message: "Empresa actualizada exitosamente",
      position: "top-right",
    });

    dialogEmpresaEdit.value = false;
    obtenerEmpresas();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar la empresa",
      position: "top-right",
    });
  } finally {
    cargandoIcon.value = false;
  }
};

const eliminarEmpresa = (row) => {
  Notify.create({
    timeout: 0,
    message: `¿Está seguro de eliminar la empresa "${row.nombre}"?`,
    html: true,
    icon: "warning",
    color: "warning",
    position: "center",
    actions: [
      {
        label: "Eliminar",
        color: "negative",
        handler: async () => {
          try {
            await api.delete("/empresa/" + row.id);
            Notify.create({
              type: "positive",
              message: "Empresa eliminada exitosamente",
              position: "top-right",
            });
            obtenerEmpresas();
          } catch (error) {
            Notify.create({
              type: "negative",
              message: "Error al eliminar la empresa",
              position: "top-right",
            });
          }
        },
      },
      {
        label: "Cancelar",
        color: "primary",
        flat: true,
        handler: () => {
          console.log("Eliminación cancelada");
        },
      },
    ],
  });
};

// ✅ lifecycle
onMounted(() => {
  obtenerPaises();
  obtenerEmpresas();
  if (cuentaId.value == null) {
    obtenerCuentas();
  } else {
    obtenerCuentaMaestra();
  }
});

// ✅ watchers
watch(dialogEmpresa, (val) => {
  if (val) {
    Object.assign(empresa, {
      nombre: null,
      email: null,
      razon_social: null,
      telefono: null,
      direccion: null,
      paisId: null,
      estado: true,
      cuentaId: null,
    });
    obtenerEmpresas();
  } else {
    obtenerEmpresas();
  }
});

watch(dialogEmpresaEdit, (val) => {
  if (!val) {
    obtenerEmpresas();
  }
});
</script>

<style lang="scss" scoped>
.empresa-table {
  .q-table__top {
    padding: 16px;
  }

  .q-table thead th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  .q-table tbody td {
    padding: 12px 8px;
  }
}

.search-input {
  min-width: 300px;

  .q-field__control {
    border-radius: 8px;
  }
}

.q-card {
  border-radius: 12px;

  &.bg-primary {
    background: linear-gradient(
      135deg,
      var(--q-primary) 0%,
      rgba(25, 118, 210, 0.9) 100%
    );
  }
}

.q-btn {
  border-radius: 8px;
  font-weight: 500;

  &.q-btn--unelevated {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}

.q-input,
.q-select {
  .q-field__control {
    border-radius: 8px;
  }
}

.q-badge {
  border-radius: 6px;
  font-weight: 500;
  padding: 4px 8px;
}

.q-chip {
  border-radius: 6px;
}
</style>
