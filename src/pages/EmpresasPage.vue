<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="domain" /> Mantendor de empresas</h3>
      Descripción del mantenedor de empresas<br><br>
      <q-btn color="primary" class="glossy" icon="add" @click="dialogEmpresa = true">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Empresas" :rows="empresas" :columns="columns" :rows-per-page-options="[10]">
          <template v-slot:body-cell-enabledopt="props">
            <q-td :props="props" align="center">
              <q-icon :name="props.row.estado ? 'check_circle' : 'cancel'"
                :color="props.row.estado ? 'green' : 'red'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="edit" @click="editarEmpresa(props.row)" flat />
              <q-btn color="primary" icon="delete" @click="eliminarEmpresa(props.row)" flat />
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>
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
          <q-select dense v-model="empresa.paisId" :options="paises" label="País" />
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
    <q-dialog v-model="editar" persistent>
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
          <q-select dense v-model="empresa.paisId" :options="paises" label="País" />
          <q-select dense v-model="empresa.estado" :options="estados" label="Estado" />
        </q-card-section>
        <q-card-actions align="right">
          <template v-if="!cargandoIcon">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="editar = false" />
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
export default {

  data() {
    return {
      dialogEmpresa: false,
      cargandoIcon: false,
      editar: false,
      empresas: [],
      paises: [],
      empresa: {
        nombre: null,
        email: null,
        razon_social: null,
        telefono: null,
        direccion: null,
        paisId: null,
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
          name: "email",
          label: "Correo",
          field: "email",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "direccion",
          label: "Dirección",
          field: "direccion",
          align: "center",
          headerClasses: "bg-primary text-white",
        },
        {
          name: "enabledopt",
          label: "Estado",
          field: "estado",
          align: "center",
          headerClasses: "bg-primary text-white",
          format: (val) => val
            ? '<q-icon name="check_circle" color="green" />'
            : '<q-icon name="cancel" color="red" />',
        },
        {
          name: "actions",
          label: "Acciones",
          field: "actions",
          align: "center",
          headerClasses: "bg-primary text-white",
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
    this.obtenerPaises();
    this.obtenerEmpresas();

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
        }
        this.empresa = auxiliar
        this.obtenerEmpresas()
      } else {
        this.obtenerEmpresas()
      }
    },
    editar() {
      if (this.editar == false) {
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
      // console.log(this.paises[0])
    },
    async obtenerEmpresas() {
      const response = await api.get("/empresa");
      this.empresas = response.data
    },
    async crearEmpresa() {
      this.empresa.paisId = this.empresa.paisId.value
      const response = await api.post("/empresa", this.empresa)
      console.log(response)
      this.dialogEmpresa = false;
    },
    editarEmpresa(row) {
      this.editar = true;
      this.empresa = row;
    },
    async actualizarEmpresa() {
      this.empresa.paisId = this.empresa.paisId.value
      this.empresa.estado = this.empresa.estado.value
      let id = this.empresa.id
      delete this.empresa.id
      const response = await api.patch("/empresa/" + id, this.empresa)
      console.log(response)
      this.editar = false;
    },
    eliminarEmpresa(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "quieres eliminar la Cuenta?",
        actions: [
          {
            label: "Eliminar",
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