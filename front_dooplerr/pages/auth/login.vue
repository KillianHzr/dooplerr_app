<template>
  <div class="login-page text-white">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="text-black" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required class="text-black" />
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();
const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

const login = async () => {
  try {
    const response = await axios.post(`${urlBase}/auth/login`, {
      email: email.value,
      password: password.value,
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    window.location.href = '/';
  } catch (err) {
    error.value = 'Invalid email or password';
  }
};

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        localStorage.setItem('token', token);
        router.push('/');
    }
});
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
