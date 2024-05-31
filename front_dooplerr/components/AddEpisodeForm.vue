<template>
  <div>
    <h2 class="text-white text-2xl font-semibold mb-4 italic">Détails de l'épisode</h2>
    <form @submit.prevent="submitEpisode" class="flex flex-col gap-2">
      <div class="mb-4 order border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="title">Titre <span class="text-sm font-normal">(obligatoire)</span></label>
        <input
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="title" type="text" v-model="title" required
          placeholder="Titre de l'épisode"
          style="box-shadow: none;">
      </div>
      <div class="mb-4 order border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="description">Description <span class="text-sm font-normal">(obligatoire)</span></label>
        <textarea
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="description" v-model="description" required
          placeholder="Description de l'épisode"
          style="box-shadow: none;"></textarea>
      </div>
      <div class="mb-4 order border border-white rounded-xl p-2 px-4">
        <label class="block text-white font-medium text-lg" for="release_date">Date de publication <span class="text-sm font-normal">(obligatoire)</span></label>
        <input
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="release_date" type="date" v-model="release_date" required
          style="box-shadow: none;">
      </div>
      <div class="mb-4">
        <label class="block text-white font-medium text-lg" for="file">Fichier <span class="text-sm font-normal">(obligatoire)</span></label>
        <input
          class="bg-transparent shadow-none border-none appearance-none w-full py-2 leading-tight px-0 text-sm font-thin"
          id="file" type="file" @change="handleFileChange" required
          style="box-shadow: none;">
      </div>
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
import { ref } from 'vue';
import { useEpisodes } from '~/composables/useEpisodes';

const props = defineProps({
  podcast_name: {
    type: String,
    required: true
  }
});

const { addEpisode } = useEpisodes();

const title = ref('');
const description = ref('');
const release_date = ref('');
const file = ref(null);
const error = ref('');
const success = ref('');

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
  }
};

const submitEpisode = async () => {
  error.value = '';
  success.value = '';
  try {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('release_date', release_date.value);
    formData.append('file', file.value);
    formData.append('podcast_name', props.podcast_name);

    await addEpisode(formData);
    localStorage.setItem('episodeAdded', 'true');
    window.location.reload();
  } catch (err) {
    error.value = 'Erreur lors de l\'ajout de l\'épisode';
  }
};
</script>

<style scoped>
</style>
