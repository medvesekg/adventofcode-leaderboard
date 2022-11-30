import { createStore } from "vuex";
import { maxBy } from "lodash";
import data from "@/data/data";
import departments from "@/data/departments";
import usersAdditionalData from "@/data/users";

export default createStore({
  state() {
    return {
      year: Object.keys(data)
        .map((year) => parseInt(year))
        .reduce((max, cur) => Math.max(max, cur), 0),
      raw: data,
      departments,
    };
  },

  getters: {
    availableYears(state) {
      return Object.keys(state.raw).sort().reverse();
    },

    maxDay(state, getters) {
      return 25;
      /*
      let max = maxBy(getters.results, (item) => parseInt(item.day));
      return max ? max.day : 0;
      */
    },

    results(state) {
      let year = state.year;
      let flat = [];
      if (state.raw[state.year].members) {
        for (let [userId, member] of Object.entries(
          state.raw[state.year].members
        )) {
          for (let [day, results] of Object.entries(
            member.completion_day_level
          )) {
            for (let [level, result] of Object.entries(results)) {
              let start = new Date(year, 11, day, 6, 0, 0, 0, 0).getTime();
              let end = result.get_star_ts * 1000;
              flat.push({
                userId: userId,
                name: member.name,
                day: day,
                level: level,
                start: start,
                end: end,
              });
            }
          }
        }
        return flat;
      }
    },

    users(state) {
      let users = {};
      for (let userId in state.raw[state.year].members) {
        let user = {
          ...usersAdditionalData[userId],
          ...state.raw[state.year].members[userId],
        };
        if (!user.name) {
          user.department_id = 7;
        }
        users[userId] = user;
      }

      return users;
    },
  },
  mutations: {
    setYear(state, year) {
      state.year = year;
    },
  },
});
