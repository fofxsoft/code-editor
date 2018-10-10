/* eslint-disable */

const { spawnSync } = require("child_process");

spawnSync("npm", ["run", "build"], {
    env: process.env,
    cwd: "./linter/",
    stdio: "inherit",
});

spawnSync("npm", ["run", "build"], {
    env: process.env,
    cwd: "./editor/",
    stdio: "inherit",
});
