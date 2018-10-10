/* eslint-disable */

const { spawnSync } = require("child_process");

spawnSync("npm", ["install"], {
    env: process.env,
    cwd: "./src/linter/",
    stdio: "inherit",
});

spawnSync("npm", ["install"], {
    env: process.env,
    cwd: "./src/editor/",
    stdio: "inherit",
});
