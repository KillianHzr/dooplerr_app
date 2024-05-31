<template>
    <div :class="`border border-${borderColor} rounded-xl p-4`">
      <div class="flex justify-between font-medium italic">
        <h3 class="font-semibold italic text-lg">{{ planName }}</h3>
        <div class="flex flex-col text-center">
          <span class="text-sm">{{ price }}</span>
          <span class="text-xs opacity-50" v-if="subtext">{{ subtext }}</span>
        </div>
      </div>
      <ul class="font-light list-disc ps-6 text-xs pb-3">
        <li v-for="(feature, index) in features" :key="index"><span class="text-base">{{ feature }}</span></li>
      </ul>
      <div class="w-full flex justify-center">
        <button @click="selectPlan(planType)" :class="`pb-1 w-56 bg-${borderColor} text-white rounded-full text-sm font-medium italic`">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    planName: String,
    price: String,
    subtext: String,
    features: Array,
    planType: String,
    borderColor: String,
    buttonText: String,
  });
  
  const emit = defineEmits(['selectPlan']);
  
  const selectPlan = (planType) => {
    emit('selectPlan', planType);
  };
  </script>
  