<template>
  <!-- component -->
  <!-- post card -->
  <div
    class="flex bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-4 md:mx-auto max-w-md md:max-w-2xl"
  >
    <!--horizantil margin is just for display-->
    <div class="flex pr-2 pl-4 py-6 w-full items-center">
      <img :src="icon" class="m-5 mr-10" style="width:90px" />
      <div class="w-full">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-2xl font-light text-gray-900 dark:text-gray-100 -mt-1">{{ title }}</h2>
        </div>
        <div class="flex items-center">
          <div class="bg-yellow-400 text-white rounded-full py-3 px-5 text-xl mr-2">
            {{ value }}
          </div>
          {{ description }}
        </div>

        <div class="mt-4 flex items-center justify-end">
          <div v-if="user" class="flex items-center">
            <div class="flex mr-2 text-gray-700 text-sm">
              <img
                class="rounded-full"
                style="height: 40px"
                :src="user.avatar"
                alt=""
              />
            </div>
            <div class="flex mr-2 text-gray-700 dark:text-gray-300 text-lg font-bold mr-8" style="min-width:150px">
              <span>{{ user.name }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end mr-2">
          {{ extra }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "icon", "value", "description", "user", "extra"],
};
</script>

<style></style>
