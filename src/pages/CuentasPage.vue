<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="account_circle" /> Mantendor de cuentas</h3>
      Descripción del mantenedor de cuentas<br><br>
      <q-btn color="primary" class="glossy" icon="add" @click="dialogCuenta = true">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Cuentas" :rows="cuentas" :columns="columns" :filter="filter">
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
              <q-btn color="primary" icon="edit" @click="editarCuenta(props.row)" flat />
              <q-btn color="red" icon="delete" @click="eliminarCuenta(props.row)" flat />
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
    <!-- DIALOGO DE CREAR CUENTA  -->
    <q-dialog v-model="dialogCuenta" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Agregar Nueva Cuenta</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="cuenta.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="cuenta.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="cuenta.telefono" label="Telefono" stack-label dense lazy-rules color="primary" />
          <q-input v-model="cuenta.direccion" label="Dirección" stack-label dense lazy-rules color="primary" />
          <!-- <q-select dense v-model="cuenta.estado" :options="estados" label="Estado" map-options emit-value /> -->
          <q-select dense v-model="cuenta.paisId" :options="paises" label="País" emit-value map-options />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogCuenta = false" />
            <q-btn label="Confirmar" color="primary" @click="crearCuenta()" :disable="!puedeConfirmar" />
          </template>
          <template v-if="cargandoIcon">
            <span color="primary">Registrando...</span>
            <q-spinner-hourglass color="primary" size="2em" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- DIALOGO DE EDITAR CUENTA  -->
    <q-dialog v-model="dialogCuentaEdit" persistent>
      <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar square icon="domain" color="primary" text-color="white" />
          <span class="q-ml-sm">Modificar Cuenta</span>
        </q-card-section>
        <q-card-section>
          <q-input v-model="cuenta.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
          <q-input v-model="cuenta.email" label="Correo" stack-label dense lazy-rules color="primary" />
          <q-input v-model="cuenta.telefono" label="Telefono" stack-label dense lazy-rules color="primary" />
          <q-input v-model="cuenta.direccion" label="Dirección" stack-label dense lazy-rules color="primary" />
          <!-- <q-select dense v-model="cuenta.estado" :options="estados" label="Estado" map-options emit-value /> -->
          <q-select dense v-model="cuenta.paisId" :options="paises" label="País" map-options emit-value />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogCuentaEdit = false" />
            <q-btn label="Confirmar" color="primary" @click="actualizarCuenta()" :disable="!puedeConfirmar" />
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

export default {
  data() {
    return {
      filter: "",
      dialogCuenta: false,
      dialogCuentaEdit: false,
      cargandoIcon: false,
      cuentas: [],
      paises: [],
      cuenta: {
        nombre: null,
        email: null,
        telefono: null,
        direccion: null,
        paisId: null,
        estado: true,
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
          name: "telefono",
          label: "Telefono",
          field: "telefono",
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
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions', headerClasses: "bg-primary text-white glossy" }
      ],
      estados: [
        { label: "Activada", value: true },
        { label: "Desactivada", value: false },
      ],
    }
  },
  created() {
    this.obtenerPaises();
    this.obtenerCuentas();

  },
  computed: {
    puedeConfirmar() {
      return (
        this.cuenta.nombre &&
        this.cuenta.email &&
        this.cuenta.telefono &&
        this.cuenta.direccion &&
        this.cuenta.paisId &&
        this.cuenta.estado
      );
    }
  },
  watch: {
    dialogCuenta() {
      if (this.dialogCuenta == true) {
        let auxiliar = {
          nombre: null,
          email: null,
          telefono: null,
          direccion: null,
          paisId: null,
          estado: true,
        }
        this.cuenta = auxiliar
        this.obtenerCuentas()
      } else {
        this.obtenerCuentas()
      }
    }
  },
  methods: {
    async obtenerPaises() {
      const response = await api.get("/pais");
      response.data.forEach((item) => {
        let dato = {
          value: item.id, label: item.nombre + " [" + item.codigo + "]"
        }
        this.paises.push(dato)
      })
    },
    async obtenerCuentas() {
      this.cuentas = [];
      const response = await api.get("/cuenta");
      this.cuentas = response.data
    },
    async crearCuenta() {
      const response = await api.post("/cuenta", this.cuenta)
      console.log(response.status)
      this.dialogCuenta = false;
    },
    editarCuenta(row) {
      console.log("Editing row:", row);
      this.cuenta = row;
      this.dialogCuentaEdit = true;
    },
    eliminarCuenta(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar la cuenta " + row.nombre + " ?",
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                const response = await api.delete("/cuenta/" + row.id)
                this.obtenerCuentas();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar la cuenta:", error);
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
    },
    async actualizarCuenta() {
      let id = this.cuenta.id;
      delete this.cuenta.id;
      delete this.cuenta.empresas;
      const response = await api.patch("/cuenta/" + id, this.cuenta)
      console.log(response)
      this.dialogCuentaEdit = false
      this.obtenerCuentas();
    }
  }
}
</script>
