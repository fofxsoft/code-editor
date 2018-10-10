/* eslint-disable */

const { spawnSync } = require("child_process");

spawnSync("npm", ["install"], {
    env: process.env,
    cwd: "./linter/",
    stdio: "inherit",
});

spawnSync("npm", ["install"], {
    env: process.env,
    cwd: "./editor/",
    stdio: "inherit",
});
