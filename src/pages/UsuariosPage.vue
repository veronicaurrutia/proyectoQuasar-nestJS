<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white "> <q-icon name="group" />Mantendor de Usuarios</h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de usuarios<br><br>
        <q-btn color="primary" class="glossy" icon="add" @click="dialogUsuario = true">Agregar</q-btn>
        <div class=" q-mt-md">
          <q-table bordered title="Usuarios" :rows="usuarios" :columns="columns" :filter="filter">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
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
                <q-btn color="primary" icon="edit" @click="editarUsuario(props.row)" flat />
                <q-btn color="red" icon="delete" @click="eliminarUsuario(props.row)" flat />
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
            <q-select dense v-if="cuentaId == null" v-model="usuario.cuentaId" :options="cuentas" label="Cuenta"
              map-options emit-value />
            <q-select dense v-if="usuario.cuentaId != null" v-model="usuario.empresasId" :options="empresas"
              label="Empresa" map-options emit-value multiple use-chips />
            <q-select dense v-if="usuario.empresasId != null" v-model="usuario.centroId" :options="centros"
              label="Centro" map-options emit-value />


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

      <q-dialog v-model="dialogUsuarioEdit" persistent>
        <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
          <q-card-section class="row items-center">
            <q-avatar square icon="group" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar Usuario</span>
          </q-card-section>
          <q-card-section>
            <q-input v-model="usuario.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
            <q-input v-model="usuario.apellido" label="Apellido" lazy-rules stack-label dense color="primary" />
            <q-input v-model="usuario.email" label="Correo" stack-label dense lazy-rules color="primary" />
            <q-input v-model="usuario.password" label="Password" stack-label dense lazy-rules color="primary" />
            <q-select dense v-if="cuentaId == null" v-model="usuario.cuentaId" :options="cuentas" label="Cuenta"
              map-options emit-value />
            <q-select dense v-if="usuario.cuentaId != null" v-model="usuario.empresasId" :options="empresas"
              label="Empresa" map-options emit-value multiple use-chips />
            <q-select dense v-if="usuario.empresasId != null" v-model="usuario.centroId" :options="centros"
              label="Centro" map-options emit-value />


          </q-card-section>
          <q-card-actions align="right">
            <template v-if="!cargandoIcon">
              <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogUsuarioEdit = false" />
              <q-btn label="Confirmar" color="primary" @click="actualizarUsuario()" />
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

<script>
import { api } from "src/boot/axios";
import { useUsuariostore } from "src/stores/usuario.store";
import { Notify } from "quasar";

export default {

  data() {
    return {
      filter: "",
      dialogUsuario: false,
      dialogUsuarioEdit: false,
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
          headerClasses: "bg-primary glossy text-white",
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
          name: "cuenta",
          label: "Cuenta",
          field: row => row.cuenta ? row.cuenta.nombre : "Sin cuenta",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "empresa",
          label: "Empresa",
          field: row => row.empresa ? row.empresa.nombre : "Sin Empresa",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "centro",
          label: "Centro",
          field: row => row.centro ? row.centro.nombre : "Sin centro",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "enabledopt",
          label: "Estado",
          field: "enabledopt",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions', headerClasses: "bg-primary text-white glossy" }
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
          empresasId: null,
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
      console.log(this.usuarios)
    },
    async crearUsuario() {
      const response = await api.post("/usuario", this.usuario)
      this.dialogUsuario = false;
    },
    editarUsuario(row) {
      this.dialogUsuarioEdit = true;
      this.usuario = row;
    },
    async actualizarUsuario() {
      let id = this.usuario.id
      delete this.usuario.id
      delete this.usuario.cuenta
      delete this.usuario.empresa
      delete this.usuario.centro
      delete this.usuario.eliminacion
      const response = await api.patch("/usuario/" + id, this.usuario)
      this.dialogUsuarioEdit = false;
    },
    async obtenerEmpresasCuenta(valor) {
      const response = await api.get("/empresa/cuenta/" + valor)
      response.data.forEach((item) => {
        let dato = { value: item.id, label: item.nombre }
        this.empresas.push(dato)
      })
    },
    async obtenerCentrosEmpresa(valor) {
      this.centros = []
      console.log(valor)
      const response = await api.get("centro/empresa/" + valor)
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
    },
    async eliminarUsuario(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar el usuario " + row.nombre + " " + row.apellido + " ?",
        //color: "red",
        actions: [
          {
            label: "Eliminar",
            color: "red",
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
            },
          },
        ],
      });
    }
  }
}
</script>
