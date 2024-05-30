<template>
  <div class="container max-w-screen-sm mx-auto mb-28">
    <!-- Titre de l'épisode -->
    <div class="flex justify-around h-32 items-center">
      <h3 class="text-base md:text-xl font-bold text-white">
        {{ episode.title }}
      </h3>
    </div>

    <!-- Image de l'épisode -->
    <div class="flex flex-col justify-center items-center px-8">
      <div v-if="episode.Podcasts && episode.Podcasts.length > 0" class="img-podcast w-full max-w-[340px] aspect-square rounded-md">
        <img :src="episode.Podcasts[0].thumbnail_path" alt="Image de l'épisode" class="rounded-md w-full h-full object-cover aspect-square">
      </div>
      <div class="w-full flex my-8 justify-between">
        <h1 class="text-lg italic text-white">{{ episode.title }}</h1>
        <!-- Bouton de like -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.29l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.47L12 21.29z" />
        </svg>
      </div>
    </div>

    <!-- Lecteur audio -->
    <div v-if="episode" class="w-full flex flex-col items-center px-8">
      <audio ref="audio" :src="episode.file_path" preload="metadata"></audio>
      <div class="w-full bg-gray-800 rounded-full h-1 relative" @click="onProgressBarClick">
        <div class="bg-white h-1 rounded-full" :style="{ width: progress + '%' }"></div>
        <div class="absolute progress-dot top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white w-4 h-4 rounded-full" :style="{ left: calcProgressDotPosition }"></div>
      </div>
      <div class="flex justify-center mt-4">
        <button @click="togglePlayPause" class="text-white">
          <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="M14 19V5h4v14zm-8 0V5h4v14z" />
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8 19V5l11 7z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Section des commentaires -->
    <div class="mt-15 px-8" v-if="episode.Comments">
      <h2 class="text-base font-semibold italic text-white mb-4">
        <!-- Nombre de commentaire avec ou sans s à commentaire -->
        {{ episode.Comments.length > 1 ? episode.Comments.length + ' commentaires' : episode.Comments.length + ' commentaire' }}
      </h2>
      <!-- Form add comment -->
      <div class="flex gap-4">
        <input v-model="newComment" @keydown.enter="submitComment" type="text" class="w-full border-0 border-b-2 bg-transparent text-white mb-5" placeholder="Ajouter un commentaire">
      </div>
      <div v-for="comment in episode.Comments" :key="comment.id" class="mb-4">
        <div class="flex gap-2 items-start">
          <div class="flex items-center gap-3">
            <div v-if="comment.Users && comment.Users.length > 0 && comment.Users[0].image_path">
              <img :src="comment.Users[0].image_path" alt="Avatar" height="36" width="36" class="rounded-full bg-white">
            </div>
            <div v-else>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" :fill="randomColor" />
              </svg>
            </div>
          </div>

          <div class="flex flex-col gap-2 pt-1">
            <div class="flex gap-2 items-baseline">
              <h3 class="text-white font-semibold" v-if="comment.Users && comment.Users.length > 0">{{ comment.Users[0].username }}</h3>
              <span class="text-gray-400 text-sm">{{ formatDate(comment.date) }}</span>
            </div>
            <p class="text-white">{{ comment.text }}</p>
          </div>
        </div>
        <!-- Pas de commentaires disponibles pour ce podcast -->
        <div v-if="episode.Comments.length === 0" class="text-white">
          <p>Pas de commentaires disponibles pour cet épisode.</p>
        </div>
      </div>
    </div>
    <div class="w-full h-28"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEpisodes } from '@/composables/useEpisodes';
import { useComments } from '@/composables/useComments'; // Correct composable

const { params } = useRoute();
const { getEpisodeById } = useEpisodes();
const { addComment } = useComments();

const episode = ref({});
const isPlaying = ref(false);
const progress = ref(0);
const progressDotPosition = ref(0);
const newComment = ref("");

const audio = ref(null);

// Récupérer l'épisode par son ID
const fetchEpisode = async () => {
  const loadedEpisode = await getEpisodeById(params.id);
  episode.value = loadedEpisode;
};

onMounted(fetchEpisode);

// Mettre en pause ou jouer l'audio
const togglePlayPause = () => {
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

// Mettre à jour la position du point de progression
const calcProgressDotPosition = computed(() => {
  return `calc(${progress.value}% - 2px)`;
});

// Mettre à jour la position de la barre de progression
const onProgressBarClick = (event) => {
  const progressBar = event.currentTarget;
  const clickPosition = event.offsetX;
  const progressBarWidth = progressBar.offsetWidth;

  const newProgress = (clickPosition / progressBarWidth) * 100;
  progress.value = newProgress;
  progressDotPosition.value = newProgress;

  audio.value.currentTime = (audio.value.duration / 100) * newProgress;
};

// Mettre à jour la progression de l'audio
const updateProgress = () => {
  if (audio.value) {
    progress.value = (audio.value.currentTime / audio.value.duration) * 100;
    progressDotPosition.value = progress.value;
  }
};

// Mettre à jour la progression de l'audio
onMounted(() => {
  if (audio.value) {
    audio.value.addEventListener('timeupdate', updateProgress);
  }
});

// Supprimer l'écouteur d'événement lors du démontage du composant
onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener('timeupdate', updateProgress);
  }
});

// Fonction pour formater la date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

// Soumettre un nouveau commentaire
const submitComment = async () => {
  if (newComment.value.trim() === "") return;

  try {
    await addComment(params.id, newComment.value);
    newComment.value = "";
    await fetchEpisode(); // Rafraîchir les commentaires après l'ajout
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// Générer une couleur aléatoire
const randomColor = computed(() => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
});
</script>

<style scoped>
/* Add your CSS styles here */
</style>
