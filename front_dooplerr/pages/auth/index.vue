<template>
    <div class="min-h-screen flex flex-col justify-center items-center text-white">
      <div class="py-12 px-5 text-center">
        <h2 class="text-3xl italic">Bienvenue sur Dooplerr</h2>
        <p class="mt-2 text-gray-400 max-w-md mx-auto">
          Connecte-toi à ton compte ou crée un nouveau compte pour accéder à nos services.
        </p>
      </div>
  
      <div class="flex flex-col md:flex-row gap-6 mt-8">
        <div class="w-full md:w-1/2 p-5 border-dooplerr-purple-light border-t text-center">
          <h3 class="text-2xl italic">Déjà un compte ?</h3>
          <p class="mt-2 text-gray-400">
            Connecte-toi pour accéder à ton espace.
          </p>
          <button @click="navigateTo('login')" 
            class="mt-4 w-full py-2 px-4 border border-transparent font-medium rounded-md text-white bg-dooplerr-purple-light uppercase text-lg">
            Se connecter
          </button>
        </div>
        
        <div class="w-full md:w-1/2 p-5 border-dooplerr-yellow border-t text-center">
          <h3 class="text-2xl italic">Nouveau ici ?</h3>
          <p class="mt-2 text-gray-400">
            Crée un compte pour commencer à utiliser nos services.
          </p>
          <button @click="navigateTo('register')" 
            class="mt-4 w-full py-2 px-4 border border-transparent font-medium rounded-md text-white bg-dooplerr-yellow uppercase text-lg">
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
    import { useRouter } from "vue-router";

    definePageMeta({
    layout: false,
    });

    const router = useRouter();

    const navigateTo = (page) => {
    router.push(`/auth/${page}`);
    };
</script>