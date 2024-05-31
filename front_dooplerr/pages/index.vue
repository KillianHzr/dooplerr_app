<template>
  <div class="px-5">
    <TopNav />
    <div class="container mx-auto">
      <section v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="spinner-border text-dooplerr-grey-purple" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </section>

      <div v-else>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePodcasts } from '~/composables/usePodcasts';
import { useEpisodes } from '~/composables/useEpisodes';

const { getPodcasts } = usePodcasts();
const { getEpisodes } = useEpisodes();

const podcasts = ref([]);
const episodes = ref([]);
const isLoading = ref(true); // Ajout de la référence pour l'état de chargement

onMounted(async () => {
  try {
    podcasts.value = await getPodcasts();
    episodes.value = await getEpisodes();
  } catch (error) {
    console.error('Error fetching podcasts or episodes:', error);
  } finally {
    isLoading.value = false; // Fin du chargement
  }
});
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
  border: 0.4em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
</style>
