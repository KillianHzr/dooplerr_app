<template>
  <div class="px-5">
    <section class="w-full py-10 flex flex-col text-white">
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
    <div class="container mx-auto">
      <h2 class="text-xl font-bold text-white mb-4 italic">
        TOUS LES PODCASTS
      </h2>
      <div class="list-content mb-24 text-white">
        <PodcastCard
          v-for="podcast in filteredPodcasts"
          :key="podcast.id"
          :id="podcast.id"
          :thumbnail_path="podcast.thumbnail_path"
          :title="podcast.title"
          :description="podcast.description"
          :commentsCount="podcast.commentsCount"
          :isPublic="podcast.isPublic"
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
const searchInput = ref(null); // Define a ref to the search input

onMounted(async () => {
  const allPodcasts = await getPodcasts();
  podcasts.value = allPodcasts.filter(podcast => podcast.public);
  searchQuery.value = route.query.search || '';
  filterPodcasts();

  // Focus the input after the component is mounted
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
