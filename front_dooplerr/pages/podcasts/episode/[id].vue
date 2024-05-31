<template>
  <div class="container max-w-screen-sm mx-auto mb-28">
    <!-- Titre de l'épisode -->
    <div class="flex justify-around my-10 px-8 items-center relative w-full">
      <button @click="$router.back()" class="text-white absolute left-0 top-0 px-8">
        <Icon name="material-symbols-light:arrow-back-ios-rounded" size="27" />
      </button>
      <h3 class="text-base md:text-xl font-bold text-white">
        {{ episode.title }}
      </h3>
    </div>

    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <div v-else>
      <!-- Image de l'épisode -->
      <div class="flex flex-col justify-center items-center px-8">
        <div v-if="episode.Podcasts && episode.Podcasts.length > 0" class="img-podcast w-full max-w-[340px] aspect-square rounded-md">
          <img :src="episode.Podcasts[0].thumbnail_path" 
          :alt="episode.Podcasts[0].title + ` ` + episode.title"
           class="rounded-lg w-full h-full object-cover aspect-square">
        </div>
        <div class="w-full flex my-8 justify-between">
          <div class="flex flex-col">
            <h2 class="text-2xl italic font-semibold text-white">{{ episode.Podcasts && episode.Podcasts.length > 0 ? episode.Podcasts[0].title : '' }}</h2>
            <h1 class="text-lg text-white">"{{ episode.title }}"</h1>
          </div>
          
          <!-- Bouton de like -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.29l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.47L12 21.29z" />
          </svg>
        </div>
      </div>

      <!-- Lecteur audio -->
      <div v-if="episode" class="w-full flex flex-col items-center px-8 mt-2">
        <audio ref="audio" :src="episode.file_path" preload="metadata" :alt="episode.title"></audio>
        <div class="w-full bg-gray-800 rounded-full h-1 relative" @click="onProgressBarClick">
          <div class="bg-dooplerr-purple-light h-1 rounded-full" :style="{ width: progress + '%' }"></div>
          <div class="absolute progress-dot top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-dooplerr-purple-light w-4 h-4 rounded-full" :style="{ left: calcProgressDotPosition }"></div>
        </div>
        <div class="flex justify-center items-center mt-12 text-white gap-10">
          <button><Icon name="material-symbols:skip-previous-rounded" size="35" /></button>
          <button @click="togglePlayPause" class="text-white border-4 rounded-full border-white p-2" aria-label="Lecture ou pause de l'épisode">
            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14 19V5h4v14zm-8 0V5h4v14z" />
            </svg>

            <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8 19V5l11 7z" />
            </svg>
          </button>
          <button><Icon name="material-symbols:skip-next-rounded" size="35" /></button>
        </div>
        <div class="flex justify-between w-full text-white mt-8">
          <button><Icon name="ic:outline-speaker" size="30" /></button>
          <button><Icon name="material-symbols:ios-share-rounded" size="30" /></button>
        </div>
      </div>
      <NuxtLink :to="`/podcasts/` + episode.Podcasts[0].id" class="px-8 pt-14 flex text-white">
        <img :src="episode.Podcasts[0].thumbnail_path" class="rounded-lg bg-gray-300 me-8" width="90" height="90" style="min-width: 90px; min-height: 90px; max-height: 90px; max-width: 90px; object-fit: cover;" />
        <div class="flex flex-col justify-center">
          <h3 class="text-xl font-medium italic">{{ episode.Podcasts[0].title }}</h3>
          <h4>{{ description }}</h4>
          <div class="flex items-center">
            <span class="font-thin">5 K abonnés</span>
          </div>
        </div>
        <div class="ml-auto">
          <Icon name="material-symbols:notifications-active-outline-rounded" size="30" />
        </div>
      </NuxtLink>
      <div class="px-8 pt-8">
        <div :class="{ 'max-h-full': showFullDescription }" class="text-lg text-black mt-2 description-box bg-[#6C6A88] p-2 mb-5 rounded-md transition-all duration-300 ease-in-out">
          <p class="text-white italic font-medium">Il y a {{ timeSince(episode.Podcasts[0].createdAt) }}</p>
          <p :class="{ 'line-clamp': !showFullDescription }" class="font-medium py-4">{{ episode.Podcasts[0].description }}</p>
          <button v-if="!showFullDescription" @click="showFullDescription = true" class="text-white mt-2 block">Voir plus</button>
          <button v-if="showFullDescription" @click="showFullDescription = false" class="text-white mt-2 block">Voir moins</button>
        </div>
      </div>
      
      <!-- Section des commentaires -->
      <div class="pt-6 px-8" v-if="episode.Comments">
        <h2 class="text-base font-semibold italic text-white mb-4">
          <!-- Nombre de commentaire avec ou sans s à commentaire -->
          {{ episode.Comments.length > 1 ? episode.Comments.length + ' commentaires' : episode.Comments.length + ' commentaire' }}
        </h2>
        <!-- Form add comment -->
        <div class="flex gap-4">
          <input v-model="newComment" @keydown.enter="submitComment" type="text" class="w-full border-0 border-b-2 bg-transparent text-white mb-5" placeholder="Ajouter un commentaire" aria-label="Ajouter un commentaire">
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

            <div class="flex flex-col gap-2 pt-1 w-full">
              <div class="flex gap-2 items-baseline">
                <h3 class="text-white font-semibold" v-if="comment.Users && comment.Users.length > 0">{{ comment.Users[0].username }}</h3>
                <span class="text-gray-400 text-sm">{{ formatDate(comment.date) }}</span>
              </div>
              <p class="text-white overflow-wrap-break-word pe-16">{{ comment.text }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEpisodes } from '@/composables/useEpisodes';
