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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);

const checkAuth = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  const indicator = document.querySelector('#auth-indicator');

  if (indicator) {
    indicator.style.backgroundColor = token ? 'green' : 'red';
  }

  if (!isAuthenticated.value) {
    return navigateTo('auth');
  }
};

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};

const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  checkAuth();
  router.push('/auth/login');
};

onMounted(() => {
  checkAuth();

  router.beforeEach((to, from, next) => {
    if (process.client) {
      checkAuth();
    }
    next();
  });
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

.icon{
  color: white;
}

.active-link .icon {
  color: #BFBCFF;
}
</style>
