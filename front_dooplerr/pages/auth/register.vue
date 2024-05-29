<template>
  <div :class="`min-h-screen flex flex-col justify-center text-white`">
    <div v-if="!planSelected" class="py-12 px-5">
      <div class="flex flex-col gap-4">
        <div class="border border-dooplerr-yellow rounded-xl p-4">
          <div class="flex justify-between font-medium italic">
            <h3 class="font-semibold italic text-lg">Bon plan</h3>
            <div class="flex flex-col text-center">
              <span class="text-sm">Gratuit</span>
              <span class="text-sm">‎</span>
            </div>
          </div>
          <ul class="font-light list-disc ps-6 text-xs pb-3">
            <li><span class="text-base">1 compte vérifié</span></li>
            <li><span class="text-base">Accès à tous les pdocasts</span></li>
            <li><span class="text-base">Pubs visuels sur la plateforme</span></li>
            <li><span class="text-base">Annulez à tout moment</span></li>
          </ul>
          <div class="w-full flex justify-center">
            <button @click="selectPlan('free')" class="pb-1 w-56 bg-dooplerr-yellow text-white rounded-full text-sm font-medium italic">Obtenez Bon plan</button>
          </div>
        </div>
        <div class="border border-dooplerr-purple-light rounded-xl p-4">
          <div class="flex justify-between font-medium italic">
            <h3 class="font-semibold italic text-lg">Premium Étudiant</h3>
            <div class="flex flex-col text-center">
              <span class="text-sm">5,99 €</span>
              <span class="text-xs opacity-50">par mois</span>
            </div>
          </div>
          <ul class="font-light list-disc ps-6 text-xs pb-3">
            <li><span class="text-base">1 compte premium vérifié</span></li>
            <li><span class="text-base">Réduction pour les étudiantes et étudiantes éligibles</span></li>
            <li><span class="text-base">Annulez à tout moment</span></li>
          </ul>
          <div class="w-full flex justify-center">
            <button @click="selectPlan('student')" class="pb-1 w-56 bg-dooplerr-purple-light text-white rounded-full text-sm font-medium italic">Obtenez Premium Étudiant</button>
          </div>
        </div>
        <div class="border border-dooplerr-blue rounded-xl p-4">
          <div class="flex justify-between font-medium italic">
            <h3 class="font-semibold italic text-lg">Premium Duo</h3>
            <div class="flex flex-col text-center">
              <span class="text-sm">14,99 €</span>
              <span class="text-xs opacity-50">par mois</span>
            </div>
          </div>
          <ul class="font-light list-disc ps-6 text-xs pb-3">
            <li><span class="text-base">2 comptes premium vérifié</span></li>
            <li><span class="text-base">Annulez à tout moment</span></li>
          </ul>
          <div class="w-full flex justify-center">
            <button @click="selectPlan('duo')" class="pb-1 w-56 bg-dooplerr-blue text-white rounded-full text-sm font-medium italic">Obtenez Premium Duo</button>
          </div>
        </div>
        <div class="border border-dooplerr-red rounded-xl p-4">
          <div class="flex justify-between font-medium italic">
            <h3 class="font-semibold italic text-lg">Premium Famille</h3>
            <div class="flex flex-col text-center">
              <span class="text-sm">17,99 €</span>
              <span class="text-xs opacity-50">par mois</span>
            </div>
          </div>
          <ul class="font-light list-disc ps-6 text-xs pb-3">
            <li><span class="text-base">Jusqu'à 6 compte vérifié</span></li>
            <li><span class="text-base">Gérer les contenus sensibles ou explicites</span></li>
            <li><span class="text-base">Annulez à tout moment</span></li>
          </ul>
          <div class="w-full flex justify-center">
            <button @click="selectPlan('family')" class="pb-1 w-56 bg-dooplerr-red text-white rounded-full text-sm font-medium italic">Obtenez Premium Famille</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="py-12 px-5">
        <h2 class="text-2xl italic">Créer ton compte Dooplerr</h2>
        <p class="mt-2 text-gray-400 max-w">
          Ou
          <NuxtLink to="/auth/login" class="font-medium text-dooplerr-purple-light">
            connecte-toi à ton compte
          </NuxtLink>
        </p>
        <p class="mt-2 text-gray-400 max-w">
          Ou
          <button @click="goBack" class="font-medium text-white">
            change de plan
          </button>
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
          <a @click="registerWithGoogle"
            class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <img class="h-6 w-6" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png" alt="">
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const planSelected = ref(route.query.plan || false);
const color = ref(colorMap[route.query.plan] || 'yellow');
const borderColor = ref(colorMap[route.query.plan] || 'dooplerr-yellow');

const selectPlan = (plan) => {
  router.push({ query: { plan } });
  planSelected.value = plan;
  color.value = colorMap[plan];
  borderColor.value = colorMap[plan];
};

const goBack = () => {
  router.push({ query: {} });
  planSelected.value = false;
};

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