import { useComments } from '@/composables/useComments'; 

const { params } = useRoute();
const { getEpisodeById } = useEpisodes();
const { addComment } = useComments();

const episode = ref({});
const isPlaying = ref(false);
const progress = ref(0);
const progressDotPosition = ref(0);
const newComment = ref("");
const isLoading = ref(true); 
const showFullDescription = ref(false);

const audio = ref(null);

// Function pour loader les metadata de l'épisode
const updateMediaSessionMetadata = () => {
  if ('mediaSession' in navigator && episode.value) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: episode.value.title,
      artist: episode.value.Podcasts[0]?.title || 'Unknown',
      album: 'Podcast',
      artwork: [
        { src: episode.value.Podcasts[0]?.thumbnail_path || '', sizes: '96x96', type: 'image/png' },
        { src: episode.value.Podcasts[0]?.thumbnail_path || '', sizes: '128x128', type: 'image/png' },
        { src: episode.value.Podcasts[0]?.thumbnail_path || '', sizes: '192x192', type: 'image/png' },
        { src: episode.value.Podcasts[0]?.thumbnail_path || '', sizes: '256x256', type: 'image/png' },
        { src: episode.value.Podcasts[0]?.thumbnail_path || '', sizes: '384x384', type: 'image/png' },
        { src: episode.value.Podcasts[0]?.thumbnail_path || '', sizes: '512x512', type: 'image/png' }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
      audio.value.play();
      isPlaying.value = true;
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audio.value.pause();
      isPlaying.value = false;
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      audio.value.currentTime = Math.max(audio.value.currentTime - (details.seekOffset || 10), 0);
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      audio.value.currentTime = Math.min(audio.value.currentTime + (details.seekOffset || 10), audio.value.duration);
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      audio.value.pause();
      audio.value.currentTime = 0;
      isPlaying.value = false;
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.fastSeek && 'fastSeek' in audio.value) {
        audio.value.fastSeek(details.seekTime);
        return;
      }
      audio.value.currentTime = details.seekTime;
      // Mettre à jour la barre de progression et le point
      updateProgress();
    });
  }
};


// Fetch episode by ID
const fetchEpisode = async () => {
  try {
    const loadedEpisode = await getEpisodeById(params.id);
    episode.value = loadedEpisode;
    updateMediaSessionMetadata();
    setMetaTags();
  } catch (error) {
    console.error('Error fetching episode:', error);
  } finally {
    isLoading.value = false;
  }
};

// Set meta tags
function setMetaTags() {
  useHead({
    title: episode.value.title,
    meta: [
      { name: 'description', content: episode.value.Podcasts[0].description },
      { property: 'og:title', content: episode.value.title },
      { property: 'og:description', content: episode.value.Podcasts[0].description },
      { property: 'og:image', content: episode.value.Podcasts[0].thumbnail_path },
    ],
  });
}

onMounted(fetchEpisode);

// Toggle play and pause
const togglePlayPause = () => {
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const calcProgressDotPosition = computed(() => {
    return `calc(${progress.value}% - 2px)`;
});

// Update progress
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

// Watch isPlaying pour mettre à jour les metadata
watch(isPlaying, (newVal) => {
  if (newVal) {
    updateMediaSessionMetadata();
  }
});

// Function to handle progress bar click
const onProgressBarClick = (event) => {
  const progressBar = event.currentTarget;
  const clickPosition = event.offsetX;
  const progressBarWidth = progressBar.offsetWidth;

  const newProgress = (clickPosition / progressBarWidth) * 100;
  progress.value = newProgress;
  progressDotPosition.value = newProgress;

  audio.value.currentTime = (audio.value.duration / 100) * newProgress;
};

// Function pour afficher la description complète
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', options);
};

// Calculer le temps écoulé depuis la date
const timeSince = (date) => {
  const now = new Date();
  const createdDate = new Date(date);
  const seconds = Math.floor((now - createdDate) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " ans";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " mois";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " jours";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " heures";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " secondes";
};

// Envoyer un commentaire
const submitComment = async () => {
  if (newComment.value.trim() === "") return;

  try {
    await addComment(params.id, newComment.value);
    newComment.value = "";
    await fetchEpisode(); // Refresh comments after adding
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

// Generer une couleur aléatoire
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

.overflow-wrap-break-word {
  overflow-wrap: break-word;
}
</style>
