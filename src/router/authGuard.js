import { useUsuariostore } from "src/stores/usuario.store";
import { Notify } from "quasar";
import { useRouter } from "vue-router";

let expirationCheckInterval;

const checkTokenExpiration = (usuarioStore, Notify, next) => {
  const router = useRouter();

  if (!usuarioStore.token) {
    console.log("No hay token disponible.");
    return next({ path: "/login" });
  }
  try {
    const payload = JSON.parse(atob(usuarioStore.token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    let timeLeft = expirationTime - currentTime;

    //console.log("Tiempo restante:", timeLeft, "Tiempo crítico:", 5 * 60 * 1000);

    if (timeLeft < 5 * 60 * 1000) {
      next();
      //comprueba que le queden 5 minutos al token
      Notify.create({
        timeout: 0, // mantener la notificación hasta que haga una acción
        message: "Tu sesión está por expirar. ¿Deseas permanecer en el sitio?",
        actions: [
          {
            label: "Renovar",
            handler: async () => {
              try {
                await usuarioStore.refreshToken();
              } catch (error) {
                usuarioStore.logout();
                router.push("/login");
              }
            },
          },
          {
            label: "Cancelar",
            handler: async () => {
              await usuarioStore.logout();
              //checkTokenExpiration(usuarioStore, Notify, next);
              //return next({ path: "/login" });
              router.push("/login");
            },
          },
        ],
      });
    } else {
      return next(); // Continue navigation
    }
  } catch (error) {
    console.error("Error al procesar el token:", error);
    usuarioStore.logout();
    next({ path: "/login" });
  }
};

const startExpirationCheck = (usuarioStore, Notify) => {
  if (expirationCheckInterval) {
    clearInterval(expirationCheckInterval);
  }

  expirationCheckInterval = setInterval(() => {
    if (usuarioStore.token) {
      checkTokenExpiration(usuarioStore, Notify, () => {});
    } else {
      clearInterval(expirationCheckInterval);
    }
  }, 60 * 1000); // Check every minute
};

const stopExpirationCheck = () => {
  if (expirationCheckInterval) {
    clearInterval(expirationCheckInterval);
  }
};

const authGuard = async (to, from, next) => {
  const usuarioStore = useUsuariostore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!usuarioStore.token) {
      usuarioStore.logout();
      return next({ path: "/login" });
    } else {
      startExpirationCheck(usuarioStore, Notify);
      checkTokenExpiration(usuarioStore, Notify, next);
    }
  } else {
    stopExpirationCheck();
    return next();
  }
};

export default authGuard;
