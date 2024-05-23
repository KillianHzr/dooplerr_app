<template>
  <div>
    <NuxtPwaManifest />
    <div class="min-h-screen relative">
      <!-- <TopMenu class=""/> -->
      <div id="auth-container"
        style="position: fixed; z-index: 9999; margin: 20px; display: flex; align-items: center;">
        <div id="auth-indicator"
          style="width: 20px; height: 20px; border-radius: 100px; margin-right: 10px; background-color: red;"></div>
        <button v-if="!isAuthenticated" style="margin-right: 10px;">
          <NuxtLink to="/auth/login">Login</NuxtLink>
        </button>
        <button v-if="isAuthenticated" @click="logout">Logout</button>
      </div>
      <slot />
      <!-- <BottomMenu class="fixed bottom-0"/> -->
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
</style>
