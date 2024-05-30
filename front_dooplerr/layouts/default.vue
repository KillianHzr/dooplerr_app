<template>
  <div>
    <NuxtPwaManifest />
    <div class="min-h-screen relative">
      <div id="auth-container"
        style="position: fixed; z-index: 9999; display: flex; align-items: center; width: 100%; justify-content: center">
        <div id="auth-indicator"
          style="width: 20px; height: 20px; border-radius: 100px; margin-right: 10px; background-color: red;"></div>
        <button v-if="!isAuthenticated" style="margin-right: 10px;">
          <NuxtLink to="/auth/login">Login</NuxtLink>
        </button>
        <button v-if="isAuthenticated" @click="logout">Logout</button>
      </div>

      <section class="pb-1">
        <slot />
      </section>

      <section class="w-full fixed py-2 px-8 bg-dooplerr-black bottom-0 left-0 flex justify-between">
        <NuxtLink to="/" active-class="active-link">
          <Icon name="material-symbols:home-outline-rounded" size="38" />
        </NuxtLink>
        <NuxtLink to="/podcasts" active-class="active-link">
          <Icon name="mingcute:search-line" size="38" />
        </NuxtLink>
        <NuxtLink to="/playlists" active-class="active-link">
          <Icon name="solar:layers-minimalistic-linear" size="38" />
        </NuxtLink>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, provide } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const isAuthenticated = ref(false);
const user = ref({});

provide('user', user);

const router = useRouter();
const config = useRuntimeConfig();
const urlBase = `${config.public.BASE_URL}`;

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  if (token) {
    try {
      const response = await axios.get(`${urlBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      user.value = response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  }
  const indicator = document.querySelector('#auth-indicator');
  if (indicator) {
    indicator.style.backgroundColor = token ? 'green' : 'red';
  }
};

const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  user.value = {};
  router.push('/auth');
};

onMounted(() => {
  checkAuth();
});

onBeforeMount(() => {
  checkAuth();
  if (!isAuthenticated.value && window.location.pathname !== '/auth' && window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/register') {
    router.push('/auth');
  }
});

router.beforeEach((to, from, next) => {
  checkAuth();
  if (!isAuthenticated.value && to.path !== '/auth' && to.path !== '/auth/login' && to.path !== '/auth/register') {
    next('/auth');
  } else {
    next();
  }
});
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
  color: #BFBCFF;
}
</style>
