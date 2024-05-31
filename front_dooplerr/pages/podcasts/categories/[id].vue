<template>
  <div class="px-5">
    <TopNav />

    <section v-if="isLoading" class="flex justify-center items-center py-10">
      <div class="spinner-border text-dooplerr-grey-purple" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </section>

    <div v-else class="container mx-auto text-white">
      <h2 class="text-2xl uppercase font-bold mb-4 italic">{{ categoryName }}</h2>
      <div :style="{ background: categoryColor }" class="w-full" style="height: 2px;"></div>
      <div class="list-content mb-24" v-if="categoryPodcasts.length">
        <PodcastCard
          v-for="podcast in categoryPodcasts"
          :key="podcast.id"
          :id="podcast.id"
          :thumbnail_path="podcast.thumbnail_path"
          :title="podcast.title"
          :description="podcast.description"
          :commentsCount="podcast.commentsCount"
          :isPublic="podcast.isPublic"
          :hideVisibility="true"
          class="mt-6"
        />
      </div>
      <div v-else class="flex flex-col w-full justify-center items-center py-32">
          <p class="text-dooplerr-grey-purple font-medium pb-6">Aucun podcast {{ categoryName }} pour le moment...</p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategories } from '~/composables/useCategories';

const { getCategoryPodcasts, getCategories } = useCategories();

const route = useRoute();
const isLoading = ref(true);
const categoryPodcasts = ref([]);
const categoryName = ref('');
const categoryColor = ref('#ffffff'); // Default color

onMounted(async () => {
  try {
    const categoryId = parseInt(route.params.id, 10); // Convert to number
    const podcasts = await getCategoryPodcasts(categoryId);

    // Extract category name and color from route query
    const color = route.query.color || '#ffffff';
    categoryColor.value = decodeURIComponent(color);

    const categories = await getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category) {
      categoryName.value = category.name;
      categoryPodcasts.value = podcasts;
    }
  } catch (error) {
    console.error('Error fetching podcasts or categories:', error);
  } finally {
    isLoading.value = false;
  }
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
</style>
