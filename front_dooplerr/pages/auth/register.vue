<template>
  <div class="min-h-screenflex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Créer votre compte</h2>
      <p class="mt-2 text-center text-sm text-gray-600 max-w">
        Ou
        <nuxt-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
          connectez-vous à votre compte
        </nuxt-link>
      </p>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="register">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <div class="mt-1">
              <input id="username" name="username" type="text" v-model="username" required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entrez votre nom d'utilisateur">
            </div>
          </div>
          <div>
            <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom</label>
            <div class="mt-1">
              <input id="firstname" name="firstname" type="text" v-model="firstname" required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entrez votre prénom">
            </div>
          </div>
          <div>
            <label for="lastname" class="block text-sm font-medium text-gray-700">Nom de famille</label>
            <div class="mt-1">
              <input id="lastname" name="lastname" type="text" v-model="lastname" required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entrez votre nom de famille">
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Adresse e-mail</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" v-model="email" required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entrez votre adresse e-mail">
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" v-model="password" required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entrez votre mot de passe">
            </div>
          </div>
          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Créer un compte
            </button>
          </div>
        </form>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-100 text-gray-500">Ou continuez avec</span>
            </div>
          </div>
          <div class="mt-6 grid grid-cols-1 gap-3">
            <div>
              <button @click="registerWithGoogle"
                class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <img class="h-6 w-6" src="https://www.svgrepo.com/show/506498/google.svg" alt="Google">
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    error.value = 'Échec de l\'inscription';
  }
};

const registerWithGoogle = () => {
  window.location.href = `${urlBase}/auth/google`;
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
