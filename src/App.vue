<template>
  <component :is="layout">
    <keep-alive>
      <router-view />
    </keep-alive>
  </component>
</template>

<script>
import DefaultLayout from "@/layouts/default.vue";
import EmptyLayout from "@/layouts/empty.vue";

export default {
  name: "App",

  components: {
    default: DefaultLayout,
    empty: EmptyLayout,
  },

  created() {
    document.title = "Advent of code " + import.meta.env.VITE_YEAR;
  },

  computed: {
    layout() {
      return this.$route.meta.layout || "default";
    },
    store() {
      return this.$store.state;
    },
  },
};
</script>
