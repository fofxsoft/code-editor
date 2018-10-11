import fs from "fs-extra";

const beautifyCss = /monaco-editor(?:\/|\\)esm(?:\/|\\)vs(?:\/|\\)language(?:\/|\\)html(?:\/|\\)_deps(?:\/|\\)vscode-html-languageservice(?:\/|\\)beautify(?:\/|\\)beautify-css.js$/;
const beautifyHtml = /monaco-editor(?:\/|\\)esm(?:\/|\\)vs(?:\/|\\)language(?:\/|\\)html(?:\/|\\)_deps(?:\/|\\)vscode-html-languageservice(?:\/|\\)beautify(?:\/|\\)beautify-html.js$/;

export default () => ({
    name: "beautify-html",

    async load(id) {
        if (beautifyCss.test(id)) {
            const code = await fs.readFile(id, "utf8");

            return (code.replace(/^[\s\S]*var legacy_beautify_css =/, "export const css_beautify =").replace(/var css_beautify = legacy_beautify_css;[\s\S]*$/, ""));
        }

        if (beautifyHtml.test(id)) {
            const code = await fs.readFile(id, "utf8");

            return (
                code.replace(/^[\s\S]*var legacy_beautify_html =/, "const legacy_beautify_html =").replace(/var style_html = legacy_beautify_html;[\s\S]*$/, `
import { js_beautify } from "./beautify.js";
import { css_beautify } from "./beautify-css.js";
export function html_beautify(html_source, options) {
    return legacy_beautify_html(html_source, options, js_beautify, css_beautify);
}
`));
        }

        return null;
    },
});
