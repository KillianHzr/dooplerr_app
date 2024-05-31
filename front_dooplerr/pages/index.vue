<template>
  <div class="px-5 text-white">
    <TopNav />

    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <div v-else class="container mx-auto">
      <div class="grid grid-cols-2 gap-6 pb-10">
        <NuxtLink :to="`${section.link}`" v-for="section in sections" :key="section.title" :style="{ backgroundColor: section.color }" class="px-2 py-1 flex flex-col text-white rounded-xl relative">
          <h3 class="text-xl font-medium italic pb-12">{{ section.title }}</h3>
          <div class="w-full flex justify-center absolute bottom-0 left-0">
            <img src="~/assets/img/categories_bg.png" class="w-11/12" style="object-fit: cover;" />
          </div>
        </NuxtLink>
      </div>

      <h2 class="text-xl uppercase font-bold text-white mb-4 italic">
        Le plus écouté de la semaine
      </h2>
      <NuxtLink :to="`/podcasts/${mostListenedPodcast.id}`" class="bg-dooplerr-blue-dark mb-10 p-4 flex text-white rounded-xl">
        <div class="flex flex-col justify-center me-8">
          <h3 class="text-xl font-medium italic">{{ mostListenedPodcast.title }}</h3>
          <h4 class="truncate-description">{{ mostListenedPodcast.description }}</h4>
          <div class="flex items-center">
            <p class="opacity-50">{{ mostListenedPodcast.listenCount }} écoutes, il y a {{ mostListenedPodcast.timeAgo }}</p>
          </div>
        </div>
        <img :src="mostListenedPodcast.thumbnail_path" class="rounded-lg bg-gray-300 ml-auto" width="90" height="90" style="min-width: 90px; min-height: 90px; max-height: 90px; max-width: 90px; object-fit: cover;" />
      </NuxtLink>

      <h2 class="text-xl uppercase font-bold text-white mb-4 italic">
        Mes émissions
      </h2>        
        <Wrapper display="carrousel">
          <CardPodcast v-for="podcast in podcasts" :key="podcast.id" :podcast="podcast"
            class="group relative aspect-square min-w-[100px] cursor-pointer overflow-hidden rounded-xl snap-start">
          </CardPodcast>
        </Wrapper>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePodcasts } from '~/composables/usePodcasts';

const { getPodcasts } = usePodcasts();

const podcasts = ref([]);
const isLoading = ref(true);
const mostListenedPodcast = ref({});

const categoryColors = [
  '#8953C5', '#C55353', '#4972C3', '#28BC51', '#D4498C', '#EEBA00',
  '#2939CA', '#14BDBD', '#DB62F9', '#5B15A1', '#910862', '#AA0B3B'
];

const sections = ref([
  { title: 'Reprendre', color: categoryColors[0], link: '/playlists' },
  { title: 'Podcasts Likés', color: categoryColors[1], link: '/playlists' },
  { title: 'Nouveaux Épisodes', color: categoryColors[2], link: '/playlists' },
  { title: 'Podcasts Abonnés', color: categoryColors[3], link: '/playlists' }
]);

onMounted(async () => {
  try {
    const allPodcasts = await getPodcasts();
    podcasts.value = allPodcasts.filter(podcast => podcast.public);
    mostListenedPodcast.value = podcasts.value[0]; // Assuming the first one is the most listened
  } catch (error) {
    console.error('Error fetching podcasts:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

input::placeholder {
  color: #706D92;
  font-style: italic;
  line-height: normal;
}

input:focus {
  box-shadow: none !important;
}
</style>
