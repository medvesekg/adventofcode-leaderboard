<template>
  <app-table :columns="actualColumns" :rows="rows">
    <template #column:avatar="{ row }">
      <img :src="row.avatar" height="30" />
    </template>
    <template #column:day="{ value }">
 
        {{
          value ? 
          formatDuration(
            intervalToDuration({
              start: new Date(value.start),
              end: new Date(value.end),
            })
          ) : ''
        }}

    </template>
  </app-table>
</template>

<script>
import AppTable from "@/components/AppTable.vue";
import { get, map, groupBy, keyBy, mapValues } from "lodash";
import {
  intervalToDuration,
  formatDuration,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";

export default {
  components: { AppTable },

  data() {
    return {
      columns: [
        {
          name: "avatar",
          slot: "avatar",
          accessor: "avatar",
          label: "",
        },
        {
          name: "name",
          slot: "name",
          accessor: "name",
          label: "Name",
        },
      ],
    };
  },

  computed: {
    rows() {
      let users = Object.values(this.$store.getters.users);
      return users.map((user) => {
        let results = this.$store.getters.results.filter(
          (result) => result.userId === user.userId
        );
        results = groupBy(results, "day");
        results = mapValues(results, (day) => keyBy(day, "level"));

        return {
          ...user,
          results,
        };
      });
    },
    store() {
      return this.$store.state;
    },

    actualColumns() {
      let max = this.$store.getters.maxDay;
      let columns = this.columns.slice();
      for (let i = 1; i <= max; i++) {
        columns.push({
          name: "day" + i + "l1",
          slot: "day",
          label: "Day " + i + " *",
          accessor: `results["${i}"]["1"]`,
          orderBy: `results["${i}"]["1"].end`
        });
        columns.push({
          name: "day" + i + "l2",
          slot: "day",
          label: "Day " + i + " **",
          accessor: `results["${i}"]["2"]`,
          orderBy: `results["${i}"]["1"].end`
        });
      }
      return columns;
    },
  },

  methods: {
    get,
    intervalToDuration,
    formatDuration,
  },
};
</script>

<style></style>
