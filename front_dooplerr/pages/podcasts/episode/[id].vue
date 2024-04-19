<template>
    <div class="container max-w-3xl mx-auto pt-10">
        <!-- Contenu de l'épisode -->
        <div class="flex">
            <div>
                <h1 class="text-4xl font-bold text-white mt-4">{{ episode.title }}</h1>
                <p class="text-lg text-white mt-2">{{ episode.description }}</p>
            </div>
        </div>

        <!-- Lecteur audio -->
        <audio ref="audioPlayer" controls class="fixed bottom-0 left-0 w-full bg-gray-900 p-4">
            <source :src="episode.file_path" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useEpisodes } from '@/composables/useEpisodes'

const { params } = useRoute();
const { getEpisodeById } = useEpisodes();

const episode = ref({});

onMounted(async () => {
    episode.value = await getEpisodeById(params.id);
});

</script>

<style scoped>
/* Ajoutez vos styles CSS ici */
</style>
