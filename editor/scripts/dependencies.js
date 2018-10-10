/* eslint-disable */

const fs = require("fs-extra");

fs.unlink("./src/monaco/index.vue", () => {
    fs.copy("../eslint/dist/index.vue", "./src/monaco/index.vue");
});

fs.unlink("./src/monaco/monaco.css", () => {
    fs.copy("../eslint/dist/monaco.css", "./src/monaco/monaco.css");
});

fs.unlink("./src/monaco/monaco.js", () => {
    fs.copy("../eslint/dist/monaco.js", "./src/monaco/monaco.js");
});
