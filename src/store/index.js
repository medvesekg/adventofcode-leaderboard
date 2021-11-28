import { createStore } from "vuex";
import { maxBy } from "lodash";
import data from "@/data/data";
import departments from "@/data/departments";
import usersAdditionalData from "@/data/users";

export default createStore({
  state() {
    return {
      raw: data,
      departments,
    };
  },

  getters: {
    maxDay(state, getters) {
      let max = maxBy(getters.results, (item) => parseInt(item.day));
      return max ? max.day : 0;
    },

    results(state) {
      let year = import.meta.env.VITE_YEAR;
      let flat = [];
      if (state.raw.members) {
        for (let [userId, member] of Object.entries(state.raw.members)) {
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
      for (let userId in state.raw.members) {
        let user = {
          ...usersAdditionalData[userId],
          ...state.raw.members[userId],
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
    setUsers(state, users) {
      state.users = users;
    },
  },
});
