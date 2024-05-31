<template>
  <div>
    <!-- Titre de la section Détails -->
    <h2 class="text-white text-2xl font-semibold mb-4 italic">Détails</h2>
    <!-- Formulaire de soumission du podcast -->
    <form @submit.prevent="submitPodcast" class="flex flex-col gap-2">
      <!-- Champ de saisie du titre -->
      <div class="mb-4 order border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="title">Titre <span class="text-sm font-normal">(obligatoire)</span></label>
        <input
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="title" type="text" v-model="title" required
          placeholder="Votre titre"
          style="box-shadow: none;">
      </div>
      <!-- Champ de saisie de la description -->
      <div class="mb-4 order border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="description">Description <span class="text-sm font-normal">(obligatoire)</span></label>
        <textarea
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="description" v-model="description" required
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
              v-model="selectedCategory" required>
              <option disabled value="">Sélectionner une catégorie</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
            </select>
          </div>
          <!-- Sélecteur de public -->
          <div class="mb-4">
            <label class="block text-white font-medium text-lg" for="public">Public</label>
            <select
              class="bg-transparent shadow-none appearance-none border border-white rounded-xl w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              style="outline: none; box-shadow: none; border-color: white !important;"
              v-model="isPublic" required>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </div>
        <div class="ml-auto">
          <!-- Zone de téléchargement de miniature -->
          <div @click="triggerFileInput" :style="thumbnailStyle" class="border-dashed-custom bg-transparent rounded-xl w-full text-white font-medium text-lg text-center cursor-pointer aspect-square flex justify-center items-center flex-col" style="width: 160px; height: 160px;">
            Miniature
            <span class="text-sm font-thin">(obligatoire)</span>
          </div>
          <!-- Champ de téléchargement de fichier -->
          <input
            ref="fileInput"
            class="hidden"
            id="thumbnail"
            type="file"
            @change="handleFileChange"
            required>
        </div>
      </div>
      <!-- Bouton de soumission et messages d'erreur ou de succès -->
      <div class="flex items-center justify-center w-full flex-col gap-3">
        <button
          class="border-white border text-white font-medium py-2 mt-6 px-10 rounded-xl focus:outline-none focus:shadow-outline"
          type="submit">Ajouter</button>
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

// Importation des fonctions nécessaires pour ajouter un podcast et obtenir les catégories
const { addPodcast } = usePodcasts();
const { getCategories } = useCategories();

// Déclaration des variables réactives pour les données du formulaire
const title = ref('');
const description = ref('');
const selectedCategory = ref('');
const isPublic = ref('true');
const thumbnail = ref(null);
const error = ref('');
const success = ref('');
const categories = ref([]);
const thumbnailURL = ref('');

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

// Fonction pour soumettre le podcast
const submitPodcast = async () => {
error.value = '';
success.value = '';
try {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('category_name', selectedCategory.value);
  formData.append('public', isPublic.value);
  formData.append('thumbnail', thumbnail.value);

  await addPodcast(formData);
  localStorage.setItem('podcastAdded', 'true');
  window.location.reload();
} catch (err) {
  error.value = 'Erreur lors de l\'ajout du podcast';
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
