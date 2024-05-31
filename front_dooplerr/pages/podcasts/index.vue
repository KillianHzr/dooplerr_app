<template>
  <div class="px-5">
    <!-- Section de navigation supérieure avec logo et icônes de profil et de messages -->
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

    <!-- Section de chargement avec un spinner -->
    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <!-- Contenu principal -->
    <div v-else class="container mx-auto">
      <div v-if="!searchQuery">
        <!-- Section "Le plus recherché" -->
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

        <!-- Section "Toutes les catégories" -->
        <h2 class="text-normal uppercase font-bold text-white mb-4 italic">
          Toutes les catégories
        </h2>
        <div class="grid grid-cols-2 gap-6 pb-10">
          <div
            v-for="category in allCategories"
            :key="category.name"
            :style="{ backgroundColor: category.color }"
            class="px-2 py-1 flex flex-col text-white rounded-xl relative"
          >
            <NuxtLink :to="`/podcasts/categories/${category.id}?color=${encodeURIComponent(category.color)}`">
              <h3 class="text-xl font-medium italic pb-12">{{ category.name }}</h3>
              <div class="w-full flex justify-center absolute bottom-0 left-0">
                <img src="~/assets/img/categories_bg.png" class="w-11/12" style="object-fit: cover;" />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Section des résultats de recherche -->
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
import { useCategories } from '~/composables/useCategories';

// Récupération des fonctions nécessaires pour obtenir les podcasts et les catégories
const { getPodcasts } = usePodcasts();
const { getCategories } = useCategories();

// Initialisation des références pour l'état du composant
const podcasts = ref([]);
const searchQuery = ref('');
const filteredPodcasts = ref([]);
const route = useRoute();
const searchInput = ref(null);
const isLoading = ref(true);

const categoryColors = [
  '#8953C5', '#C55353', '#4972C3', '#28BC51', '#D4498C', '#EEBA00',
  '#2939CA', '#14BDBD', '#DB62F9', '#5B15A1', '#910862', '#AA0B3B'
];

const categories = ref([]);
const allCategories = ref([]);

// Fonction exécutée au montage du composant
onMounted(async () => {
  try {
    const allPodcasts = await getPodcasts();
    podcasts.value = allPodcasts.filter(podcast => podcast.public);
    searchQuery.value = route.query.search || '';
    filterPodcasts();

    const realCategories = await getCategories();
    categories.value = realCategories.map((category, index) => ({
      ...category,
      color: categoryColors[index % categoryColors.length]
    }));
    allCategories.value = categories.value;
  } catch (error) {
    console.error('Error fetching podcasts or categories:', error);
  } finally {
    isLoading.value = false;
  }

  if (searchInput.value) {
    searchInput.value.focus();
  }
});

// Filtrer les podcasts en fonction de la recherche
const filterPodcasts = () => {
  if (searchQuery.value) {
    filteredPodcasts.value = podcasts.value.filter(podcast =>
      podcast.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    filteredPodcasts.value = podcasts.value;
  }
};

// Observer les changements de la recherche
watch([searchQuery, () => route.query.search], () => {
  filterPodcasts();
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
