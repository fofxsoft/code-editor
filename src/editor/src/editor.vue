<template>
    <div id="monaco-container">
        <monaco class="monaco" :dark="dark ? true : false" :language="lang" :minimap="minimap" :linter="linter" :config="config" v-model="code" @change="change" @input="input" />
    </div>
</template>

<script>
    import monaco from "./monaco";
    import globals from "./globals.js";
    import environment from "./environment.js";
    import parser from "./parser.js";
    import rules from "./rules.js";

    export default {
        name: "editor",
        props: ["url", "lang", "dark", "minimap"],
        components: {
            monaco
        },

        data() {
            var me = this;

            return {
                config: null,
                linter: null,
                code: null,
                fixedCode: null,
                errors: [],
                fixedErrors: [],
                events: {
                    input: new Event("input"),
                    change: new Event("change"),
                },
                change(payload) {
                    me.errors = payload.messages;
                    me.fixedCode = payload.fixedCode;
                    me.fixedErrors = payload.fixedMessages;

                    window.dispatchEvent(me.events.change);
                },
                input() {
                    window.dispatchEvent(me.events.input);
                }
            };
        },

        async mounted() {
            if (this.lang === "javascript") {
                this.config = {
                    globals: globals,
                    env: environment,
                    parserOptions: parser,
                    rules: rules
                };

                const { default: Linter } = await import("eslint4b");

                this.linter = new Linter();
            }

            const me = this;

            window.editor = {
                get code() {
                    return me.code;
                },
                set code (value) {
                    me.code = value;
                },
                get errors() {
                    if (!me.errors) {
                        return [];
                    }

                    return me.errors;
                },
                fix() {
                    if (me.fixedCode && me.fixedCode !== me.code) {
                        me.code = me.fixedCode;
                        me.errors = me.fixedErrors;
                    }
                },
            };

            if (this.url) {
                this.$http.get(this.url, { responseType: "text" }).then((response) => {
                    if (Object.prototype.toString.call(response.body) === "[object String]") {
                        window.editor.code = response.body;
                    } else {
                        window.editor.code = JSON.stringify(response.body, null, 4);
                    }
                });
            }
        }
    };
</script>

<style>
    #monaco-container {
        height: 100%;
        box-sizing: border-box;
    }

    #monaco-container .model-input {
        display: none;
    }

    #monaco-container .monaco {
        height: 100%;
        box-sizing: border-box;
    }
</style>
