<template>
  <div class="text-white px-5">
    <section class="w-full py-10 flex flex-col">
      <div class="flex justify-between">
        <button @click="$router.back()">
          <Icon name="material-symbols-light:arrow-back-ios-rounded" size="27" />
        </button>
        <div class="flex gap-5 items-center justify-center">
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
      <div class="flex flex-col md:flex-row justify-center items-center">
        <div class="img-podcast w-56 h-56 md:mr-6" :style="{ backgroundImage: 'url(' + podcast.thumbnail_path + ')' }">
        </div>
        <div>
          <h1 class="text-4xl font-bold text-white mt-4">{{ podcast.title }}</h1>
          <p class="text-lg text-white mt-2">{{ podcast.description }}</p>
        </div>
      </div>

      <!-- Liste des épisodes -->
      <div class="mt-10 px-6" v-if="filteredEpisodes.length">
        <div class="flex justify-between w-full">
          <h2 class="text-3xl font-bold text-white">Les épisodes</h2>
          <button class="text-4xl font-thin" @click="showAddEpisodeModal = true">+</button>
        </div>
        <div class="flex flex-col gap-2 mt-10">
          <CardEpisode v-for="episode in filteredEpisodes" :key="episode.id" :episode="episode" />
        </div>
        <div class="w-full flex justify-center mt-10">
          <button class="italic mb-2 px-5 pt-1 pb-2 bg-dooplerr-purple-dark border border-white rounded-full" @click="showAddEpisodeModal = true">+ Ajouter un épisode</button>
        </div>
      </div>

      <section v-else>
        <div class="px-5 font-medium">
          <h2 class="text-2xl italic pt-10 pb-6 font-medium">Mes épisodes</h2>
          <div class="flex flex-col w-full justify-center items-center">
            <p class="text-dooplerr-grey-purple font-medium pb-6">Aucun épisode pour le moment...</p>
            <div class="flex flex-col items-center py-20 w-3/4 border-dashed-custom rounded-xl">
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEpisodes } from '~/composables/useEpisodes';
import { usePodcasts } from '~/composables/usePodcasts';
import Modal from '~/components/Modal.vue';
import EditPodcastForm from '~/components/EditPodcastForm.vue';
import AddEpisodeForm from '~/components/AddEpisodeForm.vue';
import CardEpisode from '~/components/CardEpisode.vue';

const { params } = useRoute();
const { getEpisodes, getPodcastById } = useEpisodes();
const { deletePodcastById } = usePodcasts();
const showSuccessAlert = ref(false);
const showSuccessAlertEpisode = ref(false);

const podcast = ref({});
const podcastEpisodes = ref([]);
const showEditModal = ref(false);
const showAddEpisodeModal = ref(false);
const showDeleteConfirmation = ref(false);
const isLoading = ref(true);
const router = useRouter();

async function fetchPodcastDetails() {
  try {
    podcast.value = await getPodcastById(params.id);
  } catch (error) {
    console.error('Error fetching podcast details:', error);
  }
}

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

async function deletePodcast() {
  try {
    await deletePodcastById(params.id);
    router.push('/profile');
  } catch (error) {
    console.error('Error deleting podcast:', error);
  }
}

onMounted(async () => {
  await fetchPodcastDetails();
  await fetchPodcastEpisodes();

  if (localStorage.getItem('podcastEdited') === 'true') {
    showSuccessAlert.value = true;
    localStorage.removeItem('podcastEdited');
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 5000);
  }
  if (localStorage.getItem('episodeAdded') === 'true') {
    showSuccessAlertEpisode.value = true;
    localStorage.removeItem('episodeAdded');
    setTimeout(() => {
      showSuccessAlertEpisode.value = false;
    }, 5000);
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
  border: 0.4em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
</style>
