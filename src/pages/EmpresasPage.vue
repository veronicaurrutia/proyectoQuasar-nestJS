<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="domain" /> Mantendor de empresas</h3>
      Descripción del mantenedor de empresas<br><br>
      <q-btn color="primary" class="glossy" icon="add">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Empresas" :rows="[]" :columns="[]" />
      </div>
    </q-card>
  </div>
</template>
