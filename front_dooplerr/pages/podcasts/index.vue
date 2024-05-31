<template>
  <div class="px-5">
    <section class="w-full pt-10 pb-5 flex flex-col text-white">
      <div class="flex justify-between">
        <NuxtLink to="/" active-class="active-link" aria-label="Accueil">
          <img src="~/assets/img/logo-dooplerr.png">
        </NuxtLink>
        <div class="flex gap-6">
          <NuxtLink to="/profile" active-class="active-link" aria-label="Profil">
            <Icon name="material-symbols:account-circle-full" size="27" />
          </NuxtLink>
          <NuxtLink to="/messages" active-class="active-link" aria-label="Messages">
            <Icon name="akar-icons:send" size="27" />
          </NuxtLink>
        </div>
      </div>
      <div class="w-full">
        <div class="relative py-5">
          <input
            v-model="searchQuery"
            @input="filterPodcasts"
            ref="searchInput"
            type="text"
            class="w-full py-3 pl-11 pr-4 rounded-dooplerr border-transparent bg-dooplerr-grey focus:outline-none focus:border-indigo-400 text-white"
            placeholder="Un nouveau podcast ?">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="mingcute:search-line" size="20" class="text-dooplerr-grey-purple" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <div v-else class="container mx-auto">
      <div v-if="!searchQuery">
        <h2 class="text-xl uppercase font-bold text-white mb-4 italic">
          Le plus recherché
        </h2>
        <NuxtLink :to="`/podcasts/${filteredPodcasts[0].id}`" class="bg-dooplerr-blue-dark mb-10 p-4 flex text-white rounded-xl">
          <div class="flex flex-col justify-center me-8">
            <h3 class="text-xl font-medium italic">{{ filteredPodcasts[0].title }}</h3>
            <h4 class="truncate-description">{{ filteredPodcasts[0].description }}</h4>
            <div class="flex items-center">
              <p class="opacity-50">37 820 écoutes, il y a 6 mois</p>
            </div>
          </div>
          <img :src="filteredPodcasts[0].thumbnail_path" class="rounded-lg bg-gray-300 ml-auto" width="90" height="90" style="min-width: 90px; min-height: 90px; max-height: 90px; max-width: 90px; object-fit: cover;" />
        </NuxtLink>

        <h2 class="text-normal uppercase font-bold text-white mb-4 italic">
          Toutes les catégories
        </h2>
        <div class="grid grid-cols-2 gap-6 gap-x-10 pb-10">
          <div
            v-for="category in categories"
            :key="category.name"
            :style="{ backgroundColor: category.color }"
            class="px-2 py-1 flex flex-col text-white rounded-xl relative"
          >
            <h3 class="text-2xl font-medium italic pb-10">{{ category.name }}</h3>
            <div class="w-full flex justify-center absolute bottom-0 left-0">
              <img src="~/assets/img/categories_bg.png" class="w-11/12" style="object-fit: cover;" />
            </div>
          </div>
        </div>
      </div>

      <h2 class="text-xl uppercase font-bold text-white mb-4 italic" v-if="searchQuery">
        Résultats de la recherche
      </h2>
      <div v-if="searchQuery" class="list-content mb-24 text-white">
        <PodcastCard
          v-for="podcast in filteredPodcasts"
          :key="podcast.id"
          :id="podcast.id"
          :thumbnail_path="podcast.thumbnail_path"
          :title="podcast.title"
          :description="podcast.description"
          :commentsCount="podcast.commentsCount"
          :isPublic="podcast.isPublic"
          :hideVisibility="true"
          class="mt-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePodcasts } from '~/composables/usePodcasts';

const { getPodcasts } = usePodcasts();
const podcasts = ref([]);
const searchQuery = ref('');
const filteredPodcasts = ref([]);
const route = useRoute();
const searchInput = ref(null);
const isLoading = ref(true);

const categories = ref([
  { name: 'Politique', color: '#8953C5' },
  { name: 'Histoires', color: '#C55353' },
  { name: 'Société', color: '#4972C3' },
  { name: 'Sexualité', color: '#28BC51' },
  { name: 'Films & Séries', color: '#D4498C' },
  { name: 'Arts & Culture', color: '#EEBA00' },
  { name: 'Sport', color: '#2939CA' },
  { name: 'Faits divers', color: '#14BDBD' },
  { name: 'Divertissement', color: '#DB62F9' },
  { name: 'Actualités', color: '#5B15A1' },
  { name: 'Business', color: '#910862' },
  { name: 'Faits divers', color: '#AA0B3B' },
]);

onMounted(async () => {
  try {
    const allPodcasts = await getPodcasts();
    podcasts.value = allPodcasts.filter(podcast => podcast.public);
    searchQuery.value = route.query.search || '';
    filterPodcasts();
  } catch (error) {
    console.error('Error fetching podcasts:', error);
  } finally {
    isLoading.value = false;
  }

  if (searchInput.value) {
    searchInput.value.focus();
  }
});

const filterPodcasts = () => {
  if (searchQuery.value) {
    filteredPodcasts.value = podcasts.value.filter(podcast =>
      podcast.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    filteredPodcasts.value = podcasts.value;
  }
};

watch([searchQuery, () => route.query.search], () => {
  filterPodcasts();
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
