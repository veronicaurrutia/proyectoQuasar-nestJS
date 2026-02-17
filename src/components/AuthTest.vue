<template>
  <div class="auth-test">
    <h3>Auth Test</h3>

    <div class="form-row">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
    </div>

    <div class="form-row">
      <input v-model="nombre" placeholder="Nombre (register)" />
      <input v-model="apellido" placeholder="Apellido (register)" />
    </div>

    <div class="buttons">
      <button @click="onRegister" :disabled="loading">Register</button>
      <button @click="onLogin" :disabled="loading">Login</button>
      <button @click="onGetUsers" :disabled="loading">Get Users</button>
    </div>

    <div class="result">
      <p v-if="loading">Cargando...</p>
      <pre v-if="result">{{ result }}</pre>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';

const email = ref('vero@test.com');
const password = ref('secret123');
const nombre = ref('Vero');
const apellido = ref('Urrutia');
const loading = ref(false);
const result = ref(null);
const error = ref(null);

function clearState() {
  result.value = null;
  error.value = null;
}

async function onRegister() {
  clearState();
  loading.value = true;
  try {
    const body = {
      email: email.value,
      nombre: nombre.value,
      apellido: apellido.value,
      password: password.value,
    };
    const res = await api.post('/auth/register', body);
    result.value = JSON.stringify(res.data, null, 2);
    // store token
    localStorage.setItem('token', res.data.access_token || res.data.token);
  } catch (err) {
    error.value =
      err.response?.data?.message || err.response?.data || err.message;
  } finally {
    loading.value = false;
  }
}

async function onLogin() {
  clearState();
  loading.value = true;
  try {
    const body = { email: email.value, password: password.value };
    const res = await api.post('/auth/login', body);
    result.value = JSON.stringify(res.data, null, 2);
    localStorage.setItem('token', res.data.access_token || res.data.token);
  } catch (err) {
    error.value =
      err.response?.data?.message || err.response?.data || err.message;
  } finally {
    loading.value = false;
  }
}

async function onGetUsers() {
  clearState();
  loading.value = true;
  try {
    const res = await api.get('/users');
    result.value = JSON.stringify(res.data, null, 2);
  } catch (err) {
    error.value =
      err.response?.data?.message || err.response?.data || err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-test {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-width: 640px;
}
.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.form-row input {
  flex: 1;
  padding: 8px;
}
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
button {
  padding: 8px 12px;
  cursor: pointer;
}
.result {
  background: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
}
.error {
  color: #b00020;
}
</style>
