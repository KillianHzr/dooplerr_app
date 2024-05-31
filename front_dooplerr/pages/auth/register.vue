<template>
  <div :class="`min-h-screen flex flex-col justify-center text-white mx-auto md:max-w-[600px]`">
    <!-- Affichage des plans si aucun plan n'est sélectionné -->
    <div v-if="!planSelected" class="py-12 px-5">
      <div class="flex flex-col gap-4">
        <!-- Carte de plan Bon plan -->
        <PlanCard 
          planName="Bon plan" 
          price="Gratuit" 
          :features="['1 compte vérifié', 'Accès à tous les podcasts', 'Pubs visuels sur la plateforme', 'Annulez à tout moment']" 
          planType="free" 
          borderColor="dooplerr-yellow" 
          buttonText="Obtenez Bon plan"
          @selectPlan="selectPlan"
        />
        <!-- Carte de plan Premium Étudiant -->
        <PlanCard 
          planName="Premium Étudiant" 
          price="5,99 €" 
          subtext="par mois" 
          :features="['1 compte premium vérifié', 'Réduction pour les étudiantes et étudiants éligibles', 'Annulez à tout moment']" 
          planType="student" 
          borderColor="dooplerr-purple-light" 
          buttonText="Obtenez Premium Étudiant"
          @selectPlan="selectPlan"
        />
        <!-- Carte de plan Premium Duo -->
        <PlanCard 
          planName="Premium Duo" 
          price="14,99 €" 
          subtext="par mois" 
          :features="['2 comptes premium vérifiés', 'Annulez à tout moment']" 
          planType="duo" 
          borderColor="dooplerr-blue" 
          buttonText="Obtenez Premium Duo"
          @selectPlan="selectPlan"
        />
        <!-- Carte de plan Premium Famille -->
        <PlanCard 
          planName="Premium Famille" 
          price="17,99 €" 
          subtext="par mois" 
          :features="['Jusqu\'à 6 comptes vérifiés', 'Gérer les contenus sensibles ou explicites', 'Annulez à tout moment']" 
          planType="family" 
          borderColor="dooplerr-red" 
          buttonText="Obtenez Premium Famille"
          @selectPlan="selectPlan"
        />
      </div>
    </div>
    
    <!-- Formulaire de création de compte si un plan est sélectionné -->
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

      <!-- Formulaire d'inscription -->
      <form class="text-sm italic" @submit.prevent="validateAndRegister">
        <!-- Section des informations d'identification -->
        <div :class="`flex flex-col gap-6 px-5 py-16 border-dooplerr-${borderColor} border-t`">
          <div class="flex items-center">
            <label for="username" class="w-1/3 font-medium">Indentifiant</label>
            <input id="username" name="username" type="text" v-model="username" required
              class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
              placeholder="Entrez votre nom d'utilisateur">
          </div>
          <div class="flex items-center">
            <label for="password" class="w-1/3 font-medium">Mot de passe</label>
            <input id="password" name="password" type="password" v-model="password" required
              class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
              placeholder="Entrez votre mot de passe">
          </div>
          <div class="flex items-center">
            <label for="confirmPassword" class="w-1/3 font-medium">Confirmation de mot de passe</label>
            <input id="confirmPassword" name="confirmPassword" type="password" v-model="confirmPassword" required
              class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
              placeholder="Confirmez votre mot de passe">
          </div>
          <p v-if="error" class="text-red-500">{{ error }}</p>
        </div>
        <!-- Section des informations personnelles -->
        <div :class="`flex flex-col gap-6 px-5 py-16 border-dooplerr-${borderColor} border-t`">
          <div class="flex items-center">
            <label for="email" class="w-1/3 font-medium">Adresse e-mail</label>
            <input id="email" name="email" type="email" v-model="email" required
              class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
              placeholder="Entrez votre adresse e-mail">
          </div>
          <div class="flex items-center">
            <label for="firstname" class="w-1/3 font-medium">Prénom</label>
            <input id="firstname" name="firstname" type="text" v-model="firstname" required
              class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
              placeholder="Entrez votre prénom">
          </div>
          <div class="flex items-center">
            <label for="lastname" class="w-1/3 font-medium">Nom de famille</label>
            <input id="lastname" name="lastname" type="text" v-model="lastname" required
              class="w-2/3 border-0 border-b-2 bg-transparent text-white appearance-none shadow-none outline-none focus:outline-none"
              placeholder="Entrez votre nom de famille">
          </div>
        </div>
        <!-- Bouton de soumission du formulaire et inscription avec Google -->
        <div :class="`flex flex-col gap-6 px-5 py-8 border-dooplerr-${borderColor} border-t`">
          <button type="submit"
            :class="`w-full py-2 px-4 border border-transparent font-medium rounded-md text-white bg-dooplerr-${color} uppercase text-lg`">
            Créer mon compte gratuit
          </button>
          <a @click="registerWithGoogle"
            class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <img class="h-6 w-6" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png" alt="">
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import PlanCard from '@/components/PlanCard.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// Définir les métadonnées de la page pour désactiver la mise en page par défaut
definePageMeta({
  layout: false,
});

// Variables réactives pour les champs de saisie et les messages d'erreur
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

// Variables réactives pour la sélection du plan
const planSelected = ref(route.query.plan || false);
const color = ref(colorMap[route.query.plan] || 'yellow');
const borderColor = ref(colorMap[route.query.plan] || 'dooplerr-yellow');

// Fonction pour sélectionner un plan
const selectPlan = (plan) => {
  router.push({ query: { plan } });
  planSelected.value = plan;
  color.value = colorMap[plan];
  borderColor.value = colorMap[plan];
};

// Fonction pour revenir à la sélection des plans
const goBack = () => {
  router.push({ query: {} });
  planSelected.value = false;
};

// Fonction pour valider et enregistrer le compte
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

// Fonction pour s'inscrire avec Google
const registerWithGoogle = () => {
  window.location.href = `${urlBase}/auth/google`;
};

// Vérifier l'authentification de l'utilisateur
const isAuthenticated = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;

  if (isAuthenticated.value) {
    router.push('/');
  }
};

// Vérifier l'authentification lors du montage du composant
onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
input:focus {
  box-shadow: none !important;
}
</style>
