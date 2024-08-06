import { useUsuariostore } from "src/stores/usuario.store";
import { Notify } from "quasar";

const authGuard = async (to, from, next) => {
  const usuarioStore = useUsuariostore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!usuarioStore.token) {
      usuarioStore.logout();
      next({ path: "/login" });
    } else {
      /*
      // agregar validacion expiracion de token, consulta api prueba token
      const payload = JSON.parse(atob(usuarioStore.token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      let timeLeft = expirationTime - currentTime;

      timeLeft = 12123;
      if (timeLeft < 5 * 60 * 1000) {
        // Si el token expira en menos de 5 minutos
        Notify.create({
          timeout: 0, //establece la
          message:
            "Tu sesión está por expirar. ¿Deseas permanecer en el sitio?",
          actions: [
            { label: "Renovar", handler: () => this.refreshToken() },
            {
              label: "Cancelar",
              handler: () => {
                usuarioStore.logout();
                //next({ path: "/login" });
              },
            },
          ],
        });
      } */
      next();
    }
  } else {
    next();
  }
};

export default authGuard;
