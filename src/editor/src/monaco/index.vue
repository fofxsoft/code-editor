<template>
    <div :class="{'dark':dark}" class="root">
        <transition name="editor-fade" @before-enter="fadeIn">
            <div v-if="monaco" key="editor" class="swap-container">
                <div ref="monaco" class="monaco" />
            </div>
            <div v-else key="placeholder" class="swap-container">
                <transition name="editor-fade">
                    <div v-if="monacoLoadingError" key="error" class="loading-error">
                        <div class="error-message">
                            Failed to Load Editor
                        </div>
                    </div>
                    <div v-else key="loading" class="loading">
                        <div class="loading-icon">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </transition>
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

            minimap: {
                type: Boolean,
                default: true
            },

            filename: {
                type: String,
                default: "a.js"
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
            }
        },

        computed: {
            codeEditor() {
                const editor = this.editor;

                if (editor != null) {
                    if (editor.getOriginalEditor != null) {
                        return editor.getOriginalEditor();
                    }

                    return editor;
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

            config: {
                handler() {
                    this.invalidate();
                },
                deep: true,
            },

            filename() {
                this.invalidate();
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
                    const editor = this.codeEditor;

                    if (editor != null) {
                        monaco.setModelLanguage(editor.getModel(), value);
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
                    this.editor = this.createEditor();
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
                            theme: this.dark ? "vs-dark" : "vs",
                            minimap: {
                                enabled: this.minimap
                            }
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
                            theme: this.dark ? "vs-dark" : "vs",
                            minimap: {
                                enabled: this.minimap
                            }
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
            }
        }
    }
</script>

<style>
    .root {
        position: relative;
    }

    .swap-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .monaco {
        width: 100%;
        height: 100%;
    }

    .loading,
    .loading-error {
        position: absolute;
        color: #545454;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .dark .loading,
    .dark .loading-error {
        color: #cecece;
    }

    .error-message {
        display: inline;
    }

    .loading-icon {
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
    }

    .loading-icon div {
        position: absolute;
        top: 27px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #007acc;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    .dark .loading-icon div {
        background: #5f5f5f;
    }

    .loading-icon div:nth-child(1) {
        left: 6px;
        animation: loading-icon1 0.6s infinite;
    }

    .loading-icon div:nth-child(2) {
        left: 6px;
        animation: loading-icon2 0.6s infinite;
    }

    .loading-icon div:nth-child(3) {
        left: 26px;
        animation: loading-icon2 0.6s infinite;
    }

    .loading-icon div:nth-child(4) {
        left: 45px;
        animation: loading-icon3 0.6s infinite;
    }

    @keyframes loading-icon1 {
        0% {
            transform: scale(0);
        }

        100% {
            transform: scale(1);
        }
    }

    @keyframes loading-icon3 {
        0% {
            transform: scale(1);
        }

        100% {
            transform: scale(0);
        }
    }

    @keyframes loading-icon2 {
        0% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(19px, 0);
        }
    }

    .current-line {
        border: 0 none !important;
        background: #f4f4f4;
    }

    .dark .current-line {
        background: #363636;
    }

    .minimap {
       box-shadow: -1px 0 0 0 #eee;
    }

    .dark .minimap {
       box-shadow: -1px 0 0 0 #383838;
    }
</style>
