<template>
    <div :class="{'eslint-editor-dark':dark}" class="eslint-editor-root">
        <transition name="eslint-editor-fade" @before-enter="fadeIn">
            <div v-if="monaco" key="editor" class="eslint-editor-swap-container">
                <div ref="monaco" class="eslint-editor-monaco" />
            </div>
        </transition>
    </div>
</template>

<script>
    const EDITOR_OPTS = {
        autoIndent: true,
        automaticLayout: true,
        find: {
            autoFindInSelection: true,
            seedSearchStringFromSelection: true
        },
        minimap: {
            enabled: true
        },
        renderControlCharacters: true,
        renderIndentGuides: true,
        renderWhitespace: "boundary",
        scrollbar: {
            useShadows: false
        },
        scrollBeyondLastLine: false
    };

    function ensurePositiveInt(value, defaultValue) {
        return Math.max(1, (value !== undefined ? value : defaultValue) | 0);
    }

    function updateValue(editor, value) {
        const model = editor.getModel();

        if (model != null && value !== model.getValue()) {
            model.setValue(value);
        }
    }

    function dispose(x) {
        if (x == null) {
            return;
        }

        if (x.getOriginalEditor) {
            dispose(x.getOriginalEditor());
        }

        if (x.getModifiedEditor) {
            dispose(x.getModifiedEditor());
        }

        if (x.getModel) {
            dispose(x.getModel());
        }

        if (x.dispose) {
            x.dispose();
        }
    }

    export default {
        name: "ESLintEditor",
        model: {
            prop: "code",
            event: "input"
        },
        props: {
            linter: {
                type: Object,
                default: null
            },
            code: {
                type: String,
                default: ""
            },
            config: {
                type: Object,
                default() {
                    return {}
                }
            },
            dark: {
                type: Boolean,
                default: false
            },
            filename: {
                type: String,
                default: "a.js"
            },
            fix: {
                type: Boolean,
                default: false
            },
            format: {
                type: Object,
                default() {
                    return {
                        insertSpaces: true,
                        tabSize: 4
                    }
                }
            },
            language: {
                type: String,
                default: "javascript"
            }
        },

        data() {
            return {
                monaco: null,
                monacoLoadingError: null,
                editor: null,
                editing: false,
                messages: [],
                fixedCode: this.code,
                fixedMessages: [],
                previewFix: false,
                requestFix: false
            }
        },

        computed: {
            codeEditor() {
                const editor = this.editor
                if (editor != null) {
                    if (editor.getOriginalEditor != null) {
                        return editor.getOriginalEditor();
                    }

                    return editor;
                }

                return null;
            },

            fixedCodeEditor() {
                const editor = this.editor;

                if (editor != null && editor.getModifiedEditor != null) {
                    return editor.getModifiedEditor();
                }

                return null;
            },
        },

        watch: {
            linter() {
                this.invalidate();
            },

            code(value) {
                const editor = this.codeEditor;

                if (editor != null) {
                    updateValue(editor, value);
                }

                this.invalidate();
            },

            previewFix() {
                this.initialize();
            },

            config: {
                handler() {
                    this.invalidate();
                },
                deep: true,
            },

            filename() {
                this.invalidate();
            },

            fix() {
                this.initialize();
            },

            fixedCode(value) {
                const editor = this.fixedCodeEditor;

                if (editor != null) {
                    updateValue(editor, value);
                }
            },

            fixedMessages(value) {
                const editor = this.fixedCodeEditor;

                if (editor != null) {
                    this.updateMarkers(editor, value);
                }
            },

            format(value) {
                const editor = this.codeEditor;

                if (editor != null) {
                    editor.getModel().updateOptions(value);
                }
            },

            messages(value) {
                const editor = this.codeEditor;

                if (editor != null) {
                    this.updateMarkers(editor, value);
                }
            },

            language(value) {
                const {
                    monaco
                } = this;

                if (monaco != null) {
                    for (const editor of [this.codeEditor, this.fixedCodeEditor]) {
                        if (editor != null) {
                            monaco.setModelLanguage(editor.getModel(), value);
                        }
                    }
                }
            },
        },

        mounted() {
            import("./monaco").then(({
                default: monaco
            }) => this.monaco = monaco, error => this.monacoLoadingError = error);
        },

        beforeDestroy() {
            dispose(this.editor);

            this.$refs.monaco.innerHTML = "";
            this.editor = null;
        },

        methods: {
            fadeIn(el) {
                if (this.$refs.monaco && this.$refs.monaco.parentNode === el) {
                    this.initialize();
                }
            },

            focus() {
                if (this.editor == null) {
                    return;
                }

                this.editor.focus();
            },

            initialize() {
                if (this.monaco != null) {
                    dispose(this.editor);

                    this.$refs.monaco.innerHTML = "";
                    this.editor = this.previewFix ? this.createTwoPaneEditor() : this.createEditor();
                    this.lint();

                    const me = this;

                    window.focus = function focus() {
                        me.focus();
                    }
                }
            },

            createEditor() {
                const {
                    monaco
                } = this;

                const editor = monaco.editor.create(
                    this.$refs.monaco,
                    Object.assign(
                        {
                            theme: this.dark ? "vs-dark" : "vs"
                        },
                        EDITOR_OPTS
                    )
                );

                const model = monaco.editor.createModel(this.code, this.language);

                model.updateOptions(this.format);

                model.onDidChangeContent(() => {
                    this.$emit("input", model.getValue());
                    this.invalidate();
                });

                editor.setModel(model);

                this.updateMarkers(editor, this.messages);

                return editor;
            },

            createTwoPaneEditor() {
                const {
                    monaco
                } = this;

                const editor = monaco.editor.createDiffEditor(
                    this.$refs.monaco,
                    Object.assign(
                        {
                            theme: this.dark ? "vs-dark" : "vs"
                        },
                        EDITOR_OPTS
                    )
                );

                const original = monaco.editor.createModel(this.code, this.language);

                const modified = monaco.editor.createModel(
                    this.fixedCode,
                    this.language
                );

                const leftEditor = editor.getOriginalEditor();
                const rightEditor = editor.getModifiedEditor();

                rightEditor.updateOptions({
                    readOnly: true
                });

                original.updateOptions(this.format);

                original.onDidChangeContent(() => {
                    const code = original.getValue();

                    this.fixedCode = code;
                    this.$emit("input", code);
                    this.invalidate();
                });

                editor.setModel({
                    original,
                    modified
                });

                this.updateMarkers(leftEditor, this.messages);
                this.updateMarkers(rightEditor, this.fixedMessages);

                return editor;
            },

            messageToMarker(message) {
                const {
                    monaco
                } = this;

                const startLineNumber = ensurePositiveInt(message.line, 1);
                const startColumn = ensurePositiveInt(message.column, 1);

                const endLineNumber = ensurePositiveInt(
                    message.endLine,
                    startLineNumber
                );

                const endColumn = ensurePositiveInt(
                    message.endColumn,
                    startColumn + 1
                );

                return {
                    severity: monaco.Severity.Error,
                    source: "ESLint",
                    message: `${message.message} (${message.ruleId || "FATAL"})`,
                    startLineNumber,
                    startColumn,
                    endLineNumber,
                    endColumn
                };
            },

            updateMarkers(editor, messages) {
                const {
                    monaco
                } = this;

                const model = editor.getModel();
                const id = editor.getId();
                const markers = messages.map(this.messageToMarker, this);

                monaco.editor.setModelMarkers(model, id, markers);
            },

            invalidate() {
                if (this.editor != null && !this.editing) {
                    this.editing = true;

                    setTimeout(() => {
                        this.lint()
                        this.editing = false
                    }, 667);
                }
            },

            lint() {
                const {
                    codeEditor: editor,
                    config,
                    filename,
                    linter
                } = this;

                if (editor == null || linter == null) {
                    return;
                }

                const model = editor.getModel();
                const code = model.getValue();

                try {
                    this.messages = linter.verify(code, config, {
                        filename
                    });
                } catch (err) {
                    this.messages = [{
                        fatal: true,
                        severity: 2,
                        message: err.message,
                        line: 1,
                        column: 0
                    }];
                }

                try {
                    const ret = linter.verifyAndFix(code, config, {
                        filename
                    });

                    this.fixedCode = ret.fixed ? ret.output : code;
                    this.fixedMessages = ret.messages;
                } catch (err) {
                    this.fixedCode = code;

                    this.fixedMessages = [{
                        fatal: true,
                        severity: 2,
                        message: err.message,
                        line: 1,
                        column: 0
                    }];
                }

                this.$emit("change", {
                    code,
                    messages: this.messages,
                    fixedCode: this.fixedCode,
                    fixedMessages: this.fixedMessages
                });

                if (this.requestFix) {
                    this.requestFix = false;
                    this.code = this.fixedCode;
                }
            },

            applyAutofix() {
                if (this.editing) {
                    this.requestFix = true;
                } else {
                    this.code = this.fixedCode;
                }
            }
        }
    }
