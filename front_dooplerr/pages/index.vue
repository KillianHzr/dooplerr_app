<template>
  <div>
    <HeroBanner />
    <div class="container mx-auto px-8">
      <h2 class="text-3xl font-bold text-white mb-10">
        Les derniers podcasts
      </h2>
      <Wrapper display="carrousel">
        <CardPodcast v-for="podcast in podcasts" :key="podcast.id" :podcast="podcast"
          class="group relative aspect-video h-96 min-w-[300px] cursor-pointer overflow-hidden rounded-xl snap-start first:ps-6 w-full">
        </CardPodcast>
      </Wrapper>
      <Wrapper display="grid">
        <CardEpisode v-for="episode in episodes" :key="episode.id" :episode="episode"
          class="group relative aspect-video h-96 min-w-[300px] cursor-pointer overflow-hidden rounded-xl snap-start w-full">
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