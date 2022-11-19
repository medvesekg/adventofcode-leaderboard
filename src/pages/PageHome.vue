<template>
  <div>
    <personal-table />

    <h2
      class="text-center my-20 text-3xl font-semibold text-gray-800 dark:text-gray-200 md:text-4xl"
    >
      Achievements
    </h2>

    <app-achievement
      v-if="fastest.length"
      class="mb-5"
      title="Fastest gun in the west"
      description="to solve the first challenge"
      :value="
        formatDuration(
          intervalToDuration({
            start: new Date(fastest[0].start),
            end: new Date(fastest[0].end),
          })
        )
      "
      :user="$store.getters.users[fastest[0].userId]"
      :extra="` on day ${fastest[0].day}`"
      icon="/src/assets/gun.jpg"
    />

    <app-achievement
      v-if="fastest2.length"
      class="mb-5"
      title="Allstar"
      description="to earn both stars"
      :value="
        formatDuration(
          intervalToDuration({
            start: new Date(fastest2[0].start),
            end: new Date(fastest2[0].end),
          })
        )
      "
      :user="$store.getters.users[fastest2[0].userId]"
      :extra="` on day ${fastest2[0].day}`"
      icon="/src/assets/star.png"
    />

    <app-achievement
      v-if="earlyBird.length"
      class="mb-5"
      title="Early bird"
      description=" stars earned before 8 AM"
      :value="earlyBird[0].count"
      :user="$store.getters.users[earlyBird[0].userId]"
      icon="/src/assets/early.jpg"
      extra="across all days"
    />

    <app-achievement
      v-if="lateBird.length"
      class="mb-5"
      title="Night owl"
      description=" stars earned after 22 PM"
      :value="lateBird[0].count"
      :user="$store.getters.users[lateBird[0].userId]"
      icon="/src/assets/owl.jpg"
      extra="across all days"
    />

    <app-achievement
      v-if="day.length"
      class="mb-5"
      title="Code monkey"
      description="stars earned in a single day"
      :value="day[0].count"
      :user="$store.getters.users[day[0].userId]"
      :extra="'on ' + format(day[0].day, 'do MMM yyyy')"
      icon="/src/assets/monkey.jpg"
    />
  </div>
</template>

<script>
import PersonalTable from "@/components/PersonalTable.vue";
import AppAchievement from "@/components/AppAchievement.vue";
import { orderBy, minBy, countBy, groupBy, padStart, get } from "lodash";
import { format } from "date-fns";
import {
  intervalToDuration,
  formatDuration,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";
import StarMeter from "@/components/StarMeter.vue";

export default {
  components: { PersonalTable, AppAchievement },

  data() {
    return {
      table: "PersonalTable",
      year: this.$store.state.year,
    };
  },

  computed: {
    fastest() {
      return orderBy(this.$store.getters.results, [
        (result) => result.end - result.start,
      ]);
    },
    fastest2() {
      return orderBy(
        this.$store.getters.results.filter((result) => result.level == 2),
        [(result) => result.end - result.start]
      );
    },
    earlyBird() {
      let early = this.$store.getters.results.filter((result) => {
        let date = new Date(result.end);
        return (
          isAfter(date, new Date(this.year, 11, date.getDate(), 4, 0, 0, 0)) &&
          isBefore(date, new Date(this.year, 11, date.getDate(), 8, 0, 0, 0))
        );
      });
      early = countBy(early, "userId");
      let array = Object.entries(early).map(([userId, count]) => {
        return {
          userId: userId,
          count: count,
        };
      });
      return orderBy(array, ["count"], ["desc"]);
    },
    lateBird() {
      let late = this.$store.getters.results.filter((result) => {
        let date = new Date(result.end);
        return (
          isAfter(date, new Date(this.year, 11, date.getDate(), 22, 0, 0, 0)) &&
          isBefore(
            date,
            new Date(this.year, 11, date.getDate() + 1, 4, 0, 0, 0)
          )
        );
      });

      let array = Object.entries(countBy(late, "userId")).map(
        ([userId, count]) => {
          return {
            userId: userId,
            count: count,
            late: late.filter((late) => late.userId === userId),
          };
        }
      );
      return orderBy(array, ["count"], ["desc"]);
    },

    day() {
      let days = {};
      for (let result of this.$store.getters.results) {
        let key =
          "Day: " +
          startOfDay(result.end).getTime() +
          " User: " +
          result.userId;
        if (!days[key])
          days[key] = {
            userId: result.userId,
            name: result.name,
            day: startOfDay(result.end),
            count: 0,
          };
        days[key].count++;
      }

      return orderBy(Object.values(days), ["count"], ["desc"]);
    },
  },

  methods: {
    intervalToDuration,
    formatDuration,
    format,
  },
};
</script>

<style></style>
