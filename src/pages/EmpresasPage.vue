<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="domain" />Mantendor de Empresas
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de empresas<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogEmpresa = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Empresas"
            :rows="empresas"
            :columns="columns"
            :filter="filter"
          >
            <template v-slot:body-cell-index="props">
              <q-td :props="props" align="center">
                {{ props.pageIndex + 1 }}
              </q-td>
            </template>
            <template v-slot:body-cell-enabledopt="props">
              <q-td :props="props" align="center">
                <q-icon
                  :name="props.row.estado ? 'check_circle' : 'cancel'"
                  :color="props.row.estado ? 'green' : 'red'"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  color="primary"
                  icon="edit"
                  @click="editarEmpresa(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarEmpresa(props.row)"
                  flat
                />
              </q-td>
            </template>
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
                style="
                  border: 1px solid #bbb;
                  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.28);
                  border-radius: 6px;
                "
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
      </q-card>
      <!-- DIALOGO CREAR EMPRESA -->
      <q-dialog v-model="dialogEmpresa" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nueva Empresa</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="empresa.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="empresa.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="empresa.razon_social"
              label="Razón Social"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="empresa.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="empresa.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="empresa.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="empresa.paisId"
              :options="paises"
              label="País"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="empresa.cuentaId"
              :options="cuentas"
              label="Cuenta"
              map-options
              emit-value
            />
          </q-card-section>
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                v-close-popup
                @click="dialogEmpresa = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="crearEmpresa()"
              />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO EDITAR EMPRESA -->
      <q-dialog v-model="dialogEmpresaEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar la Empresa</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="empresa.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="empresa.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="empresa.razon_social"
              label="Razón Social"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="empresa.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="empresa.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="empresa.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="empresa.paisId"
              :options="paises"
              label="País"
              map-options
              emit-value
            />
          </q-card-section>
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn
                flat
                label="Cancelar"
                color="primary"
                v-close-popup
                @click="dialogEmpresaEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarEmpresa()"
              />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
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
  empresa.paisId = empresa.paisId.value;
  await api.post("/empresa", empresa);
  dialogEmpresa.value = false;
  obtenerEmpresas();
};

const editarEmpresa = (row) => {
  dialogEmpresaEdit.value = true;
  Object.assign(empresa, row);
};

const actualizarEmpresa = async () => {
  const id = empresa.id;
  const payload = { ...empresa };
  delete payload.id;
  delete payload.cuenta;
  delete payload.eliminacion;

  await api.patch("/empresa/" + id, payload);
  dialogEmpresaEdit.value = false;
  obtenerEmpresas();
};

const eliminarEmpresa = (row) => {
  Notify.create({
    timeout: 0,
    message: "¿Desea eliminar la empresa " + row.nombre + " ?",
    actions: [
      {
        label: "Eliminar",
        color: "red",
        handler: async () => {
          await api.delete("/empresa/" + row.id);
          obtenerEmpresas();
        },
      },
      {
        label: "Cancelar",
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
