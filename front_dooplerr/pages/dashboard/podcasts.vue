<template>
    <div class="flex justify-center items-center h-screen">
        <div class="shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-center text-white text-2xl font-semibold mb-4">Ajouter un Podcast</h2>
            <form @submit.prevent="submitPodcast">
                <div class="mb-4">
                    <label class="block text-white text-sm font-bold mb-2" for="title">Titre:</label>
                    <input
                        class="bg-transparent shadow-none appearance-none border border-white rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        id="title" type="text" v-model="title" required>
                </div>
                <div class="mb-4">
                    <label class="block text-white text-sm font-bold mb-2" for="description">Description:</label>
                    <textarea
                        class="bg-transparent shadow-none appearance-none border border-white rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        id="description" v-model="description" required></textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-white text-sm font-bold mb-2" for="category">Catégorie:</label>
                    <select
                        class="bg-transparent shadow-none appearance-none border border-white rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        v-model="selectedCategory" required>
                        <option disabled value="">Sélectionner une catégorie</option>
                        <option v-for="category in categories" :key="category.id" :value="category.name">{{
                category.name }}</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-white text-sm font-bold mb-2" for="public">Public:</label>
                    <select
                        class="bg-transparent shadow-none appearance-none border border-white rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        v-model="isPublic" required>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-white text-sm font-bold mb-2" for="thumbnail">Vignette:</label>
                    <input
                        class="bg-transparent shadow-none appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                        id="thumbnail" type="file" @change="handleFileChange" required>
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">Ajouter</button>
                    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
                    <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const { addPodcast } = usePodcasts();
const { getCategories } = useCategories();

const title = ref('');
const description = ref('');
const selectedCategory = ref('');
const isPublic = ref('true'); // Ajout de la variable pour stocker la valeur du champ "public"
const thumbnail = ref(null);
const error = ref('');
const success = ref('');
const categories = ref([]);

const handleFileChange = (event) => {
    thumbnail.value = event.target.files[0];
};

const submitPodcast = async () => {
    error.value = '';
    success.value = '';
    try {
        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('description', description.value);
        formData.append('category_name', selectedCategory.value);
        formData.append('public', isPublic.value); // Ajout de la valeur du champ "public"
        formData.append('thumbnail', thumbnail.value);

        await addPodcast(formData);
        success.value = 'Podcast ajouté avec succès';
    } catch (err) {
        error.value = 'Erreur lors de l\'ajout du podcast';
    }
};

onMounted(async () => {
    try {
        categories.value = await getCategories();
    } catch (err) {
        console.error('Error fetching categories:', err);
    }
});
</script>

<style scoped>
/* Ajoutez vos styles Tailwind CSS ici */
</style>
