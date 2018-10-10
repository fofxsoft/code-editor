import css from "./rollup-plugin/css";
import removeRequireCalls from "./rollup-plugin/remove-require-calls";
import resolve from "./rollup-plugin/resolve";
import worker from "./rollup-plugin/worker";

export default {
    experimentalDynamicImport: true,
    input: "./src/monaco.js",
    onwarn() {},
    output: {
        file: "./dist/monaco.js",
        format: "es",
    },
    plugins: [
        css(),
        removeRequireCalls(),
        resolve(),
        worker(),
    ],
};
