<template>
  <div :class="`min-h-screen flex flex-col justify-center text-white mx-auto md:max-w-[600px]`">
    <!-- Section de bienvenue -->
    <div class="py-12 px-5">
      <h2 class="text-2xl italic">Connecte-toi à ton compte</h2>
      <p class="mt-2 text-gray-400 max-w">
        Ou
        <!-- Lien vers la page de création de compte -->
        <nuxt-link to="/auth/register" class="font-medium text-indigo-400 hover:text-indigo-500">
          crée ton compte
        </nuxt-link>
      </p>
    </div>

    <!-- Formulaire de connexion -->
    <form class="text-sm italic" @submit.prevent="login">
      <div :class="`flex flex-col gap-6 px-5 py-16 border-dooplerr-purple-light border-t`">
        <!-- Champ pour l'adresse email -->
        <div class="flex items-center">
          <label for="email" class="w-1/3 font-medium">Adresse mail</label>
          <input id="email" name="email" type="email" v-model="email" required
            class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
            placeholder="Entrer votre adresse mail">
        </div>
        <!-- Champ pour le mot de passe -->
        <div class="flex items-center">
          <label for="password" class="w-1/3 font-medium">Mot de passe</label>
          <input id="password" name="password" type="password" v-model="password" required
            class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
            placeholder="Entrer votre mot de passe">
        </div>
        <!-- Message d'erreur -->
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </div>
      <div :class="`flex flex-col gap-6 px-5 py-8 border-dooplerr-purple-light border-t`">
        <!-- Bouton de soumission du formulaire -->
        <button type="submit"
          :class="`w-full py-2 px-4 border border-transparent font-medium rounded-md text-white bg-dooplerr-purple-light uppercase text-lg`">
          Se connecter
        </button>
        <!-- Bouton de connexion avec Google -->
        <a @click="loginWithGoogle"
          class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
          <img class="h-6 w-6" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png" alt="">
        </a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Définir les métadonnées de la page pour désactiver la mise en page par défaut
definePageMeta({
  layout: false,
});

// Variables réactives pour les champs de saisie et les messages d'erreur
const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();
const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

const isAuthenticated = ref(false);

// Vérifier l'authentification de l'utilisateur
const checkAuth = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;

  if (isAuthenticated.value) {
    router.push('/');
  }
};

// Fonction de connexion
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

// Fonction de connexion avec Google
const loginWithGoogle = () => {
  window.location.href = `${urlBase}/auth/google`;
};

// Vérifier l'authentification lors du montage du composant
onMounted(() => {
  checkAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    localStorage.setItem('token', token);
    router.push('/');
  }
});
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}

.outline-none {
  outline: none !important;
  outline-offset: 0 !important;
}

.shadow-none {
  box-shadow: none !important;
}
</style>
