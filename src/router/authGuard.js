import { useUsuariostore } from "src/stores/usuario.store";
import { Notify } from "quasar";
import { useRouter } from "vue-router";

let expirationCheckInterval;

const redirectToLogin = (router) => {
  router.push("/login");
};

const checkTokenExpiration = (usuarioStore, Notify, router, next) => {
  if (!usuarioStore.token) {
    return next({ path: "/login" });
  }
  try {
    const payload = JSON.parse(atob(usuarioStore.token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    let timeLeft = expirationTime - currentTime;

    if (timeLeft < 5 * 60 * 1000) {
      next();
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "Tu sesión está por expirar. ¿Deseas permanecer en el sitio?",
        actions: [
          {
            label: "Permanecer",
            handler: async () => {
              try {
                await usuarioStore.refreshToken();
              } catch (error) {
                usuarioStore.logout();
                redirectToLogin(router);
              }
            },
          },
          {
            label: "Cancelar",
            handler: async () => {
              await usuarioStore.logout();
              Notify.create({
                message: "Hasta luego.",
                icon: "waving_hand",
                color: "positive",
              });
              redirectToLogin(router);
            },
          },
        ],
      });
    } else {
      return next(); // Continuar la navegación
    }
  } catch (error) {
    console.error("Error al procesar el token:", error);
    usuarioStore.logout();
    next({ path: "/login" });
  }
};

const startExpirationCheck = (usuarioStore, Notify, router, next) => {
  if (expirationCheckInterval) {
    clearInterval(expirationCheckInterval);
  }

  expirationCheckInterval = setInterval(() => {
    if (usuarioStore.token) {
      checkTokenExpiration(usuarioStore, Notify, router, next);
    } else {
      clearInterval(expirationCheckInterval);
    }
  }, 60 * 1000); // Revisar cada minuto
};

const stopExpirationCheck = () => {
  if (expirationCheckInterval) {
    clearInterval(expirationCheckInterval);
  }
};

const authGuard = async (to, from, next) => {
  const usuarioStore = useUsuariostore();
  const router = useRouter();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!usuarioStore.token) {
      usuarioStore.logout();
      return next({ path: "/login" });
    } else {
      startExpirationCheck(usuarioStore, Notify, router, next);
      checkTokenExpiration(usuarioStore, Notify, router, next);
    }
  } else {
    stopExpirationCheck();
    return next();
  }
};

export default authGuard;
