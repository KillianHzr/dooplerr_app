<template>
  <div>
    <!-- Titre de la section Modifier le podcast -->
    <h2 class="text-white text-2xl font-semibold mb-4 italic">Modifier le podcast</h2>
    <!-- Formulaire de modification du podcast -->
    <form @submit.prevent="handleUpdatePodcast" class="flex flex-col gap-2">
      <!-- Champ de saisie du titre -->
      <div class="mb-4 border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="title">Titre <span class="text-sm font-normal">(obligatoire)</span></label>
        <input
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="title" name="title" type="text" v-model="title" required
          placeholder="Votre titre"
          style="box-shadow: none;">
      </div>
      <!-- Champ de saisie de la description -->
      <div class="mb-4 border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="description">Description <span class="text-sm font-normal">(obligatoire)</span></label>
        <textarea
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="description" name="description" v-model="description" required
          style="box-shadow: none;"></textarea>
      </div>
      <div class="flex">
        <div class="flex flex-col mr-8">
          <!-- Sélecteur de catégorie -->
          <div class="mb-4">
            <label class="block text-white font-medium text-lg" for="category">Catégorie</label>
            <select
              class="bg-transparent shadow-none appearance-none border border-white rounded-xl w-full py-2 px-3 text-white leading-tight"
              style="outline: none; box-shadow: none; border-color: white !important;"
              id="category" name="category" v-model="selectedCategory" required>
              <option disabled value="">Sélectionner une catégorie</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
            </select>
          </div>
          <!-- Sélecteur public/privé -->
          <div class="mb-4">
            <label class="block text-white font-medium text-lg" for="public">Public</label>
            <select
              class="bg-transparent shadow-none appearance-none border border-white rounded-xl w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              style="outline: none; box-shadow: none; border-color: white !important;"
              id="public" name="public" v-model="isPublic" required>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </div>
        <!-- Zone de téléchargement de la miniature -->
        <div class="ml-auto">
          <div @click="triggerFileInput" :style="thumbnailStyle" class="border-dashed-custom bg-transparent rounded-xl w-full text-white font-medium text-lg text-center cursor-pointer aspect-square flex justify-center items-center flex-col" style="width: 160px; height: 160px;">
            Miniature
            <span class="text-sm font-thin">(obligatoire)</span>
          </div>
          <input
            ref="fileInput"
            class="hidden"
            id="thumbnail" name="thumbnail"
            type="file"
            @change="handleFileChange">
        </div>
      </div>
      <!-- Bouton de soumission et messages d'erreur ou de succès -->
      <div class="flex items-center justify-center w-full flex-col gap-3">
        <button
          class="border-white border text-white font-medium py-2 mt-6 px-10 rounded-xl focus:outline-none focus:shadow-outline"
          type="submit">Modifier</button>
        <div v-if="error" class="text-red-300 text-sm">{{ error }}</div>
        <div v-if="success" class="text-green-300 text-sm">{{ success }}</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePodcasts } from '~/composables/usePodcasts';
import { useCategories } from '~/composables/useCategories';

// Fonction pour mettre à jour le podcast
const { updatePodcast } = usePodcasts();
// Fonction pour obtenir les catégories
const { getCategories } = useCategories();

// Définition des props pour obtenir les détails du podcast
const props = defineProps(['podcast']);

// Initialisation des variables réactives avec les données du podcast
const title = ref(props.podcast.title);
const description = ref(props.podcast.description);
const selectedCategory = ref(props.podcast.category_name || '');
const isPublic = ref(props.podcast.public ? 'true' : 'false');
const thumbnail = ref(null);
const error = ref('');
const success = ref('');
const categories = ref([]);
const thumbnailURL = ref(props.podcast.thumbnail_path);

// Référence pour l'élément input de fichier
const fileInput = ref(null);

// Fonction pour gérer le changement de fichier
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    thumbnail.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      thumbnailURL.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Fonction pour déclencher l'input de fichier
const triggerFileInput = () => {
  fileInput.value.click();
};

// Style de la miniature basée sur l'URL de la miniature téléchargée
const thumbnailStyle = computed(() => {
  return thumbnailURL.value ? { backgroundImage: `url(${thumbnailURL.value})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
});

// Fonction pour soumettre les modifications du podcast
const handleUpdatePodcast = async () => {
  error.value = '';
  success.value = '';

  if (!thumbnail.value && !thumbnailURL.value) {
    error.value = 'Veuillez télécharger une miniature';
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('category_name', selectedCategory.value);
    formData.append('public', isPublic.value);
    if (thumbnail.value) {
      formData.append('thumbnail', thumbnail.value);
    }

    await updatePodcast(props.podcast.id, formData);
    localStorage.setItem('podcastEdited', 'true');
    window.location.reload();
  } catch (err) {
    console.error('Error updating podcast:', err);
    if (err.response && err.response.data) {
      error.value = `Erreur: ${err.response.data.message}`;
    } else {
      error.value = 'Erreur lors de la mise à jour du podcast';
    }
  }
};

// Chargement des catégories au montage du composant
onMounted(async () => {
  try {
    categories.value = await getCategories();
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
});
</script>

<style scoped>
  /* Styles pour les options de sélection */
  select option {
      color: white;
      background-color: #0D0B21;
  }

  select option:hover,
  select option:checked {
      background-color: #C4B1D4;
      color: black;
  }

  /* Style personnalisé pour les bordures en pointillés */
  .border-dashed-custom {
      border: 2px dashed white;
  }
</style>
