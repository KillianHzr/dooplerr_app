<template>
  <NuxtLink :to="`/podcasts/${id}`" class="flex">
    <img :src="thumbnail_path" class="rounded-lg bg-gray-300 me-8" width="90" height="90" style="min-width: 90px; min-height: 90px; max-height: 90px; max-width: 90px; object-fit: cover;" />
    <div class="flex flex-col justify-center">
      <h3 class="text-xl font-medium italic">{{ title }}</h3>
      <h4 class="truncate-description">{{ description }}</h4>
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
    <div class="ml-auto">
      <Icon v-if="isPublic" name="ph:microphone" size="20" />
      <Icon v-else name="ph:microphone-slash" size="20" />
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
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
  commentsCount: {
    type: Number,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  }
});
</script>

<style scoped>
.truncate-description {
  overflow: hidden;
  max-height: 20px;
}
</style>
