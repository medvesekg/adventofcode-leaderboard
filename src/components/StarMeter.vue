<template>
  <span>
    <template v-for="i in parseInt($store.getters.maxDay)" :key="i">
      <a
        :title="`Day ${i}`"
        :href="`https://adventofcode.com/${year}/day/${i}`"
      >
        <i v-if="get(results, [i, '2'])" class="fas fa-star text-yellow-400" />
        <i
          v-else-if="get(results, [i, '1'])"
          class="fas fa-star text-gray-300"
        />
        <i v-else class="far fa-star text-gray-300" />
      </a>
    </template>
  </span>
</template>

<script>
import { get } from "lodash";
export default {
  props: {
    results: {
      type: Object,
      required: true,
    },
  },

  computed: {
    year() {
      return this.$store.state.year;
    },
  },

  methods: {
    get,
  },
};
</script>

<style></style>
