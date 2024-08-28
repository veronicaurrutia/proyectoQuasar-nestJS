<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="warehouse" /> Mantendor de Centros</h3>
      Descripción del mantenedor de centros<br><br>
      <q-btn color="primary" class="glossy" icon="add" @click="dialogCentro = true">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Centros" :rows="centros" :columns="columns" :rows-per-page-options="[10]"
          :filter="filter">
          <template v-slot:body-cell-index="props">
            <q-td :props="props" align="center">
              {{ props.pageIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-enabledopt="props">
            <q-td :props="props" align="center">
              <q-icon :name="props.row.estado ? 'check_circle' : 'cancel'"
                :color="props.row.estado ? 'green' : 'red'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="edit" @click="editarCentro(props.row)" flat />
              <q-btn color="red" icon="delete" @click="eliminarCentro(props.row)" flat />
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
    <q-dialog v-model="dialogCentro" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Agregar Nueva Centro</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="centro.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="centro.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="centro.telefono" label="Telefono" stack-label dense lazy-rules color="primary" />
          <q-input v-model="centro.direccion" label="Dirección" stack-label dense lazy-rules color="primary" />
          <q-select dense v-model="centro.estado" :options="estados" label="Estado" map-options emit-value />
          <q-select dense v-model="centro.paisId" :options="paises" label="País" map-options emit-value />
          <q-select dense v-model="centro.cuentaEmpresaId" :options="empresas" label="Empresa" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogCentro = false" />
            <q-btn label="Confirmar" color="primary" @click="crearCentro()" />
          </template>
          <template v-if="cargandoIcon">
            <span color="primary">Registrando...</span>
            <q-spinner-hourglass color="primary" size="2em" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO EDITAR EMPRESA -->
    <q-dialog v-model="dialogCentroEdit" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Modificar la Centro</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="centro.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="centro.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="centro.telefono" label="Telefono" stack-label dense lazy-rules color="primary" />
          <q-input v-model="centro.direccion" label="Dirección" stack-label dense lazy-rules color="primary" />
          <q-select dense v-model="centro.estado" :options="estados" label="Estado" map-options emit-value />
          <q-select dense v-model="centro.paisId" :options="paises" label="País" map-options emit-value />
          <q-select dense v-model="centro.cuentaEmpresaId" :options="empresas" label="Empresa" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogCentroEdit = false" />
            <q-btn label="Confirmar" color="primary" @click="actualizarCentro()" />
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
      dialogCentro: false,
      cargandoIcon: false,
      dialogCentroEdit: false,
      centros: [],
      paises: [],
      cuentas: [],
      empresas: [],
      centro: {
        nombre: null,
        direccion: null,
        email: null,
        telefono: null,
        estado: null,
        cuentaEmpresaId: null,
        paisId: null,
      },
      columns: [
        {
          name: 'index', label: '#', headerClasses: "bg-primary text-white glossy", align: 'center', field: row => row.id
        },
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
          name: "Empresa",
          label: "Empresa",
          field: row => row.cuentaEmpresa ? row.cuentaEmpresa.nombre : "Sin Empresa",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "País",
          label: "País",
          field: row => row.pais ? row.pais.nombre : "Sin País",
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
      empresaId: null,
    }
  },
  created() {
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    this.empresaId = usuarioStore.empresa;
    this.obtenerPaises();
    this.obtenerCentros();
  },
  watch: {
    dialogCentro() {
      if (this.dialogCentro == true) {
        let auxiliar = {
          nombre: null,
          direccion: null,
          email: null,
          telefono: null,
          estado: null,
          cuentaEmpresaId: null,
          paisId: null,
        }
        this.obtenerEmpresas()
        this.centro = auxiliar
        this.obtenerCentros()
      } else {
        this.obtenerCentros()
      }
    },
    dialogCentroEdit() {
      if (this.dialogCentroEdit == false) {
        this.obtenerCentros()
      } else {
        this.obtenerEmpresas()
      }
    }
  },
  methods: {
    async obtenerPaises() {
      const response = await api.get("pais");
      response.data.forEach((item) => {
        let dato = {
          value: item.id, label: item.nombre + " [" + item.codigo + "]"
        }
        this.paises.push(dato)
      })
    },
    async obtenerCentros() {
      if (this.empresaId == null) {
        const response = await api.get("/centro");
        this.centros = response.data
      } else {
        const response = await api.get("/centro/empresa/" + this.empresaId)
        this.centros = response.data
      }
      console.log(this.centros)
    },
    async obtenerEmpresas() {
      this.empresas = []
      if (this.cuentaId == null) {
        const response = await api.get("/empresa");
        response.data.forEach((item) => {
          let dato = {
            value: item.id, label: item.nombre
          }
          this.empresas.push(dato)
        })
      } else {
        const response = await api.get("/empresa/cuenta/" + this.cuentaId)
        response.data.forEach((item) => {
          let dato = {
            value: item.id, label: item.nombre
          }
          this.empresas.push(dato)
        })
      }
    },
    async crearCentro() {
      const response = await api.post("/centro", this.centro)
      console.log(response)
      this.dialogCentro = false;
    },
    editarCentro(row) {
      this.dialogCentroEdit = true;
      console.log(row)
      this.centro = row;
    },
    async actualizarCentro() {
      let id = this.centro.id
      delete this.centro.id
      delete this.centro.cuentaEmpresa
      delete this.centro.pais
      delete this.centro.eliminacion
      const response = await api.patch("/centro/" + id, this.centro)
      console.log(response)
      this.dialogCentroEdit = false;
    },
    eliminarCentro(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar el centro " + row.nombre + " ? ",
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                const response = await api.delete("/centro/" + row.id)
                this.obtenerCentros();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar el Centro:", error);
              }
            },
          },
          {
            label: "Cancelar",
            handler: async () => {
              console.log("Eliminación cancelada");
            },
          },
        ],
      });
    }
  }
}
</script>
