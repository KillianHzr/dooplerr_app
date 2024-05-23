<template>
    <div v-if="episode">
        <NuxtLink :to="'/podcasts/episode/' + episode.id">
            <h2 class="text-3xl font-bold text-white">{{ episode.title }}</h2>
        </NuxtLink>
    </div>

</template>

<script setup>
defineProps({
    episode: Object
})

</script>