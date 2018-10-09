/* eslint-disable */

const fs = require("fs-extra");
const path = require("path");
const dir = require("fs");

fs.emptyDir("../build/editor/css/", () => {
    dir.readdir("./dist/css/", (err, files) => {
        if (err) {
            throw (err);
        }

        for (let i = 0; i < files.length; i++) {
            fs.copy(path.join("./dist/css/", files[i]), path.join("../build/editor/css/", files[i]));
        }
    });
});

fs.emptyDir("../build/editor/js/", () => {
    dir.readdir("./dist/js/", (err, files) => {
        if (err) {
            throw (err);
        }

        for (let i = 0; i < files.length; i++) {
            fs.copy(path.join("./dist/js/", files[i]), path.join("../build/editor/js/", files[i]));
        }
    });
});

fs.unlink("../build/editor/editor.css", () => {
    fs.copy("./dist/editor.css", "../build/editor/editor.css");
});

fs.unlink("../build/editor/editor.js", () => {
    fs.copy("./dist/editor.js", "../build/editor/editor.js");
});

fs.unlink("../build/editor/index.html", () => {
    fs.copy("./dist/index.html", "../build/editor/index.html");
});
