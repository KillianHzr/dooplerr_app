<template>
  <div>
    <NuxtPwaManifest />
    <div class="min-h-screen relative">
      <section class="pb-16">
        <slot />
      </section>

      <section
        class="w-full fixed py-2 px-8 bg-dooplerr-black bottom-0 left-0 flex justify-between"
      >
        <div class="flex justify-between mx-auto w-full max-w-[600px]">
          <NuxtLink to="/" active-class="active-link" aria-label="Accueil">
            <Icon name="material-symbols:home-outline-rounded" size="38" />
          </NuxtLink>
          <NuxtLink to="/podcasts" active-class="active-link" aria-label="Posdcasts">
            <Icon name="mingcute:search-line" size="38" />
          </NuxtLink>
          <NuxtLink to="/playlists" active-class="active-link" aria-label="Playlists">
            <Icon name="solar:layers-minimalistic-linear" size="38" />
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

const isAuthenticated = ref(false);
const user = ref({});

provide("user", user);

const router = useRouter();
const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

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

onMounted(() => {
  checkAuth();
});

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

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Dooplerr - La plateforme de podcast interactive` : "Dooplerr - La plateforme de podcast interactive";
  },
})

</script>

<style scoped>
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

.icon {
  color: white;
}

.active-link .icon {
  color: #bfbcff;
}
</style>
