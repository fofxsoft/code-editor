/* eslint-disable */

const fs = require("fs-extra");

fs.unlink("./src/monaco/index.vue", () => {
    fs.copy("../linter/dist/index.vue", "./src/monaco/index.vue");
});

fs.unlink("./src/monaco/monaco.css", () => {
    fs.copy("../linter/dist/monaco.css", "./src/monaco/monaco.css");
});

fs.unlink("./src/monaco/monaco.js", () => {
    fs.copy("../linter/dist/monaco.js", "./src/monaco/monaco.js");
});
