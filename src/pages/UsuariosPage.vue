<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="group" /> Mantendor de usuarios</h3>
      Descripción del mantenedor de usuarios<br><br>
      <q-btn color="primary" class="glossy" icon="add" @click="dialogUsuario = true">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Usuarios" :rows="usuarios" :columns="columns">
          <template v-slot:body-cell-enabledopt="props">
            <q-td :props="props" align="center">
              <q-icon :name="props.row.estado ? 'check_circle' : 'cancel'"
                :color="props.row.estado ? 'green' : 'red'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="edit" @click="editarUsuario(props.row)" flat />
              <q-btn color="primary" icon="delete" @click="eliminarUsuario(props.row)" flat />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>
    <q-dialog v-model="dialogUsuario" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="group" color="primary" text-color="white" />
          <span class="q-ml-sm">Agregar Nuevo Usuario</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="usuario.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="usuario.apellido" label="Apellido" lazy-rules stack-label dense color="primary" />
          <q-input v-model="usuario.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="usuario.password" label="Password" stack-label dense lazy-rules color="primary" />
          <q-select dense v-if="cuentaId == null" v-model="usuario.cuentaId" :options="cuentas" label="Cuenta" />
          <!-- <q-select dense v-else readonly v-model="usuario.cuentaId" :options="cuentas" label="Cuenta" /> -->
          <q-select dense v-if="cuentaId" v-model="usuario.empresasId" :options="empresas" label="Empresa" />
          <q-select dense v-if="usuario.empresasId != null" v-model="usuario.centroId" :options="centros"
            label="Centro" />


        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogUsuario = false" />
            <q-btn label="Confirmar" color="primary" @click="crearUsuario()" />
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
import { useUsuariostore } from "src/stores/usuario.store";

export default {

  data() {
    return {
      dialogUsuario: false,
      cargandoIcon: false,
      cuentaId: null,
      usuarios: [],
      cuentas: [],
      empresas: [],
      centros: [],
      usuario: {
        nombre: null,
        apellido: null,
        email: null,
        password: null,
        centroId: null,
        cuentaId: null,
        empresasId: null,
        estado: true,
      },
      columns: [
        // {
        //   name: "ID",
        //   required: true,
        //   label: "ID",
        //   align: "left",
        //   field: (row) => row.id,
        //   format: (val) => `${val}`,
        //   sortable: true,
        //   classes: "",
        //   headerClasses: "bg-primary text-white",
        //   style: "max-width: 150px",
        // },
        {
          name: "nombre",
          required: true,
          label: "Nombre",
          align: "left",
          field: (row) => row.nombre,
          format: (val) => `${val}`,
          classes: "",
          headerClasses: "bg-primary text-white",
          style: "max-width: 150px",
        },
        {
          name: "apellido",
          required: true,
          label: "Apellido",
          align: "left",
          field: (row) => row.apellido,
          format: (val) => `${val}`,
          classes: "",
          headerClasses: "bg-primary text-white",
          style: "max-width: 150px",
        },
        {
          name: "email",
          label: "Correo",
          field: "email",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "cuenta",
          label: "Cuenta",
          field: "cuentaId",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "centro",
          label: "Centro",
          field: "centroId",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "enabledopt",
          label: "Estado",
          field: "enabledopt",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        { name: 'actions', label: 'Actions', align: 'center', field: 'actions', headerClasses: "bg-primary text-white" }
      ],
    }
  },
  created() {
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    if (this.cuentaId == null) {
      this.obtenerCuentas();
    } else {
      this.obtenerCuentaUser();
    }
    this.obtenerUsuarios();

  },
  watch: {
    dialogUsuario() {
      if (this.dialogUsuario == true) {
        let auxiliar = {
          nombre: null,
          email: null,
          apellido: null,
          password: null,
          estado: true,
          cuentaId: null,
          empresaSId: null,
          centroId: null,
        }
        this.usuario = auxiliar
        this.obtenerUsuarios()
      } else {
        this.obtenerUsuarios()
      }
    },
    'usuario.cuentaId'(valor) {
      if (valor != null) {
        this.obtenerEmpresasCuenta(valor);
      }
    },
    "usuario.empresasId"(valor) {
      if (valor != null) {
        this.obtenerCentrosEmpresa(valor);
      }
    }
  },
  methods: {
    async obtenerCuentas() {
      const response = await api.get("/cuenta");
      response.data.forEach((item) => {
        let dato = {
          value: item.id, label: item.nombre
        }
        this.cuentas.push(dato)
      })
    },
    async obtenerUsuarios() {
      const response = await api.get("/usuario");
      this.usuarios = response.data
    },
    async crearUsuario() {
      this.usuario.cuentaId = this.usuario.cuentaId.value
      let emp = this.usuario.empresasId.value.toString()
      this.usuario.empresasId = []
      this.usuario.empresasId.push(emp)
      this.usuario.centroId = this.usuario.centroId.value
      const response = await api.post("/usuario", this.usuario)
      this.dialogUsuario = false;
    },
    editarUsuario(row) {
      console.log("Editing row:", row);
    },
    async obtenerEmpresasCuenta(valor) {
      const response = await api.get("/empresa/cuenta/" + valor.value)
      response.data.forEach((item) => {
        let dato = { value: item.id, label: item.nombre }
        this.empresas.push(dato)
      })
    },
    async obtenerCentrosEmpresa(valor) {
      const response = await api.get("centro/empresa/" + valor.value)
      response.data.forEach((item) => {
        let dato = { value: item.id, label: item.nombre }
        this.centros.push(dato)
      })
    },
    async obtenerCuentaUser() {
      const response = await api.get("/cuenta/" + this.cuentaId)
      this.cuentas = []
      let dato = { label: response.data.nombre, value: response.data.id }
      this.cuentas.push(dato);
      this.usuario.cuentaId = dato;
      console.log(this.cuentas, this.usuario.cuentaId)
    },
    async eliminarUsuario() {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "quieres eliminar el Usuario?",
        actions: [
          {
            label: "Eliminar",
            handler: async () => {
              try {
                const response = await api.delete("/usuario/" + row.id)
                this.obtenerUsuarios();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar el Usuario:", error);
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
