<template>
  <div class="text-white">
    <section class="w-full py-10 flex flex-col px-5">
      <div class="flex justify-between">
        <button @click="$router.back()">
          <Icon name="material-symbols-light:arrow-back-ios-rounded" size="27" />
        </button>
        <button class="border border-dooplerr-grey-purple rounded-full text-xs py-1 px-10 italic">Modifier</button>
      </div>
    </section>

    <section>
      <div class="px-5 flex font-medium">
        <img :src="user.image_path" class="rounded-full bg-gray-300 me-8 border-dooplerr-grey-purple border" width="90" height="90" />
        <div class="flex flex-grow">
          <div class="flex flex-col justify-center">
            <h1 class="text-2xl italic">{{ user.username }}</h1>
            <p>286 <span class="text-dooplerr-grey-purple">abonnés</span></p>
            <p>123 <span class="text-dooplerr-grey-purple">abonnements</span></p>
          </div>
          <div class="ml-auto self-end">
            <button><Icon name="material-symbols:ios-share-rounded" size="27" /></button>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="px-5 font-medium">
        <h2 class="text-2xl italic pt-10 pb-6">Mes podcasts</h2>
        <div class="flex flex-col" v-if="podcasts">
          <PodcastCard
            v-for="podcast in userPodcasts"
            :key="podcast.id"
            :thumbnail_path="podcast.thumbnail_path"
            :title="podcast.title"
            :description="podcast.description"
            :listening="podcast.listening"
            :likes="podcast.likes"
            :comments="podcast.comments"
          />
        </div>
        <div v-else class="flex flex-col w-full justify-center items-center">
          <p class="text-dooplerr-grey-purple font-medium pb-6">Aucun podcast pour le moment...</p>
          <div class="flex flex-col items-center py-40 w-3/4 border-dashed-custom rounded-xl">
            <button class="italic mb-2 px-5 pt-1 pb-2 bg-dooplerr-purple-dark border border-white rounded-full">+ Importer un média</button>
            <span class="italic text-sm text-dooplerr-grey-purple">Glisser un média</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, ref, watchEffect } from 'vue';
import PodcastCard from '~/components/PodcastCard.vue';
import { usePodcasts } from '~/composables/usePodcasts';

const user = inject('user');
const userPodcasts = ref([]);

const { getUserPodcasts } = usePodcasts();

watchEffect(async () => {
  if (user.value && user.value.id) {
    try {
      userPodcasts.value = await getUserPodcasts(user.value.id);
    } catch (error) {
      console.error('Error fetching user podcasts:', error);
    }
  }
});
</script>

<style>
.border-dashed-custom {
  border: 2px dashed #706D92;
}
</style>
