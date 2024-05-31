<template>
  <div class="relative wrapper-container mb-10">
    <!-- Conteneur du carrousel avec des classes dynamiques basées sur la prop 'display' -->
    <div :class="displayClasses[display]" ref="carouselContainer">
      <slot />
    </div>
    <!-- Flèche de défilement vers la gauche -->
    <div
      v-if="!isAtStart"
      :class="{ active: !isAtStart }"
      class="absolute arrow left-[-5rem] top-0 bottom-0 flex items-center justify-center z-50"
    >
      <button @click="scrollLeft">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style="color: white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <!-- Flèche de défilement vers la droite -->
    <div
      class="absolute active arrow right-[-5rem] top-0 bottom-0 flex items-center justify-center z-50"
    >
      <button @click="scrollRight">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style="color: white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Définition des classes de style pour chaque type d'affichage
const displayClasses = {
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  list: "flex flex-col gap-2 container mx-auto py-4",
  carrousel:
    "w-full flex gap-2 snap-x scroll-ps-6 overflow-x-auto custom-scrollbar",
};

// Définition des propriétés (props) du composant
defineProps({
  display: String,
  default: "carrousel",
  validator: (value) => {
    return ["grid", "list", "carrousel"].includes(value);
  },
});

// Référence pour le conteneur du carrousel
const carouselContainer = ref(null);
const isAtStart = ref(true); // Par défaut, le carrousel est au début

// Fonction pour faire défiler le carrousel vers la droite
const scrollRight = () => {
  const container = carouselContainer.value;
  container.scrollBy({
    left: 300, // Vous pouvez ajuster cette valeur selon la largeur de vos éléments de carrousel
    behavior: "smooth",
  });
  isAtStart.value = false; // Le carrousel n'est plus au début après le défilement
};

// Fonction pour faire défiler le carrousel vers la gauche
const scrollLeft = () => {
  const container = carouselContainer.value;
  container.scrollBy({
    left: -300, // Défilement vers la gauche
    behavior: "smooth",
  });
  isAtStart.value = true; // Retour au début du carrousel après le défilement
};
</script>

<style>
.wrapper-container:hover::before,
.wrapper-container:hover::after {
  opacity: 1;
}

.arrow {
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.wrapper-container:hover .arrow.active {
  opacity: 1;
}
</style>
