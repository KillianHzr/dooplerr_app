<template>
    <div class="px-5">
      <TopNav />
      <section class="text-white">
        <div class="font-medium">
          <div class="flex justify-between items-center w-full">
            <div class="flex items-center">
              <img :src="user.image_path" class="rounded-full bg-gray-300 me-3 border-dooplerr-grey-purple border" width="45" height="45" style="min-width: 45px; min-height: 45px; max-height: 45px; max-width: 45px; object-fit: cover;" />
              <h2 class="text-2xl italic font-medium">Bilbiothèque de playlists</h2>
            </div>
            <button class="text-5xl font-thin -translate-y-2">+</button>
          </div>
          <div class="flex flex-col gap-4">
          </div>
          <div class="w-full flex flex-col items-center justify-center px-8 gap-5 pt-16">
            <div class="w-full flex px-5 py-2 items-center gap-6 border-2 border-dooplerr-grey-purple rounded-lg">
              <Icon name="material-symbols:favorite-outline-rounded" size="30" />
              <h3 class="font-medium italic text-lg">Podcast likés</h3>              
            </div>
            <div class="w-full flex px-5 py-2 items-center gap-6 border-2 border-dooplerr-grey-purple rounded-lg">
              <Icon name="material-symbols:notifications-active-outline-rounded" size="30" />
              <h3 class="font-medium italic text-lg">Nouveaux épisodes</h3>              
            </div>
            <div class="w-full flex px-5 py-2 items-center gap-6 border-2 border-dooplerr-grey-purple rounded-lg">
              <Icon name="mage:user-check" size="30" />
              <h3 class="font-medium italic text-lg">Podcast likés</h3>              
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  const user = inject('user');
  </script>