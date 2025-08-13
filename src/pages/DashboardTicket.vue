<template>
  <q-page>
    <div class="text-center">
      <q-card-section class="col-12 text-center">
        <h5 class="q-ma-xs text-white">
          <q-icon name="warehouse" />Dashboard Tickets
        </h5>
        <!-- <div class="text-subtitle2">by John Doe</div> -->
      </q-card-section>
    </div>
    <div>
      <q-card class="q-ma-md q-pa-md" elevation="13">
        Dashboard tickets<br /><br />
        <q-card-section>
          <div class="row justify-center">
            <div class="col-5 q-ma-md">
              <graficoCategorias ref="graficoCategorias"></graficoCategorias>
              <!-- <graficoCategorias ref="graficoCategorias" /> -->
            </div>
            <!-- <div class="col-5 q-ma-md">
              <graficoAnalistas ref="graficoAnalistas" />
            </div> -->
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";
// import graficoAnalistas from "src/dashboard/GraficoAnalista.vue";
import graficoCategorias from "src/dashboard/GraficoCategoria.vue";

export default {
  components: {
    graficoCategorias,
  },
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
      empresaId: null,
      cuentaId: null,
      areaId: null,
      ticketsCategoria: null,
    };
  },
  created() {
    const usuarioStore = useUsuariostore();
    this.cuentaId = usuarioStore.cuentaId;
    this.empresaId = usuarioStore.empresa;
    this.areaId = usuarioStore.area;
    if (this.areaId != null) {
      this.obtenerTicketsCategoria();
    }
  },
  watch: {},
  methods: {
    async obtenerTicketsCategoria() {
      const response = await api.get(
        "/ticket/area/categorias/dashboard/" + this.areaId
      );
      this.ticketsCategoria = response.data;
      if (this.ticketsCategoria != null) {
        this.$refs.graficoCategorias.montarGrafico(this.ticketsCategoria);
      }
    },
  },
};
</script>
