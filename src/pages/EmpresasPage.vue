<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="domain" /> Mantendor de empresas</h3>
      Descripción del mantenedor de empresas<br><br>
      <q-btn color="primary" class="glossy" icon="add" @click="dialogEmpresa = true">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Empresas" :rows="empresas" :columns="columns" :filter="filter">
          <template v-slot:body-cell-enabledopt="props">
            <q-td :props="props" align="center">
              <q-icon :name="props.row.estado ? 'check_circle' : 'cancel'"
                :color="props.row.estado ? 'green' : 'red'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="edit" @click="editarEmpresa(props.row)" flat />
              <q-btn color="red" icon="delete" @click="eliminarEmpresa(props.row)" flat />
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
    <q-dialog v-model="dialogEmpresa" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Agregar Nueva Empresa</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="empresa.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="empresa.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="empresa.razon_social" label="Razón Social" lazy-rules stack-label dense color="primary" />
          <q-input v-model="empresa.telefono" label="Telefono" stack-label dense lazy-rules color="primary" />
          <q-input v-model="empresa.direccion" label="Dirección" stack-label dense lazy-rules color="primary" />
          <!-- <q-select dense v-model="empresa.estado" :options="estados" label="Estado" map-options emit-value /> -->
          <q-select dense v-model="empresa.paisId" :options="paises" label="País" map-options emit-value />
          <q-select dense v-model="empresa.cuentaId" :options="cuentas" label="Cuenta" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogEmpresa = false" />
            <q-btn label="Confirmar" color="primary" @click="crearEmpresa()" />
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
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Modificar la Empresa</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="empresa.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="empresa.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="empresa.razon_social" label="Razón Social" lazy-rules stack-label dense color="primary" />
          <q-input v-model="empresa.telefono" label="Telefono" stack-label dense lazy-rules color="primary" />
          <q-input v-model="empresa.direccion" label="Dirección" stack-label dense lazy-rules color="primary" />
          <!-- <q-select dense v-model="empresa.estado" :options="estados" label="Estado" map-options emit-value /> -->
          <q-select dense v-model="empresa.paisId" :options="paises" label="País" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogEmpresaEdit = false" />
            <q-btn label="Confirmar" color="primary" @click="actualizarEmpresa()" />
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
      dialogEmpresa: false,
      cargandoIcon: false,
      dialogEmpresaEdit: false,
      empresas: [],
      paises: [],
      cuentas: [],
      empresa: {
        nombre: null,
        email: null,
        razon_social: null,
        telefono: null,
        direccion: null,
        paisId: null,
        estado: true,
        cuentaId: null,
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
          field: row => row.cuenta ? row.cuenta.nombre : "Sin cuenta",
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
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    this.obtenerPaises();
    this.obtenerEmpresas();
    if (this.cuentaId == null) {
      this.obtenerCuentas();
    } else {
      this.obtenerCuentaMaestra();
    }
  },
  watch: {
    dialogEmpresa() {
      if (this.dialogEmpresa == true) {
        let auxiliar = {
          nombre: null,
          email: null,
          razon_social: null,
          telefono: null,
          direccion: null,
          paisId: null,
          estado: true,
          cuentaId: null,
        }
        this.empresa = auxiliar
        this.obtenerEmpresas()
      } else {
        this.obtenerEmpresas()
      }
    },
    dialogEmpresaEdit() {
      if (this.dialogEmpresaEdit == false) {
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
    async obtenerEmpresas() {
      if (this.cuentaId == null) {
        const response = await api.get("/empresa");
        this.empresas = response.data
      } else {
        const response = await api.get("/empresa/cuenta/" + this.cuentaId)
        this.empresas = response.data
      }
    },
    async obtenerCuentas() {
      const response = await api.get("/cuenta");
      response.data.forEach((item) => {
        let dato = { value: item.id, label: item.nombre }
        this.cuentas.push(dato)
      })
    },
    async obtenerCuentaMaestra() {
      const response = await api.get("/cuenta/" + this.cuentaId)
      let dato = { value: response.data.id, label: response.data.nombre }
      this.cuentas.push(dato)
    },
    async crearEmpresa() {
      this.empresa.paisId = this.empresa.paisId.value
      const response = await api.post("/empresa", this.empresa)
      console.log(response)
      this.dialogEmpresa = false;
    },
    editarEmpresa(row) {
      this.dialogEmpresaEdit = true;
      console.log(row)
      this.empresa = row;
    },
    async actualizarEmpresa() {
      let id = this.empresa.id
      delete this.empresa.id
      delete this.empresa.cuenta
      const response = await api.patch("/empresa/" + id, this.empresa)
      console.log(response)
      this.dialogEmpresaEdit = false;
    },
    eliminarEmpresa(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar la empresa " + row.nombre + " ?",
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                const response = await api.delete("/empresa/" + row.id)
                this.obtenerEmpresas();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar la Empresa:", error);
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
