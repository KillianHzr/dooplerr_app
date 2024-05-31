<template>
  <!-- Lien vers la page de l'épisode du podcast -->
    <NuxtLink :to="`/podcasts/episode/${episode.id}`" class="border border-dooplerr-grey-purple rounded p-4 text-white">
      <h3 class="text-lg font-bold">{{ episode.title }}</h3>
      <p class="text-sm">{{ episode.description }}</p>
      <p class="text-xs text-dooplerr-grey-purple">{{ new Date(episode.release_date).toLocaleDateString() }}</p>
    </NuxtLink>
  </template>
  
  <script setup>
  // Définition des propriétés (props) du composant
  const props = defineProps({
    // L'objet 'episode' est obligatoire et doit être de type Object
    episode: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  </style>
  