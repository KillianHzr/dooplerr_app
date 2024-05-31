<template>
    <NuxtLink :to="`/podcasts/episode/${episode.id}`" class="border border-dooplerr-grey-purple rounded p-4 text-white">
      <h3 class="text-lg font-bold">{{ episode.title }}</h3>
      <p class="text-sm">{{ episode.description }}</p>
      <p class="text-xs text-dooplerr-grey-purple">{{ new Date(episode.release_date).toLocaleDateString() }}</p>
    </NuxtLink>
  </template>
  
  <script setup>
  const props = defineProps({
    episode: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  </style>
  