<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center" style="min-height: 100vh">
        <div class="text-center">
          <q-icon name="home" size="64px" color="primary" />
          <h2>Bienvenido a la página de inicio</h2>
          <p>Desde aquí puedes navegar a otras secciones de la aplicación.</p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "HomePage",
});
// No se requiere lógica adicional por ahora
</script>

<style scoped>
h2 {
  margin-top: 16px;
  margin-bottom: 8px;
}
</style>
