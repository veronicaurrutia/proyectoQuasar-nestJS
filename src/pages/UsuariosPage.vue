<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="group" /> Mantendor de usuarios</h3>
      Descripción del mantenedor de usuarios<br><br>
      <q-btn color="primary" class="glossy" icon="add">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Usuarios" :rows="[]" :columns="[]" />
      </div>
    </q-card>
  </div>
</template>
