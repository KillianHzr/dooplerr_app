<template>
    <div class="container max-w-3xl mx-auto pt-10">
        <!-- Contenu de l'épisode -->
        <div class="flex">
            <div class="img-podcast w-56 h-56 md:mr-6"
                :style="{ backgroundImage: 'url(' + podcast.thumbnail_path + ')' }">
            </div>
            <div>
                <h1 class="text-4xl font-bold text-white mt-4">{{ podcast.title }}</h1>
                <p class="text-lg text-white mt-2">{{ podcast.description }}</p>
            </div>
        </div>

        <!-- Liste des épisodes -->
        <div class="mt-10">
            <h2 class="text-3xl font-bold text-white">Les épisodes</h2>
            <div class="flex flex-col gap-2 mt-10">
                <CardEpisode v-for="episode in podcast.Episodes" :key="episode.id" :episode="episode" class="">
                </CardEpisode>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const { params } = useRoute();
const { getPodcastEpisodes } = usePodcasts();

const podcast = ref({});


onMounted(async () => {
    podcast.value = await getPodcastEpisodes(params.id);
});

</script>

<style scoped>
.img-podcast {
    background-size: cover;
    background-position: center;
}
</style>
