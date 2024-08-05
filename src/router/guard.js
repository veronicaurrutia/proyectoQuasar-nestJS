import { useUsuariostore } from "src/stores/usuario.store";

const guard = (to, from, next) => {
  const usuarioStore = useUsuariostore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!usuarioStore.isLoggedIn) {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    next();
  }
};

export default guard;
