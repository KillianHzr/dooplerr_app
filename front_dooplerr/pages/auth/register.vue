<template>
  <div :class="`min-h-screen flex flex-col justify-center text-white`">
    <div class="py-12 px-5">
      <h2 class="text-2xl italic">Créer ton compte Dooplerr</h2>
      <p class="mt-2 text-gray-400 max-w">
        Ou
        <NuxtLink to="/auth/login" class="font-medium text-indigo-400 hover:text-indigo-500">
          connecte-toi à ton compte
        </NuxtLink>
      </p>
    </div>

    <form class="text-sm italic" @submit.prevent="validateAndRegister">
      <div :class="`flex flex-col gap-6 px-5 py-16 border-dooplerr-${borderColor} border-t`">
        <div class="flex items-center">
          <label for="username" class="w-1/3 font-medium">Indentifiant</label>
          <input id="username" name="username" type="text" v-model="username" required
            class="w-2/3 appearance-none text-black py-1 px-3 rounded-dooplerr"
            placeholder="Entrez votre nom d'utilisateur">
        </div>
        <div class="flex items-center">
          <label for="password" class="w-1/3 font-medium">Mot de passe</label>
          <input id="password" name="password" type="password" v-model="password" required
            class="w-2/3 appearance-none text-black py-1 px-3 rounded-dooplerr"
            placeholder="Entrez votre mot de passe">
        </div>
        <div class="flex items-center">
          <label for="confirmPassword" class="w-1/3 font-medium">Confirmation de mot de passe</label>
          <input id="confirmPassword" name="confirmPassword" type="password" v-model="confirmPassword" required
            class="w-2/3 appearance-none text-black py-1 px-3 rounded-dooplerr"
            placeholder="Confirmez votre mot de passe">
        </div>
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </div>
      <div :class="`flex flex-col gap-6 px-5 py-16 border-dooplerr-${borderColor} border-t`">
        <div class="flex items-center">
          <label for="email" class="w-1/3 font-medium">Adresse e-mail</label>
          <input id="email" name="email" type="email" v-model="email" required
            class="w-2/3 appearance-none text-black py-1 px-3 rounded-dooplerr"
            placeholder="Entrez votre adresse e-mail">
        </div>
        <div class="flex items-center">
          <label for="firstname" class="w-1/3 font-medium">Prénom</label>
          <input id="firstname" name="firstname" type="text" v-model="firstname" required
            class="w-2/3 appearance-none text-black py-1 px-3 rounded-dooplerr"
            placeholder="Entrez votre prénom">
        </div>
        <div class="flex items-center">
          <label for="lastname" class="w-1/3 font-medium">Nom de famille</label>
          <input id="lastname" name="lastname" type="text" v-model="lastname" required
            class="w-2/3 appearance-none text-black py-1 px-3 rounded-dooplerr"
            placeholder="Entrez votre nom de famille">
        </div>
      </div>
      <div :class="`flex flex-col gap-6 px-5 py-8 border-dooplerr-${borderColor} border-t`">
        <button type="submit"
          :class="`w-full py-2 px-4 border border-transparent font-medium rounded-md text-white bg-dooplerr-${color} uppercase text-lg`">
          Créer mon compte gratuit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

definePageMeta({
  layout: false,
});

const username = ref('');
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const router = useRouter();
const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

const route = useRoute();
const colorMap = {
  free: 'yellow',
  student: 'purple-light',
  duo: 'blue',
  family: 'red'
};
const color = colorMap[route.query.plan] || 'yellow';
const borderColor = colorMap[route.query.plan] || 'dooplerr-yellow';

const validateAndRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

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

const isAuthenticated = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;

  if (isAuthenticated.value) {
    router.push('/');
  }
};

onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
input:focus{
    box-shadow: none !important;
}
</style>
