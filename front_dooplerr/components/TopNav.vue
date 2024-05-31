<template>
    <section class="w-full py-10 flex flex-col">
        <div class="flex justify-between">
            <NuxtLink to="/" active-class="active-link" aria-label="Accueil">
                <img src="~/assets/img/logo-dooplerr.png">
            </NuxtLink>
            <div class="flex gap-6">
                <NuxtLink to="/profile" active-class="active-link" aria-label="Profil">
                    <Icon name="material-symbols:account-circle-full" size="27" />
                </NuxtLink>
                <NuxtLink to="/messages" active-class="active-link" aria-label="Messages">
                    <Icon name="akar-icons:send" size="27" />
                </NuxtLink>
            </div>
        </div>
        <div class="w-full">
            <div class="relative py-5">
                <NuxtLink to="/podcasts">
                    <input type="text" class="w-full py-3 pl-11 pr-4 rounded-dooplerr border-transparent bg-dooplerr-grey focus:outline-none focus:border-indigo-400 text-white" placeholder="Un nouveau podcast ?">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon name="mingcute:search-line" size="20" class="text-dooplerr-grey-purple" />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>

</script>

<style scoped>
.icon{
  color: white;
}

.active-link .icon {
  color: #BFBCFF;
}

input::placeholder {
  color: #706D92;
  font-style: italic;
  line-height: normal;
}

input:focus{
    box-shadow: none !important;
}
</style>