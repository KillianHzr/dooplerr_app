<template>
  <div class="text-white">
    <!-- Section de navigation avec bouton de retour et options de modification/déconnexion -->
    <section class="w-full py-10 flex flex-col px-5">
      <div class="flex justify-between">
        <button @click="$router.back()">
          <Icon name="material-symbols-light:arrow-back-ios-rounded" size="27" />
        </button>
        <div class="flex gap-5 items-center justify-center">
          <button v-if="isAuthenticated" @click="logout" class="flex items-center justify-center border border-dooplerr-grey-purple rounded-full text-xs py-1 px-4">
            <Icon name="material-symbols:logout-rounded" size="20" />
          </button>
          <button class="border border-dooplerr-grey-purple rounded-full text-xs py-1 px-10 italic">Modifier</button>
        </div>
      </div>
    </section>

    <!-- Notification de succès pour l'ajout de podcast -->
    <div v-if="showSuccessAlert" class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50 m-5">
      Podcast ajouté avec succès
    </div>

    <!-- Section de chargement avec un spinner -->
    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <!-- Profil utilisateur avec image et statistiques -->
    <section v-else>
      <div class="px-5 flex">
        <img :src="user.image_path" class="rounded-full bg-gray-300 me-8 border-dooplerr-grey-purple border" width="90" height="90" style="min-width: 90px; min-height: 90px; max-height: 90px; max-width: 90px; object-fit: cover;" />
        <div class="flex flex-grow">
          <div class="flex flex-col justify-center">
            <h1 class="text-2xl italic font-medium">{{ user.username }}</h1>
            <p>286 <span class="text-dooplerr-grey-purple">abonnés</span></p>
            <p>123 <span class="text-dooplerr-grey-purple">abonnements</span></p>
          </div>
          <div class="ml-auto self-end">
            <button @click="shareProfile"><Icon name="material-symbols:ios-share-rounded" size="20" /></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Liste des podcasts de l'utilisateur -->
    <section v-if="!isLoading && userPodcasts.length">
      <div class="px-5 font-medium">
        <div class="flex justify-between w-full">
          <h2 class="text-2xl italic pt-10 pb-6 font-medium">Mes podcasts</h2>
          <button class="text-4xl font-thin" @click="showAddPodcastModal = true">+</button>
        </div>
        <div class="flex flex-col gap-4">
          <PodcastCard
            v-for="podcast in userPodcasts"
            :key="podcast.id"
            :id="podcast.id"
            :thumbnail_path="podcast.thumbnail_path"
            :title="podcast.title"
            :description="podcast.description"
            :listening="podcast.listening"
            :likes="podcast.likes"
            :comments="podcast.comments"
            :isPublic="podcast.public"
          />
        </div>
        <div class="w-full flex justify-center mt-20">
          <button class="italic mb-2 px-5 pt-1 pb-2 bg-dooplerr-purple-dark border border-white rounded-full" @click="showAddPodcastModal = true">+ Ajouter un podcast</button>
        </div>
      </div>
    </section>

    <!-- Message affiché lorsqu'il n'y a aucun podcast -->
    <section v-else-if="!isLoading">
      <div class="px-5 font-medium">
        <h2 class="text-2xl italic pt-10 pb-6 font-medium">Mes podcasts</h2>
        <div class="flex flex-col w-full justify-center items-center">
          <p class="text-dooplerr-grey-purple font-medium pb-6">Aucun podcast pour le moment...</p>
          <div class="flex flex-col items-center py-40 w-3/4 border-dashed-custom rounded-xl">
            <button class="italic mb-2 px-5 pt-1 pb-2 bg-dooplerr-purple-dark border border-white rounded-full" @click="showAddPodcastModal = true">+ Ajouter un podcast</button>
            <span class="italic text-sm text-dooplerr-grey-purple">Glisser un média</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Modale pour ajouter un podcast -->
    <Modal v-if="showAddPodcastModal" @close="showAddPodcastModal = false">
      <AddPodcastForm @close="showAddPodcastModal = false" />
    </Modal>
  </div>
</template>

<script setup>
import { inject, ref, watchEffect, onMounted } from 'vue';
import PodcastCard from '~/components/PodcastCard.vue';
import Modal from '~/components/Modal.vue';
import AddPodcastForm from '~/components/AddPodcastForm.vue';
import { usePodcasts } from '~/composables/usePodcasts';

const router = useRouter();
const user = inject('user');

// Références pour l'état du composant
const userPodcasts = ref([]);
const isLoading = ref(true);
const showAddPodcastModal = ref(false);
const showSuccessAlert = ref(false);

// Récupération des podcasts de l'utilisateur
const { getUserPodcasts } = usePodcasts();

// Fonction pour déconnecter l'utilisateur
const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  user.value = {};
  router.push('/auth');
};

// Fonction pour partager le profil de l'utilisateur
const shareProfile = () => {
  if (navigator.share) {
    navigator.share({
      title: `Dooplerr | ${user.value.username}`,
      text: 'Venez voir mon profil sur Dooplerr, la nouvelle plateforme de podcasts !',
      url: window.location.href,
    })
    .then(() => console.log('Profile shared successfully'))
    .catch((error) => console.error('Error sharing profile:', error));
  } else {
    console.error('Web Share API is not supported in this browser');
  }
};

// Surveillance des changements dans l'objet utilisateur et récupération des podcasts
watchEffect(async () => {
  if (user.value && user.value.id) {
    try {
      userPodcasts.value = await getUserPodcasts(user.value.id);
    } catch (error) {
      console.error('Error fetching user podcasts:', error);
    } finally {
      isLoading.value = false;
    }
  }
});

// Vérification et affichage de l'alerte de succès au montage du composant
onMounted(() => {
  if (localStorage.getItem('podcastAdded') === 'true') {
    showSuccessAlert.value = true;
    localStorage.removeItem('podcastAdded');
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 3000);
  }
});
</script>

<style>
.border-dashed-custom {
  border: 2px dashed #706D92;
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
</style>
