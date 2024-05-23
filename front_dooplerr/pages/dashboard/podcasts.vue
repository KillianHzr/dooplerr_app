<template>
    <div class="add-podcast">
        <h2>Ajouter un Podcast</h2>
        <form @submit.prevent="submitPodcast">
            <div>
                <label for="title">Titre:</label>
                <input type="text" v-model="title" required />
            </div>
            <div>
                <label for="description">Description:</label>
                <textarea v-model="description" required></textarea>
            </div>
            <div>
                <label for="public">Public:</label>
                <select v-model="isPublic" required>
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                </select>
            </div>
            <div>
                <label for="category_name">Catégorie:</label>
                <input type="text" v-model="categoryName" required />
            </div>
            <div>
                <label for="thumbnail">Vignette:</label>
                <input type="file" @change="handleFileChange" required />
            </div>
            <button type="submit">Ajouter</button>
            <div v-if="error" class="error">{{ error }}</div>
            <div v-if="success" class="success">{{ success }}</div>
        </form>
    </div>
</template>

<script setup>
const { addPodcast } = usePodcasts();

const title = ref('');
const description = ref('');
const isPublic = ref(true);  // Set the initial value to a boolean
const categoryName = ref('');
const thumbnail = ref(null);
const error = ref('');
const success = ref('');

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
        formData.append('public', isPublic.value);  // Append the boolean value
        formData.append('category_name', categoryName.value);
        formData.append('thumbnail', thumbnail.value);

        const response = await addPodcast(formData);
        success.value = 'Podcast ajouté avec succès';
    } catch (err) {
        error.value = 'Erreur lors de l\'ajout du podcast';
    }
};
</script>

<style scoped>
.add-podcast {
    max-width: 600px;
    margin: 0 auto;
}

.error {
    color: red;
}

.success {
    color: green;
}
</style>