<template>
  <!-- Conteneur principal du modal -->
  <div class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-end pb-12">
      <div class="bg-dooplerr-grey-purple rounded-lg shadow-lg p-8 relative w-full">
          <button @click="$emit('close')" class="absolute top-4 right-4 text-white">
              <Icon name="material-symbols:close" size="24" />
          </button>
          <!-- Emplacement pour insérer le contenu du modal via slot -->
          <slot></slot>
      </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
