<template>
  <div class="px-5">
    <TopNav />
    <div class="container mx-auto">
      <h2 class="text-3xl font-bold text-white mb-10">
        Les derniers podcasts
      </h2>
      <Wrapper display="carrousel">
        <CardPodcast v-for="podcast in podcasts" :key="podcast.id" :podcast="podcast"
          class="group relative aspect-video h-96 min-w-[300px] cursor-pointer overflow-hidden rounded-xl snap-start first:ps-6 w-full">
        </CardPodcast>
      </Wrapper>
      <h2 class="text-3xl font-bold text-white">
        Les derniers épisodes
      </h2>
      <Wrapper display="list" class="list-content mb-24">
        <CardEpisode v-for="episode in episodes" :key="episode.id" :episode="episode" class="">
        </CardEpisode>
      </Wrapper>
    </div>

  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const { getPodcasts } = usePodcasts();
const { getEpisodes } = useEpisodes();

const podcasts = ref([]);
const episodes = ref([]);

onMounted(async () => {
  podcasts.value = await getPodcasts();
  episodes.value = await getEpisodes();
});

</script>