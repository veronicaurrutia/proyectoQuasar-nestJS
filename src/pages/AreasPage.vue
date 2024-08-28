<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="domain" /> Mantendor de Areas</h3>
      Descripción del mantenedor de areas<br><br>
      <q-btn color="primary" class="glossy" icon="add" @click="dialogArea = true">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Areas" :rows="areas" :columns="columns" :rows-per-page-options="[10]" :filter="filter">
          <template v-slot:body-cell-enabledopt="props">
            <q-td :props="props" align="center">
              <q-icon :name="props.row.estado ? 'check_circle' : 'cancel'"
                :color="props.row.estado ? 'green' : 'red'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="edit" @click="editarArea(props.row)" flat />
              <q-btn color="red" icon="delete" @click="eliminarArea(props.row)" flat />
            </q-td>
          </template>
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
    </q-card>
    <!-- DIALOGO CREAR EMPRESA -->
    <q-dialog v-model="dialogArea" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Agregar Nueva Area</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="area.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="area.descripcion" label="Descripción" stack-label dense lazy-rules color="primary" />
          <q-input v-model="area.prefijo" label="prefijo" stack-label dense lazy-rules color="primary" />
          <!-- <q-select dense v-model="area.estado" :options="estados" label="Estado" map-options emit-value /> -->
          <q-select dense v-model="area.empresaId" :options="empresas" label="Empresa" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogArea = false" />
            <q-btn label="Confirmar" color="primary" @click="crearArea()" />
          </template>
          <template v-if="cargandoIcon">
            <span color="primary">Registrando...</span>
            <q-spinner-hourglass color="primary" size="2em" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO EDITAR EMPRESA -->
    <q-dialog v-model="dialogAreaEdit" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Modificar la Area</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="area.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="area.descripcion" label="Descripción" stack-label dense lazy-rules color="primary" />
          <q-input v-model="area.prefijo" label="prefijo" stack-label dense lazy-rules color="primary" />
          <!-- <q-select dense v-model="area.estado" :options="estados" label="Estado" map-options emit-value /> -->
          <q-select dense v-model="area.empresaId" :options="empresas" label="Empresa" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogAreaEdit = false" />
            <q-btn label="Confirmar" color="primary" @click="actualizarArea()" />
          </template>
          <template v-if="cargandoIcon">
            <span color="primary">Registrando...</span>
            <q-spinner-hourglass color="primary" size="2em" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

export default {

  data() {
    return {
      filter: "",
      dialogArea: false,
      cargandoIcon: false,
      dialogAreaEdit: false,
      areas: [],
      paises: [],
      cuentas: [],
      empresas: [],
      usuarioStore: null,
      empresaUsuario: null,
      empresasUsuario: [],
      area: {
        nombre: null,
        direccion: null,
        prefijo: null,
        estado: true,
        empresaId: null,
      },
      columns: [
        {
          name: "nombre",
          required: true,
          label: "Nombre",
          align: "left",
          field: (row) => row.nombre,
          format: (val) => `${val}`,
          classes: "",
          headerClasses: "bg-primary text-white glossy",
          style: "max-width: 150px",
        },
        {
          name: "prefijo",
          label: "Prefijo",
          field: "prefijo",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },

        {
          name: "Empresa",
          label: "Empresa",
          field: row => row.empresa ? row.empresa.nombre : "Sin Empresa",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "enabledopt",
          label: "Estado",
          field: "estado",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
          format: (val) => val
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
      ],
      estados: [
        { label: "Activada", value: true },
        { label: "Desactivada", value: false },
      ],
      pagination: {
        page: 1, // Página inicial
        rowsPerPage: 10, // Filas por página
      },
    }
  },
  created() {
    this.usuarioStore = useUsuariostore();
    this.cuentaId = this.usuarioStore.cuentaId;
    this.empresaUsuario = this.usuarioStore.empresa
    if (this.usuarioStore.empresas != null) {
      this.obtenerEmpresa()
    }
    else {
      this.obtenerEmpresas()
    }
    this.obtenerAreas();
  },
  watch: {
    dialogArea() {
      if (this.dialogArea == true) {
        let auxiliar = {
          nombre: null,
          descripcion: null,
          prefijo: null,
          estado: true,
          empresaId: null,
        }
        // this.obtenerEmpresa()
        this.area = auxiliar
        this.obtenerAreas()
      } else {
        this.obtenerAreas()
      }
    },
    dialogAreaEdit() {
      if (this.dialogAreaEdit == false) {
        this.obtenerAreas()
      } else {
        this.obtenerEmpresas()
      }
    }
  },
  methods: {
    async obtenerAreas() {
      if (this.cuentaId == null) {
        const response = await api.get("/area");
        this.areas = response.data
      } else {
        if (this.empresaUsuario != null) {
          const response = await api.get("/area/empresa/" + this.empresaUsuario)
          this.areas = response.data
        }
      }
    },
    async obtenerEmpresas() {
      this.empresas = []
      const response = await api.get("/empresa")
      response.data.forEach((item) => {
        let dato = { value: item.id, label: item.nombre }
        this.empresas.push(dato)
      })
    },
    async obtenerEmpresa() {
      this.empresas = [];
      let item = this.usuarioStore.empresas.find(empresa => empresa.value === this.empresaUsuario)
      this.empresas.push(item)
    },
    async crearArea() {
      const response = await api.post("/area", this.area)
      this.dialogArea = false;
    },
    editarArea(row) {
      this.dialogAreaEdit = true;
      this.area = row;
    },
    async actualizarArea() {
      let id = this.area.id
      delete this.area.id
      delete this.area.empresa
      delete this.area.eliminacion
      const response = await api.patch("/area/" + id, this.area)
      this.dialogAreaEdit = false;
    },
    eliminarArea(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar el Area " + row.nombre + " ?",
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                const response = await api.delete("/area/" + row.id)
                this.obtenerAreas();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar el Area:", error);
              }
            },
          },
          {
            label: "Cancelar",
            handler: async () => {
            },
          },
        ],
      });
    }
  }
}
</script>
