<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="badge" />Mantendor de Categorias
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Descripción del mantenedor de Categorias<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogCategoria = true"
          >Agregar</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Areas"
            :rows="categorias"
            :columns="columns"
            :rows-per-page-options="[10]"
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
                  @click="editarArea(props.row)"
                  flat
                />
                <q-btn
                  color="red"
                  icon="delete"
                  @click="eliminarCategoria(props.row)"
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
      <q-dialog v-model="dialogCategoria" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Agregar Nueva Categoria</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="categoria.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="categoria.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="categoria.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="categoria.areaId"
              :options="areas"
              label="Area"
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
                @click="dialogCategoria = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="crearCategoria()"
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
      <q-dialog v-model="dialogCategoriaEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar la Categoria</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="categoria.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="categoria.descripcion"
              label="Descripción"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <!-- <q-select dense v-model="categoria.estado" :options="estados" label="Estado" map-options emit-value /> -->
            <q-select
              dense
              v-model="categoria.areaId"
              :options="areas"
              label="Area"
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
                @click="dialogCategoriaEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarCategoria()"
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

<script>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
import { dataTool } from "echarts";

export default {
  data() {
    return {
      filter: "",
      dialogCategoria: false,
      cargandoIcon: false,
      dialogCategoriaEdit: false,
      areas: [],
      categorias: [],
      paises: [],
      cuentas: [],
      empresas: [],
      usuarioStore: null,
      empresaUsuario: null,
      empresasUsuario: [],
      categoria: {
        nombre: null,
        direccion: null,
        estado: true,
        areaId: null,
      },
      columns: [
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
          classes: "",
          headerClasses: "bg-primary text-white glossy",
          style: "max-width: 150px",
        },
        {
          name: "Area",
          label: "Area",
          field: (row) => (row.area ? row.area.nombre : "Sin Area"),
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
      ],
      estados: [
        { label: "Activada", value: true },
        { label: "Desactivada", value: false },
      ],
      pagination: {
        page: 1, // Página inicial
        rowsPerPage: 10, // Filas por página
      },
    };
  },
  created() {
    this.usuarioStore = useUsuariostore();
    this.cuentaId = this.usuarioStore.cuentaId;
    this.empresaUsuario = this.usuarioStore.empresa;
    if (this.usuarioStore.empresas != null) {
      this.obtenerEmpresa();
    } else {
      this.obtenerAreas();
    }
    this.obtenerCategorias();
  },
  watch: {
    dialogCategoria() {
      if (this.dialogCategoria == true) {
        let auxiliar = {
          nombre: null,
          descripcion: null,
          estado: true,
          areaId: null,
        };
        // this.obtenerEmpresa()
        this.categoria = auxiliar;
        this.obtenerCategorias();
      } else {
        this.obtenerCategorias();
      }
    },
    dialogCategoriaEdit() {
      if (this.dialogCategoriaEdit == false) {
        this.obtenerCategorias();
      } else {
        this.obtenerAreas();
      }
    },
  },
  methods: {
    async obtenerCategorias() {
      if (this.cuentaId == null) {
        const response = await api.get("/categoria");
        this.categorias = response.data;
      } else {
        if (this.empresaUsuario != null) {
          const response = await api.get("/categoria");
          this.categorias = response.data;
        }
      }
    },
    // async obtenerEmpresas() {
    //   this.empresas = [];
    //   const response = await api.get("/empresa");
    //   response.data.forEach((item) => {
    //     let dato = { value: item.id, label: item.nombre };
    //     this.empresas.push(dato);
    //   });
    // },
    async obtenerAreas() {
      this.areas = [];
      const response = await api.get("/area/empresa/" + this.empresaUsuario);
      // this.areas = response.data;
      response.data.forEach((item) => {
        let dato = { label: item.nombre, value: item.id };
        this.areas.push(dato);
      });
    },
    async obtenerEmpresa() {
      this.empresas = [];
      let item = this.usuarioStore.empresas.find(
        (empresa) => empresa.value === this.empresaUsuario
      );
      this.empresas.push(item);
    },
    async crearCategoria() {
      const response = await api.post("/categoria", this.categoria);
      this.dialogCategoria = false;
    },
    editarArea(row) {
      this.dialogCategoriaEdit = true;
      this.categoria = row;
    },
    async actualizarCategoria() {
      let id = this.categoria.id;
      delete this.categoria.id;
      delete this.categoria.area;
      delete this.categoria.eliminacion;
      const response = await api.patch("/categoria/" + id, this.categoria);
      this.dialogCategoriaEdit = false;
    },
    eliminarCategoria(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar el Categoria " + row.nombre + " ?",
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                const response = await api.delete("/categoria/" + row.id);
                this.obtenerCategorias();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar el Categoria:", error);
              }
            },
          },
          {
            label: "Cancelar",
            handler: async () => {},
          },
        ],
      });
    },
  },
};
</script>
