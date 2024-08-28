import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";

export const useUsuariostore = defineStore("usuario", {
  state: () => ({
    token: ref(useLocalStorage("token", null)),
    cuentaId: ref(useLocalStorage("cuentaId", null)),
    // empresas: ref(JSON.parse(localStorage.getItem("empresas")) || null),
    empresa: ref(useLocalStorage("empresa", null)),
  }),

  getters: {},

  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/auth", {
          email: email,
          password: password,
        });
        console.log(response.data);
        this.token = response.data.token;
        this.cuentaId = response.data.cuentaId;
        this.empresa = response.data.empresaId;
        // if (Array.isArray(response.data.empresas)) {
        //   this.empresas = response.data.empresas.map((empresa) => {
        //     return {
        //       value: empresa.id,
        //       label: empresa.nombre,
        //     };
        //   });
        //   localStorage.setItem("empresas", JSON.stringify(this.empresas));
        // } else {
        //   console.error("Empresas no es un array");
        //   this.empresas = [];
        // }
        return { estado: "OK", data: response };
      } catch (error) {
        this.logout();
        return { estado: "ERROR", data: error };
      }
    },
    async logout() {
      this.token = null;
      this.cuentaId = null;
      this.empresas = null;
      this.empresa = null;
    },
    async refreshToken() {
      try {
        const response = await api.get("/auth/check-status");
        this.token = response.data.token;
      } catch (e) {
        console.log(e);
        this.logout();
      }
    },
    setEmpresa(item) {
      this.empresa = item;
    },
  },
});
