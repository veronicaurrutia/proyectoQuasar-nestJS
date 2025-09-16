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
    usuario: ref(useLocalStorage("usuario", null)),
    area: ref(useLocalStorage("area", null)),
    perfil: ref(useLocalStorage("perfil", null)),
    perfilArea: ref(useLocalStorage("perfilArea", null)),
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
        this.usuario = response.data.id;
        this.area = response.data.areaId;
        this.perfilArea = response.data.perfilesPorArea;
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
    setArea(item) {
      this.area = item;
    },
    setPerfil(item) {
      this.perfil = item;
    },
  },
});
