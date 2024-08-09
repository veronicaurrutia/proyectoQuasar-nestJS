import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { ref } from "vue";
import axios from "axios";
// const response = await axios.post("http://localhost:3000/api/auth",

export const useUsuariostore = defineStore("usuario", {
  state: () => ({
    token: ref(useLocalStorage("token", null)),
  }),

  getters: {},

  actions: {
    async login(email, password) {
      try {
        const response = await api.post("/auth", {
          // const response = await axios.post("http://localhost:3000/api/auth", {
          email: email,
          password: password,
        });
        this.token = response.data.token;

        return { estado: "OK", data: response };
      } catch (error) {
        console.log(error);
        this.logout();
        return { estado: "ERROR", data: error };
      }
    },
    async logout() {
      this.token = null;
    },
    async refreshToken() {
      const headers = { Authorization: "Bearer " + this.token };
      try {
        const response = await api.get("/check-status");
        this.token = response.data.token;
      } catch (e) {
        console.log(e);
        this.logout();
      }
    },
  },
});
