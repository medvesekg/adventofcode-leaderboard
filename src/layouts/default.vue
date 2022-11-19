<template>
  <main :class="{ dark: darkMode }">
    <div id="main-div" class="dark:bg-gray-900 dark:shadow-sm dark:text-white">
      <div class="flex justify-between px-2">
        <div>
          <span class="dark:text-gray-400">Year: </span>
          <select
            v-model="year"
            name=""
            id=""
            class="dark:text-gray-400 dark:bg-gray-900"
          >
            <option v-for="year in $store.getters.availableYears" :value="year">
              {{ year }}
            </option>
          </select>

          <small
            v-if="lastUpdated"
            :title="format(lastUpdated, 'd. m. y H:M')"
            class="dark:text-gray-400"
          >
            updated
            {{ formatDistanceToNowStrict(lastUpdated, { addSuffix: true }) }}
          </small>
        </div>

        <app-toggle v-model="darkMode">
          <span class="dark:text-gray-400">Dark mode</span>
        </app-toggle>
      </div>

      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- component -->
        <div>
          <ul class="flex cursor-pointer">
            <router-link
              v-for="(item, i) in navigation"
              :key="i"
              :to="{ name: item.route }"
            >
              <li class="py-2 px-6 rounded-t-lg" :class="activeClass(item)">
                {{ item.label }}
              </li>
            </router-link>
          </ul>
        </div>

        <router-view />
        <div class="mt-5 text-center">
          <a
            :href="`https://adventofcode.com/${year}/leaderboard/private/view/${leaderboardId}`"
            >Advent of code {{ year }}</a
          >
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { format, formatDistanceToNowStrict } from "date-fns";
import AppToggle from "@/components/AppToggle.vue";

export default {
  components: { AppToggle },

  data() {
    return {
      darkMode: false,
      leaderboardId: import.meta.env.VITE_LEADERBOARD_ID,
      navigation: [
        {
          label: "Personal",
          route: "home",
        },
        {
          label: "Teams",
          route: "teams",
        },
      ],
    };
  },

  watch: {
    darkMode(value) {
      if (value) {
        localStorage.setItem("darkMode", 1);
      } else {
        localStorage.removeItem("darkMode");
      }
    },
  },

  created() {
    this.darkMode = localStorage.getItem("darkMode");
  },

  computed: {
    year: {
      get() {
        return this.$store.state.year;
      },
      set(year) {
        return this.$store.commit("setYear", year);
      },
    },
    lastUpdated() {
      return this.$store.state.raw[this.$store.state.year].timestamp
        ? new Date(this.$store.state.raw[this.$store.state.year].timestamp)
        : null;
    },
  },

  methods: {
    format,
    formatDistanceToNowStrict,

    activeClass(item) {
      return item.route === this.$route.name
        ? "text-gray-500 bg-gray-200 dark:text-white dark:bg-gray-700"
        : "bg-white dark:bg-gray-800";
    },
  },
};
</script>

<style scoped>
#main-div {
  min-height: 100vh;
}
</style>
