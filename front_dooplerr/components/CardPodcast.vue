<template>
    <div v-if="podcast">
        <NuxtLink :to="/podcasts/ + podcast.id">
            <img class="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 ease-out group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-300"
                :src=podcast.thumbnail_path />
        </NuxtLink>
    </div>

</template>

<script setup>
defineProps({
    podcast: Object
})

</script>