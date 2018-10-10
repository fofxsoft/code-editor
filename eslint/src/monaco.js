import "../../monaco/esm/vs/editor/browser/controller/coreCommands";
import "../../monaco/esm/vs/editor/browser/widget/codeEditorWidget";
import "../../monaco/esm/vs/editor/browser/widget/diffEditorWidget";
import "../../monaco/esm/vs/editor/browser/widget/diffNavigator";

import "../../monaco/esm/vs/editor/contrib/bracketMatching/bracketMatching";
import "../../monaco/esm/vs/editor/contrib/caretOperations/caretOperations";
import "../../monaco/esm/vs/editor/contrib/caretOperations/transpose";
import "../../monaco/esm/vs/editor/contrib/clipboard/clipboard";
import "../../monaco/esm/vs/editor/contrib/comment/comment";
import "../../monaco/esm/vs/editor/contrib/contextmenu/contextmenu";
import "../../monaco/esm/vs/editor/contrib/find/findController";
import "../../monaco/esm/vs/editor/contrib/folding/folding";
import "../../monaco/esm/vs/editor/contrib/format/formatActions";
import "../../monaco/esm/vs/editor/contrib/gotoError/gotoError";
import "../../monaco/esm/vs/editor/contrib/hover/hover";
import "../../monaco/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace";
import "../../monaco/esm/vs/editor/contrib/linesOperations/linesOperations";
import "../../monaco/esm/vs/editor/contrib/smartSelect/smartSelect";
import "../../monaco/esm/vs/editor/contrib/suggest/suggestController";
import "../../monaco/esm/vs/editor/contrib/wordHighlighter/wordHighlighter";
import "../../monaco/esm/vs/editor/contrib/wordOperations/wordOperations";

import "../../monaco/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp";
import "../../monaco/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens";
import "../../monaco/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard";
import "../../monaco/esm/vs/editor/standalone/browser/quickOpen/quickOutline";
import "../../monaco/esm/vs/editor/standalone/browser/quickOpen/gotoLine";
import "../../monaco/esm/vs/editor/standalone/browser/quickOpen/quickCommand";

import * as monaco from "../../monaco/esm/vs/editor/editor.api";

import "../../monaco/esm/vs/language/typescript/monaco.contribution";
import "../../monaco/esm/vs/language/css/monaco.contribution";
import "../../monaco/esm/vs/language/json/monaco.contribution";
import "../../monaco/esm/vs/language/html/monaco.contribution";

import "../../monaco/esm/vs/basic-languages/css/css.contribution";
import "../../monaco/esm/vs/basic-languages/html/html.contribution";
import "../../monaco/esm/vs/basic-languages/sql/sql.contribution";
import "../../monaco/esm/vs/basic-languages/mysql/mysql.contribution";
import "../../monaco/esm/vs/basic-languages/xml/xml.contribution";
import "../../monaco/esm/vs/basic-languages/csharp/csharp.contribution";
import "../../monaco/esm/vs/basic-languages/vb/vb.contribution";

import editorWorker from "../../monaco/esm/vs/editor/editor.worker";
import cssWorker from "../../monaco/esm/vs/language/css/css.worker";
import htmlWorker from "../../monaco/esm/vs/language/html/html.worker";
import jsonWorker from "../../monaco/esm/vs/language/json/json.worker";
import tsWorker from "../../monaco/esm/vs/language/typescript/ts.worker";

const workerURL = {
    css: cssWorker,
    html: htmlWorker,
    json: jsonWorker,
    javascript: tsWorker,

    get typescript() {
        return this.javascript;
    },
};

Object.setPrototypeOf(workerURL, null);

window.MonacoEnvironment = {
    getWorkerUrl: (_, label) => workerURL[label] || editorWorker,
};

export default monaco;
