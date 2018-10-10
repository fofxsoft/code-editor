/* eslint-disable */

const { copyFileSync, existsSync, mkdirSync, readdir, unlinkSync } = require("fs");
const { join } = require("path");
const { spawnSync } = require("child_process");

console.log("\x1b[36m%s\x1b[0m", "Building Linter");

spawnSync("npm", ["run", "build"], {
    env: process.env,
    cwd: "./src/linter/",
    stdio: "inherit",
});

console.log("\r\n");
console.log("\x1b[36m%s\x1b[0m", "Deploying Linter");
console.log("\r\n");

if (!existsSync("./src/editor/src/monaco/")) {
    mkdirSync("./src/editor/src/monaco/");
}

if (existsSync("./src/editor/src/monaco/index.vue")) {
    unlinkSync("./src/editor/src/monaco/index.vue");
}
if (existsSync("./src/editor/src/monaco/monaco.css")) {
    unlinkSync("./src/editor/src/monaco/monaco.css");
}
if (existsSync("./src/editor/src/monaco/monaco.js")) {
    unlinkSync("./src/editor/src/monaco/monaco.js");
}

copyFileSync("./src/linter/dist/index.vue", "./src/editor/src/monaco/index.vue");
console.log("\x1b[32m%s\x1b[0m", "src/linter/dist/index.vue -> src/editor/src/monaco/index.vue");
copyFileSync("./src/linter/dist/monaco.css", "./src/editor/src/monaco/monaco.css");
console.log("\x1b[32m%s\x1b[0m", "src/linter/dist/monaco.css -> src/editor/src/monaco/monaco.css");
copyFileSync("./src/linter/dist/monaco.js", "./src/editor/src/monaco/monaco.js");
console.log("\x1b[32m%s\x1b[0m", "src/linter/dist/monaco.js -> src/editor/src/monaco/monaco.js");

console.log("\r\n");
console.log("\x1b[36m%s\x1b[0m", "Building Editor");

spawnSync("npm", ["run", "build"], {
    env: process.env,
    cwd: "./src/editor/",
    stdio: "inherit",
});

console.log("\x1b[36m%s\x1b[0m", "Deploying Editor");
console.log("\r\n");

if (!existsSync("./build/")) {
    mkdirSync("./build/");
}

if (!existsSync("./build/css/")) {
    mkdirSync("./build/css/");
}

readdir("./build/css/", (err, files) => {
    if (err) {
        throw (err);
    }

    for (let i = 0; i < files.length; i++) {
        unlinkSync(join("./build/css/", files[i]));
    }
});

if (!existsSync("./build/js/")) {
    mkdirSync("./build/js/");
}

readdir("./build/js/", (err, files) => {
    if (err) {
        throw (err);
    }

    for (let i = 0; i < files.length; i++) {
        unlinkSync(join("./build/js/", files[i]));
    }
});

if (existsSync("./build/editor.css")) {
    unlinkSync("./build/editor.css");
}

if (existsSync("./build/editor.js")) {
    unlinkSync("./build/editor.js");
}

if (existsSync("./build/editor.html")) {
    unlinkSync("./build/editor.html");
}

readdir("./src/editor/dist/css/", (err, files) => {
    if (err) {
        throw (err);
    }

    for (let i = 0; i < files.length; i++) {
        copyFileSync(join("./src/editor/dist/css/", files[i]), join("./build/css/", files[i]));
        console.log("\x1b[32m%s\x1b[0m", join("./src/editor/dist/css/", files[i]) + " -> " + join("./build/css/", files[i]));
    }
});

readdir("./src/editor/dist/js/", (err, files) => {
    if (err) {
        throw (err);
    }

    for (let i = 0; i < files.length; i++) {
        copyFileSync(join("./src/editor/dist/js/", files[i]), join("./build/js/", files[i]));
        console.log("\x1b[32m%s\x1b[0m", join("./src/editor/dist/js/", files[i]) + " -> " + join("./build/js/", files[i]));
    }
});

copyFileSync("./src/editor/dist/editor.css", "./build/editor.css");
console.log("\x1b[32m%s\x1b[0m", "src/editor/dist/editor.css -> build/editor.css");
copyFileSync("./src/editor/dist/editor.js", "./build/editor.js");
console.log("\x1b[32m%s\x1b[0m", "src/editor/dist/editor.js -> build/editor.js");
copyFileSync("./src/editor/dist/index.html", "./build/editor.html");
console.log("\x1b[32m%s\x1b[0m", "src/editor/dist/index.html -> build/editor.html");
