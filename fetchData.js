require("dotenv").config();

const axios = require("axios");
const fs = require("fs");

const YEAR = process.env.VITE_YEAR;
const LEADERBOARD_ID = process.env.VITE_LEADERBOARD_ID;
const SESSION_ID = process.env.SESSION_ID;

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

async function fetchLeaderboardData() {
  const url = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}.json`;
  return axios
    .get(url, {
      headers: {
        Cookie: `session=${SESSION_ID}`,
      },
    })
    .then((response) => {
      response.data.timestamp = Date.now();
      return response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

async function discordApi(url) {
  return axios
    .get(`https://discord.com/api/v9/${url}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((e) => console.log(e.response.data));
}

function rolesToDepartments(roles) {
  return roles
    .filter((role) => role.hoist)
    .reduce((departments, role) => {
      departments[role.id] = {
        id: role.id,
        name: role.name,
        color: "#" + role.color.toString(16),
      };
      return departments;
    }, {});
}

function isSameName(name1, name2) {
  if (!name1 || !name2) {
    return null;
  }

  return name1.toLowerCase() === name2.toLowerCase();
}

function matchAdventofcodeUserToDiscordMember(user, discordMembers) {
  for (let member of discordMembers) {
    if (isSameName(member.nick, user.name)) {
      return member;
    }
  }
}

function findDepartmentId(userRoleIds, departments) {
  for (let roleId of userRoleIds) {
    let department = departments[roleId];
    if (department) {
      return department.id;
    }
  }
}

function getAdditionalUserData(adventofcodeUsers, discordMembers) {
  let additionalUserData = {};
  for (let user of adventofcodeUsers) {
    let member = matchAdventofcodeUserToDiscordMember(user, discordMembers);
    if (member) {
      additionalUserData[user.id] = {
        userId: user.id,
        avatar: member.avatar,
        department_id: findDepartmentId(member.roles),
      };
    }
  }
  return additionalUserData;
}

async function fetchDepartments() {
  let departments = {};
  if (DISCORD_BOT_TOKEN && DISCORD_GUILD_ID) {
    departments = rolesToDepartments(
      await discordApi(`guilds/${DISCORD_GUILD_ID}/roles`)
    );
  }
  return departments;
}

async function fetchAdditionalUserData(leaderboardData, departments) {
  let additionalUserData = {};
  let adventofcodeUsers = Object.values(leaderboardData.members);

  if (DISCORD_BOT_TOKEN && DISCORD_GUILD_ID) {
    let discordUsers = await discordApi(`guilds/${DISCORD_GUILD_ID}/members`);
    additionalUserData = getAdditionalUserData(
      adventofcodeUsers,
      discordUsers,
      departments
    );
  }
  return additionalUserData;
}

function writeJson(path, contents) {
  fs.writeFile(
    path,
    "export default " + JSON.stringify(contents),
    function (e) {
      if (e) {
        console.log(e);
      }
    }
  );
}

async function main() {
  let leaderboardData = await fetchLeaderboardData();
  let departments = await fetchDepartments();
  let additionalUserData = await fetchAdditionalUserData(
    leaderboardData,
    departments
  );

  writeJson("src/data/data.js", leaderboardData);
  writeJson("src/data/departments.js", departments);
  writeJson("src/data/users.js", additionalUserData);

  console.log("All data fetched");
}

main();
