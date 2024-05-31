<template>
  <div>
    <!-- Composant pour le manifest PWA -->
    <NuxtPwaManifest />
    <!-- Conteneur principal avec une hauteur minimale de l'écran -->
    <div class="min-h-screen relative">
      <!-- Section principale avec une marge en bas -->
      <section class="pb-16 mx-auto default-section" style="max-width: 630px;">
        <!-- Emplacement pour insérer du contenu via slot -->
        <slot />
      </section>

      <!-- Barre de navigation fixe en bas de la page -->
      <section
        class="w-full fixed py-4 px-10 bg-dooplerr-black bottom-0 left-0 flex justify-between"
      >
        <div class="flex justify-between mx-auto w-full max-w-[600px]">
          <!-- Liens de navigation avec des icônes -->
          <NuxtLink to="/" active-class="active-link" aria-label="Accueil">
            <Icon name="material-symbols:home-outline-rounded" size="30" />
          </NuxtLink>
          <NuxtLink to="/podcasts" active-class="active-link" aria-label="Podcasts">
            <Icon name="mingcute:search-line" size="30" />
          </NuxtLink>
          <NuxtLink to="/playlists" active-class="active-link" aria-label="Playlists">
            <Icon name="solar:layers-minimalistic-linear" size="30" />
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, provide } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Variables pour stocker l'état de l'authentification et les informations de l'utilisateur
const isAuthenticated = ref(false);
const user = ref({});

// Fournir l'utilisateur pour l'injection dans les composants enfants
provide("user", user);

// Utilisation du router de Vue
const router = useRouter();
const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

// Fonction pour vérifier l'authentification de l'utilisateur
const checkAuth = async () => {
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token;
  if (token) {
    try {
      const response = await axios.get(`${urlBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      user.value = response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout();
    }
  }
  const indicator = document.querySelector("#auth-indicator");
  if (indicator) {
    indicator.style.backgroundColor = token ? "green" : "red";
  }
};

// Vérifier l'authentification lors du montage du composant
onMounted(() => {
  checkAuth();
});

// Vérifier l'authentification avant le montage du composant
onBeforeMount(() => {
  checkAuth();
  if (
    !isAuthenticated.value &&
    window.location.pathname !== "/auth" &&
    window.location.pathname !== "/auth/login" &&
    window.location.pathname !== "/auth/register"
  ) {
    router.push("/auth");
  }
});

// Vérifier l'authentification avant chaque changement de route
router.beforeEach((to, from, next) => {
  checkAuth();
  if (
    !isAuthenticated.value &&
    to.path !== "/auth" &&
    to.path !== "/auth/login" &&
    to.path !== "/auth/register"
  ) {
    next("/auth");
  } else {
    next();
  }
});

// Définir les méta-informations pour le head du document
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Dooplerr - La plateforme de podcast interactive` : "Dooplerr - La plateforme de podcast interactive";
  },
  htmlAttrs: {
    lang: "fr",
  },
})
</script>

<style scoped>
/* Styles pour les boutons */
button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Styles pour les icônes */
.icon {
  color: white;
}

/* Styles pour les liens actifs */
.active-link .icon {
  color: #bfbcff;
}
</style>