</script>

<style>
    .eslint-editor-root {
        position: relative;
    }

    .eslint-editor-swap-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .eslint-editor-monaco {
        width: 100%;
        height: 100%;
    }

    .eslint-editor-actions {
        display: flex;
        flex-direction: row;
        position: absolute;
        right: 20px;
        bottom: 8px;
        border: 1px solid gray;
        border-radius: 4px;
        opacity: 0.3;
        transition: opacity 0.3s;
    }

    .eslint-editor-actions:hover {
        opacity: 1;
    }

    .eslint-editor-actions::before {
        content: "🔧";
        display: inline-block;
        margin: 2px;
        padding: 5px;
        font-size: 1em;
        vertical-align: middle;
    }

    .eslint-editor-actions,
    .eslint-editor-actions button {
        background-color: #ffffff;
        color: #1e1e1e;
    }

    .eslint-editor-actions > * {
        display: inline-block;
        box-sizing: border-box;
        width: 80px;
        margin: 2px;
        padding: 4px 8px;
        border: 1px solid gray;
        border-radius: 4px;
        font-family: inherit;
        font-size: 1em;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
    }

    .eslint-editor-root .eslint-editor-actions > *:hover {
        background-color: rgba(128, 128, 128, 0.2);
    }

    .eslint-editor-root .eslint-editor-actions > *:active {
        background-color: rgba(128, 128, 128, 0.4);
    }

    .eslint-editor-actions input[type="checkbox"] {
        display: none;
    }

    .eslint-editor-root .eslint-editor-placeholder-code {
        visibility: hidden;
    }

    @keyframes ESLintEditorLoadingIcon {
        0% {
            transform: rotateY(0deg);
        }
        50% {
            transform: rotateY(210deg);
        }
        100% {
            transform: rotateY(360deg);
        }
    }

    .eslint-editor-fade-enter-active,
    .eslint-editor-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .eslint-editor-fade-enter,
    .eslint-editor-fade-leave-to {
        opacity: 0;
    }

    .current-line {
        border: 0 none !important;
        background: #f4f4f4;
    }

    .eslint-editor-dark .current-line {
        background: #363636;
    }

    .minimap {
       box-shadow: -1px 0 0 0 #eee;
    }

    .eslint-editor-dark .minimap {
       box-shadow: -1px 0 0 0 #383838;
    }
</style>
