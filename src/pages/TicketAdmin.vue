<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="local_activity" />Administración de Tickets
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        aquí podrás administrar los ticket para los requerimientos de tu Area<br /><br />
        <q-btn
          color="primary"
          class="glossy"
          icon="add"
          @click="dialogTicket = true"
          >CrearTicket?</q-btn
        >
        <div class="q-mt-md">
          <q-table
            bordered
            title="Tickets"
            :rows="tickets"
            :columns="columns"
            :rows-per-page-options="[10]"
            :filter="filter"
          >
            <template v-slot:body-cell-index="props">
              <q-td :props="props" align="center">
                {{ props.pageIndex + 1 }}
              </q-td>
            </template>
            <template v-slot:body-cell-Estado="props">
              <q-td :props="props">
                <div>
                  <q-btn-dropdown
                    dense
                    no-caps
                    class="q-ma-none q-pa-none"
                    :label="props.row.estado.nombre"
                  >
                    <q-list>
                      <template
                        v-for="(item, index) in estadosTicket"
                        :key="index"
                      >
                        <q-item
                          clickable
                          :style="item.color"
                          v-close-popup
                          @click="cambiarEstado(item, props.row)"
                        >
                          <q-item-section>
                            <q-item-label class="text-center">
                              {{ item.nombre }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-Gestor="props">
              <q-td :props="props">
                <div>
                  <q-btn-dropdown
                    dense
                    no-caps
                    class="q-ma-none q-pa-none"
                    :label="
                      props.row.usuariosGestion
                        ? props.row.usuariosGestion.email
                        : 'Sin gestor'
                    "
                  >
                    <q-list>
                      <template v-for="(item, index) in gestores" :key="index">
                        <q-item
                          clickable
                          :style="item.color"
                          v-close-popup
                          @click="cambiarGestor(item, props.row)"
                        >
                          <q-item-section>
                            <q-item-label class="text-center">
                              {{ item.email }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-btn-dropdown>
                </div>
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
            <template v-slot:body-cell-fechaCreacion="props">
              <q-td :props="props">
                {{ formatDate(props.row.fechaCreacion) }}
              </q-td>
            </template>
            <template v-slot:body-cell-fechaActualizacion="props">
              <q-td :props="props">
                {{ formatDate(props.row.fechaActualizacion) }}
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card>
      <!-- DIALOGO CREAR EMPRESA -->
      <q-dialog v-model="dialogTicket" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Nuevo Ticket</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="ticket.titulo"
              label="titulo"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="ticket.descripcion"
              label="Descripcion"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              dense
              v-model="ticket.areaId"
              :options="areas"
              label="Area"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="ticket.categoriaId"
              :options="categorias"
              label="Categoria"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="ticket.centroId"
              :options="centros"
              label="Centro"
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
                @click="dialogTicket = false"
              />
              <q-btn label="Confirmar" color="primary" @click="crearTicket()" />
            </template>
            <template v-if="cargandoIcon">
              <span color="primary">Registrando...</span>
              <q-spinner-hourglass color="primary" size="2em" />
            </template>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- DIALOGO EDITAR EMPRESA -->
      <q-dialog v-model="dialogTicketEdit" persistent>
        <q-card
          class="q-gutter-sm my-card"
          style="width: 700px; max-width: 80vw"
        >
          <q-card-section class="row items-center">
            <q-avatar square icon="domain" color="primary" text-color="white" />
            <span class="q-ml-sm">Modificar el Ticket</span>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="ticket.nombre"
              label="Nombre"
              lazy-rules
              stack-label
              dense
              color="primary"
            />
            <q-input
              v-model="ticket.email"
              label="Correo"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="ticket.telefono"
              label="Telefono"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-input
              v-model="ticket.direccion"
              label="Dirección"
              stack-label
              dense
              lazy-rules
              color="primary"
            />
            <q-select
              dense
              v-model="ticket.estado"
              :options="estados"
              label="Estado"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="ticket.paisId"
              :options="paises"
              label="País"
              map-options
              emit-value
            />
            <q-select
              dense
              v-model="ticket.cuentaEmpresaId"
              :options="empresas"
              label="Empresa"
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
                @click="dialogTicketEdit = false"
              />
              <q-btn
                label="Confirmar"
                color="primary"
                @click="actualizarTicket()"
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

export default {
  data() {
    return {
      filter: "",
      dialogTicket: false,
      estadosTicket: null,
      cargandoIcon: false,
      dialogTicketEdit: false,
      gestores: null,
      centros: [],
      areas: [],
      cuentas: [],
      empresas: [],
      categorias: [],
      tickets: [],
      usuarioId: null,
      areaId: null,
      ticket: {
        titulo: null,
        codigo: null,
        descripcion: null,
        areaId: null,
        estadoId: null,
        usuarioId: null,
        centroId: null,
        categoriaId: null,
      },
      columns: [
        {
          name: "index",
          label: "ID",
          headerClasses: "bg-primary text-white glossy",
          align: "center",
          field: (row) => row.id,
        },
        {
          name: "Titulo",
          required: true,
          label: "titulo",
          align: "left",
          field: (row) => row.titulo,
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
          name: "Categoria",
          label: "Categoria",
          field: (row) =>
            row.categoria ? row.categoria.nombre : "Sin Categoria",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "Estado",
          label: "Estado",
          field: (row) => (row.estado ? row.estado.nombre : "Sin Estado"),
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "Gestor",
          label: "Gestor",
          field: (row) =>
            row.gestionador ? row.usuariosGestion.email : "Sin Asignación",
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "Centro",
          label: "Centro",
          field: (row) => (row.centro ? row.centro.nombre : "Sin Centro"),
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "Solicitante",
          label: "Solicitante",
          field: (row) => (row.usuario ? row.usuario.email : "Sin Usuario"),
          align: "center",
          headerClasses: "bg-primary text-white glossy",
        },
        {
          name: "fechaCreacion",
          label: "Fecha Creación",
          field: (row) => row.fechaCreacion,
          align: "center",
          format: (val) => `${val}`,
          classes: "",
          headerClasses: "bg-primary text-white glossy",
          style: "max-width: 150px",
        },
        {
          name: "fechaActualizacion",
          label: "Fecha Actualización",
          field: (row) => row.fechaActualizacion,
          align: "center",
          format: (val) => `${val}`,
          classes: "",
          headerClasses: "bg-primary text-white glossy",
          style: "max-width: 150px",
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
    };
  },
  created() {
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    this.empresaId = usuarioStore.empresa;
    this.usuarioId = usuarioStore.usuario;
    this.areaId = usuarioStore.area;
    if (this.areaId != null) {
      this.obtenerTicketsAdmin();
      this.obtenerEstadosArea();
      this.obtenerGestores();
    }
    // this.obtenerMisTickets();
  },
  watch: {
    dialogTicket() {
      if (this.dialogTicket == true) {
        let auxiliar = {
          titulo: null,
          codigo: null,
          descripcion: null,
          areaId: null,
          estadoId: null,
          usuarioId: null,
          centroId: null,
          categoriaId: null,
        };
        this.ticket = auxiliar;
        this.obtenerCentros();
        this.obtenerAreas();
      }
    },
    dialogTicketEdit() {
      if (this.dialogTicketEdit == false) {
        this.obtenerCentros();
      } else {
        this.obtenerEmpresas();
      }
    },
    "ticket.areaId"(valor) {
      if (valor != null) {
        this.obtenerCategorias(valor);
      }
    },
  },
  methods: {
    async obtenerMisTickets() {
      const response = await api.get("/ticket/usuario/" + this.usuarioId);
      this.tickets = response.data;
    },
    async obtenerCentros() {
      this.centros = [];
      if (this.empresaId == null) {
        const response = await api.get("/centro");
        this.centros = response.data;
      } else {
        const response = await api.get("/centro/empresa/" + this.empresaId);
        response.data.forEach((item) => {
          let dato = { label: item.nombre, value: item.id };
          this.centros.push(dato);
        });
      }
      console.log(this.centros);
    },
    async obtenerEmpresas() {
      this.empresas = [];
      if (this.cuentaId == null) {
        const response = await api.get("/empresa");
        response.data.forEach((item) => {
          let dato = {
            value: item.id,
            label: item.nombre,
          };
          this.empresas.push(dato);
        });
      } else {
        const response = await api.get("/empresa/cuenta/" + this.cuentaId);
        response.data.forEach((item) => {
          let dato = {
            value: item.id,
            label: item.nombre,
          };
          this.empresas.push(dato);
        });
      }
    },
    async obtenerCategorias(id) {
      this.categorias = [];
      const response = await api.get("/categoria/area/" + id);
      // this.categorias = response.data;
      response.data.forEach((item) => {
        let dato = { label: item.nombre, value: item.id };
        this.categorias.push(dato);
      });
    },
    async obtenerAreas() {
      this.areas = [];
      const response = await api.get("/area/empresa/" + this.empresaId);
      // this.areas = response.data;
      response.data.forEach((item) => {
        let dato = { label: item.nombre, value: item.id };
        this.areas.push(dato);
      });
    },
    async crearTicket() {
      this.ticket.usuarioId = this.usuarioId;
      this.ticket.estadoId = 6;
      const response = await api.post("/ticket", this.ticket);
      console.log(response);
      this.dialogTicket = false;
    },
    ediarTicket(row) {
      this.dialogTicketEdit = true;
      console.log(row);
      this.ticket = row;
    },
    async actualizarTicket() {
      let id = this.ticket.id;
      delete this.ticket.id;
      delete this.ticket.cuentaEmpresa;
      delete this.ticket.pais;
      delete this.ticket.eliminacion;
      const response = await api.patch("/ticket/" + id, this.ticket);
      console.log(response);
      this.dialogTicketEdit = false;
    },
    eliminarTicket(row) {
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "¿ Desea eliminar el ticket " + row.nombre + " ? ",
        actions: [
          {
            label: "Eliminar",
            color: "red",
            handler: async () => {
              try {
                const response = await api.delete("/ticket/" + row.id);
                this.obtenerCentros();
                // console.log(response)
              } catch (error) {
                console.error("Error al eliminar el Ticket:", error);
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
    async obtenerTicketsAdmin() {
      const response = await api.get("/ticket/area/" + this.areaId);
      this.tickets = response.data;
      this.tickets.forEach((item) => {
        console.log(item.id);
      });
    },
    async obtenerEstadosArea() {
      const response = await api.get(
        "/estados/empresa/" + this.empresaId + "/area/" + this.areaId
      );
      this.estadosTicket = response.data;
      console.log(this.estados);
    },
    async cambiarEstado(item, row) {
      let ticket = {};
      ticket.estadoId = item.id;
      const response = await api.patch("/ticket/" + row.id, ticket);
      //   console.log(response);
      if ((response.status = 200)) {
        this.obtenerTicketsAdmin();
      }
      //   console.log("cambiamos el estado del ticket", item, row);
    },
    async obtenerGestores() {
      const response = await api.get("/usuario/area/" + this.areaId);
      this.gestores = response.data;
      console.log(this.gestores);
    },
    async cambiarGestor(item, row) {
      let ticket = {};
      ticket.gestionador = item.id;
      console.log(row);
      if (row.gestionador == null) {
        ticket.estadoId = 12; // cambiar el estado a "asignado", por ahora en TI está plano
      }
      const response = await api.patch("/ticket/" + row.id, ticket);
      if (response.status == 200) {
        this.obtenerTicketsAdmin();
      }
      //   console.log("aca se cambia el gestor", item, row);
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString("es-ES", options);
    },
  },
};
</script>
