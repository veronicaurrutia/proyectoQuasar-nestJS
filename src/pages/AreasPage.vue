<template>
  <div>
    <q-card class="q-ma-md q-pa-md" elevation="13">
      <h3> <q-icon name="badge" /> Mantendor de areas</h3>
      Descripción del mantenedor de areas<br><br>
      <q-btn color="primary" class="glossy" icon="add">Agregar</q-btn>
      <div class=" q-mt-md">
        <q-table bordered title="Areas" :rows="[]" :columns="[]" />
      </div>
    </q-card>
  </div>
</template>
