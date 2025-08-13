<template>
  <q-card class="q-pa-md bordes">
    <q-card-section horizontal>
      <div class="text-h6 text-weight-bolder">
        Porcentaje de Requerimientos por Categoria
      </div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <div
        ref="grafico"
        id="grafico"
        style="height: 400px; min-width: 400px"
      ></div>
    </q-card-section>
    <q-resize-observer @resize="onResize" />
  </q-card>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      options: {},
    };
  },
  created() {},
  watch: {},
  methods: {
    montarGrafico(datos) {
      // this.options.series[0].data = []

      if (datos) {
        let data = [];
        datos.forEach((item) => {
          let dato = { name: item.categoriaNombre, value: item.count };
          data.push(dato);
        });
        this.options = {
          series: [
            {
              type: "pie",
              data: data,
              radius: "50%",
            },
          ],
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
        };
        this.init();
      } else {
        console.log("undefined");
      }
    },
    init() {
      console.log(this.options);
      let pieChart = document.getElementById("grafico");
      echarts.dispose(pieChart);
      let theme = this.model ? "dark" : "light";
      this.pie_chart = echarts.init(pieChart, theme);
      this.pie_chart.setOption(this.options);
    },
    onResize() {
      if (this.pie_chart) {
        this.pie_chart.resize();
      }
    },
  },
};
</script>
