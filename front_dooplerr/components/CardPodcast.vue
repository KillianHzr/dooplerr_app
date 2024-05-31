<template>
    <!-- Affichage du contenu seulement si le podcast est défini -->
    <div v-if="podcast">
        <!-- Lien vers la page du podcast avec l'ID du podcast -->
        <NuxtLink :to="`/podcasts/${podcast.id}`">
            <img 
                class="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 ease-out group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-300" 
                :alt="`Podcast - ${podcast.title}`"
                :src="podcast.thumbnail_path" />
        </NuxtLink>
    </div>
</template>

<script setup>
// Définition des propriétés (props) du composant
defineProps({
    // L'objet 'podcast' est de type Object
    podcast: Object
});
</script>