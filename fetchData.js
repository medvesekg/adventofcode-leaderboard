require("dotenv").config();
var axios = require("axios");
const { exit } = require("process");
fs = require("fs");

let year = process.env.VITE_YEAR;
let leaderboardId = process.env.VITE_LEADERBOARD_ID;
let sessionId = process.env.SESSION_ID;
let url = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderboardId}.json`;

axios
  .get(url, {
    headers: {
      Cookie: `session=${sessionId}`,
    },
  })
  .then((response) => {
    response.data.timestamp = Date.now();
    fs.writeFile(
      "src/data/data.js",
      "export default " + JSON.stringify(response.data),
      function (e) {
        console.log(e);
      }
    );

    fs.writeFile(
      "src/data/departments.js",
      "export default {}",
      {
        flag: "wx",
      },
      () => {}
    );
    fs.writeFile(
      "src/data/users.js",
      "export default {}",
      {
        flag: "wx",
      },
      () => {}
    );
  })
  .catch((e) => {
    console.log(e);
  });
