<template>
  <div class="text-white px-5">
    <section class="w-full py-10 flex flex-col">
      <div class="flex justify-between">
        <button @click="$router.back()">
          <Icon name="material-symbols-light:arrow-back-ios-rounded" size="27" />
        </button>
        <div v-if="isOwner" class="flex gap-5 items-center justify-center">
          <button @click="showDeleteConfirmation = true" class="flex items-center justify-center border border-dooplerr-grey-purple rounded-full text-xs py-1 px-4">
            <Icon name="material-symbols:delete-outline-rounded" size="20" />
          </button>
          <button @click="showEditModal = true" class="border border-dooplerr-grey-purple rounded-full text-xs py-1 px-10 italic">Modifier</button>
        </div>
      </div>
    </section>

    <div v-if="showSuccessAlert" class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50 m-5">
      Podcast modifié avec succès
    </div>

    <div v-if="showSuccessAlertEpisode" class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50 m-5">
      Épisode ajouté avec succès
    </div>

    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <div v-else>
      <!-- Contenu du podcast -->
      <div class="flex flex-col md:flex-row justify-center items-center md:items-start px-6">
        <div class="img-podcast w-full md:w-1/4 md:mr-6 aspect-square rounded-lg" :style="{ backgroundImage: 'url(' + podcast.thumbnail_path + ')' }" :alt="`Podcast - ${podcast.title}`" style="max-width: 350px; max-height: 350px;"></div>
        <div class="w-full md:w-3/4">
          <h1 class="w-full text-center text-4xl font-bold text-white mt-4">{{ podcast.title }}</h1>
          <div :class="{ 'max-h-full': showFullDescription }" class="w-full text-lg text-white mt-2 description-box bg-[#6C6A88] p-2 rounded-md transition-all duration-300 ease-in-out">
            <p :class="{ 'line-clamp': !showFullDescription }" class="font-medium pb-4 opacity-85">{{ podcast.description }}</p>
            <button v-if="!showFullDescription" @click="showFullDescription = true" class="text-white mt-2 block">Voir plus</button>
            <button v-if="showFullDescription" @click="showFullDescription = false" class="text-white mt-2 block">Voir moins</button>
          </div>
        </div>
      </div>

      <!-- Liste des épisodes -->
      <div class="mt-10 px-6" v-if="filteredEpisodes.length">
        <div class="flex justify-between w-full">
          <h2 class="text-3xl font-bold text-white">Les épisodes</h2>
          <button v-if="isOwner" class="text-4xl font-thin" @click="showAddEpisodeModal = true">+</button>
        </div>
        <div class="flex flex-col gap-2 mt-10">
          <CardEpisode v-for="episode in filteredEpisodes" :key="episode.id" :episode="episode" />
        </div>
        <div v-if="isOwner" class="w-full flex justify-center mt-10">
          <button class="italic mb-2 px-5 pt-1 pb-2 bg-dooplerr-purple-dark border border-white rounded-full" @click="showAddEpisodeModal = true">+ Ajouter un épisode</button>
        </div>
      </div>

      <section v-else>
        <div class="px-5 font-medium">
          <h2 class="text-2xl italic pt-10 pb-6 font-medium">Mes épisodes</h2>
          <div class="flex flex-col w-full justify-center items-center">
            <p class="text-dooplerr-grey-purple font-medium pb-6">Aucun épisode pour le moment...</p>
            <div v-if="isOwner" class="flex flex-col items-center py-20 w-3/4 border-dashed-custom rounded-xl">
              <button class="italic mb-2 px-5 pt-1 pb-2 bg-dooplerr-purple-dark border border-white rounded-full" @click="showAddEpisodeModal = true">+ Ajouter un épisode</button>
              <span class="italic text-sm text-dooplerr-grey-purple">Glisser un média</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Add Episode Modal -->
      <Modal v-if="showAddEpisodeModal" @close="showAddEpisodeModal = false">
        <AddEpisodeForm :podcast_name="podcast.title" @close="showAddEpisodeModal = false" @success="fetchPodcastEpisodes" />
      </Modal>

      <!-- Edit Podcast Modal -->
      <Modal v-if="showEditModal" @close="showEditModal = false">
        <EditPodcastForm :podcast="podcast" @close="showEditModal = false" />
      </Modal>

      <!-- Delete Podcast Confirmation Modal -->
      <Modal v-if="showDeleteConfirmation" @close="showDeleteConfirmation = false">
        <div class="p-5">
          <h3 class="text-2xl mb-4 font-medium italic">Confirmer la suppression</h3>
          <p>Es-tu sûr de vouloir supprimer ce podcast ? Cette action est irréversible.</p>
          <div class="flex justify-end gap-3 mt-5">
            <button class="border-white border rounded-full text-white py-2 px-4" @click="deletePodcast">Supprimer</button>
            <button class="border-white border rounded-full text-white py-2 px-4 opacity-75" @click="showDeleteConfirmation = false">Annuler</button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>

const { params } = useRoute();
const { getEpisodes, getPodcastById } = useEpisodes();
const { deletePodcastById } = usePodcasts();
const showSuccessAlert = ref(false);
const showSuccessAlertEpisode = ref(false);
const showFullDescription = ref(false);

const user = inject('user');
const podcast = ref({});
const podcastEpisodes = ref([]);
const showEditModal = ref(false);
const showAddEpisodeModal = ref(false);
const showDeleteConfirmation = ref(false);
const isLoading = ref(true);
const router = useRouter();
const isOwner = ref(false);

// Récupérer les détails du podcast
async function fetchPodcastDetails() {
  try {
    podcast.value = await getPodcastById(params.id);
    setMetaTags();
  } catch (error) {
    console.error('Error fetching podcast details:', error);
  }
}

// Définir les meta tags de la page
function setMetaTags() {
  useHead({
    title: podcast.value.title,
    meta: [
      { name: 'description', content: podcast.value.description },
      { property: 'og:title', content: podcast.value.title },
      { property: 'og:description', content: podcast.value.description },
      { property: 'og:image', content: podcast.value.thumbnail_path },
    ],
  });
}

// Récupérer les épisodes du podcast
async function fetchPodcastEpisodes() {
  try {
    const episodes = await getEpisodes();
    podcastEpisodes.value = episodes.filter(episode => episode.Podcasts.some(p => p.id === parseInt(params.id)));
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
  } finally {
    isLoading.value = false;
  }
}

// Supprimer le podcast actuel
async function deletePodcast() {
  try {
    await deletePodcastById(params.id);
    router.push('/profile');
  } catch (error) {
    console.error('Error deleting podcast:', error);
  }
}

// Lifecycle hooks
onMounted(async () => {
  await fetchPodcastDetails();
  await fetchPodcastEpisodes();

  if (localStorage.getItem('podcastEdited') === 'true') {
    showSuccessAlert.value = true;
    localStorage.removeItem('podcastEdited');
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 3000);
  }
  if (localStorage.getItem('episodeAdded') === 'true') {
    showSuccessAlertEpisode.value = true;
    localStorage.removeItem('episodeAdded');
    setTimeout(() => {
      showSuccessAlertEpisode.value = false;
    }, 3000);
  }

  if (user.value.id === podcast.value.Users[0].id) {
    isOwner.value = true;
  }
});

const filteredEpisodes = computed(() => podcastEpisodes.value);
</script>

<style scoped>
.img-podcast {
  background-size: cover;
  background-position: center;
}

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

.description-box {
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.max-h-20 {
  max-height: 5rem;
}

.max-h-full {
  max-height: 100%;
}
</style>
