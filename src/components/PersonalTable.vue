<template>
  <app-table :columns="columns" :rows="rows" :key="year">
    <template #column:name="{ value, row }">
      <span :style="rowStyle(row)">
        {{ value || "Segmentation fault (core dumped)" }}
      </span>
    </template>
    <template #column:team="{ value }">
      <span
        v-if="value"
        class="rounded px-2 py-1 text-white text-sm"
        :style="`background-color:${value.color}`"
        >{{ value.name }}</span
      >
    </template>
    <template #column:avatar="{ value, row }">
      <img
        v-if="row.name"
        :src="
          value ||
          'https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png'
        "
        class="h-10 w-10 rounded-full"
        style="width: 40px"
      />
      <span v-else>{{ zalgoText() }}</span>
    </template>
    <template #column:starMeter="{ row }">
      <star-meter :results="row.completion_day_level" />
      <i
        class="fa fa-gift ml-5"
        v-if="row.stars >= get(targetUser, 'stars', 0)"
      ></i>
    </template>
    <template #column:stars="{ row }">
      <span class="text-lg font-bold">
        {{ row.stars }}
      </span>
    </template>
  </app-table>
</template>

<script>
import { defineComponent } from "vue";
import StarMeter from "@/components/StarMeter.vue";
import AppTable from "@/components/AppTable.vue";
import { orderBy, get } from "lodash";
import zalgo from "zalgo-js";

export default defineComponent({
  components: { StarMeter, AppTable },

  data() {
    return {
      leaderboardId: import.meta.env.VITE_LEADERBOARD_ID,
      columns: [
        {
          label: "",
          accessor: "avatar",
          slot: "avatar",
          name: "avatar",
          orderable: false,
          style: "width:50px",
        },
        {
          label: "Name",
          accessor: "name",
          slot: "name",
          name: "name",
          orderable: false,
          style: "width:300px",
        },
        {
          label: "Team",
          accessor: (row) =>
            get(this.$store.state.departments, row.department_id),
          slot: "team",
          name: "team",
          orderable: false,
          style: "width:150px",
          tdClass: "hidden md:table-cell",
          thClass: "hidden md:table-cell",
        },
        {
          label: "",
          accessor: "stars",
          slot: "starMeter",
          name: "starMeter",
          orderable: false,
          tdClass: "hidden md:table-cell",
          thClass: "hidden md:table-cell",
        },
        {
          label: "Stars",
          accessor: "stars",
          slot: "stars",
          name: "stars",
          orderable: false,
        },
      ],
    };
  },

  computed: {
    targetUser() {
      return this.$store.getters.users[this.leaderboardId];
    },
    rows() {
      return orderBy(
        Object.values(this.$store.getters.users),
        ["stars", "local_score"],
        ["desc", "desc"]
      );
    },
    year() {
      return this.$store.state.year;
    },
  },

  methods: {
    get,
    rowStyle(row) {
      let userId = row.id;
      let departmentId = this.$store.getters.users[userId].department_id;
      if (departmentId) {
        let department = this.$store.state.departments[departmentId];
        if (department) {
          return `color: ${department.color}`;
        }
      }
    },

    randomMemoryAddress() {
      let random = Math.floor(Math.random() * 4000000);
      return `0x` + padStart(random.toString(16), 8, "0");
    },

    zalgoText() {
      const myString = this.randomString(2, 5);
      return zalgo(myString, {
        intensity: 0.6,
        directions: { up: true, down: true, middle: true },
      });
    },

    randomString(min, max) {
      let string = "";
      let length = Math.floor(Math.random() * (max - 1)) + min;
      for (let i = 0; i < length; i++) {
        let ascii = Math.floor(Math.random() * 25) + 97;
        string += String.fromCharCode(ascii);
      }
      return string;
    },
  },
});
</script>

<style></style>
