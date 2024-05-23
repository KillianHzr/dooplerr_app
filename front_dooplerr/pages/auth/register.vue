<template>
  <div class="register-page text-white">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" required class="text-black" />
      </div>
      <div>
        <label for="firstname">First Name:</label>
        <input type="text" v-model="firstname" required class="text-black" />
      </div>
      <div>
        <label for="lastname">Last Name:</label>
        <input type="text" v-model="lastname" required class="text-black" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="text-black" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required class="text-black" />
      </div>
      <button type="submit">Register</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

const register = async () => {
  try {
    const response = await axios.post(`${urlBase}/auth/register`, {
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    window.location.href = '/';
  } catch (err) {
    error.value = 'Failed to register';
  }
};
</script>

<style scoped>
.register-page {
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
