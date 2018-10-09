/* eslint-disable */

const fs = require("fs-extra");

fs.unlink("./src/monaco/index.vue", () => {
    fs.copy("../monaco/dist/index.vue", "./src/monaco/index.vue");
});

fs.unlink("./src/monaco/monaco.css", () => {
    fs.copy("../monaco/dist/monaco.css", "./src/monaco/monaco.css");
});

fs.unlink("./src/monaco/monaco.js", () => {
    fs.copy("../monaco/dist/monaco.js", "./src/monaco/monaco.js");
});
