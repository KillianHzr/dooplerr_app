<template>
    <div class="flex">
      <img :src="thumbnail_path" class="rounded-lg bg-gray-300 me-8" width="90" height="90" />
      <div class="flex flex-col justify-center">
        <h3 class="text-xl font-medium italic">{{ title }}</h3>
        <h4>{{ description }}</h4>
        <div class="flex items-center pt-2">
          <div class="flex items-center gap-1 me-4">
            <Icon name="ion:headset-outline" size="20" />
            <span class="text-dooplerr-grey-purple">0</span>
          </div>
          <div class="flex items-center gap-1 me-4">
            <Icon name="material-symbols:favorite-outline-rounded" size="20" />
            <span class="text-dooplerr-grey-purple">0</span>
          </div>
          <div class="flex items-center gap-1 me-4">
            <Icon name="ph:chat-circle-bold" size="20" />
            <span class="text-dooplerr-grey-purple">0</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    thumbnail_path: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    listening: {
      type: Number,
      required: true
    },
    likes: {
      type: Number,
      required: true
    },
    comments: {
      type: Number,
      required: true
    }
  });
  </script>
  
  <style scoped>
  </style>
  