const editors = {
    items: {},
    path: `${document.querySelector("script:last-child").getAttribute("src").split("?")[0].split("/").slice(0, -1).join("/")}/`,
    add(id, value) {
        this.items[id] = value;
    },
    get(id) {
        return this.items[id];
    },
};

class Editor {
    constructor(ele, id, value) {
        let url = "";

        if (ele.hasAttribute("language") && ele.getAttribute("language") !== "") {
            if (url !== "") {
                url += "&";
            } else {
                url += "?";
            }

            url += `lang=${ele.getAttribute("language")}`;
        }

        if (ele.hasAttribute("dark") && ele.getAttribute("dark") !== "false") {
            if (url !== "") {
                url += "&";
            } else {
                url += "?";
            }

            url += "theme=dark";
        }

        if (ele.hasAttribute("url") && ele.getAttribute("url") !== "") {
            if (url !== "") {
                url += "&";
            } else {
                url += "?";
            }

            url += `url=${ele.getAttribute("url")}`;
        }

        this.frame = document.createElement("div");
        this.frame.innerHTML = `<iframe id="${id}" name="${(ele.getAttribute("name") || "")}" class="editor-frame ${(ele.getAttribute("class") || "")}" style="${(ele.getAttribute("style") || "")}" src="${editors.path}editor.html${url}"></iframe>`;
        this.frame = this.frame.firstChild;

        this.editor = null;

        this.events = {
            ready: new Event("ready"),
            input: new Event("input"),
            change: new Event("change"),
        };

        this.frame.addEventListener("load", () => {
            this.editor = this.frame.contentWindow.editor;

            if (value && value !== "") {
                this.editor.code = value;
            }

            setTimeout(() => {
                this.frame.contentWindow.addEventListener("input", () => {
                    ele.dispatchEvent(this.events.input);
                });

                this.frame.contentWindow.addEventListener("change", () => {
                    ele.dispatchEvent(this.events.change);
                });

                ele.dispatchEvent(this.events.ready);
            }, 500);
        });

        ele.parentNode.insertBefore(this.frame, ele);
    }

    get code() {
        return this.editor.code;
    }

    set code(value) {
        this.editor.code = value;
    }

    get errors() {
        return this.editor.errors;
    }

    fix() {
        this.editor.fix();

        return this;
    }

    focus() {
        this.frame.contentWindow.focus();

        return this;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const fields = Array.prototype.slice.call(document.getElementsByTagName("input"));

    Object.keys(fields).forEach((key) => {
        if (fields[key].getAttribute("type") === "editor") {
            const id = (fields[key].id || Date.now());

            editors.add(id, new Editor(fields[key], id, fields[key].value));
            fields[key].value = "";
        }
    });

    const elements = Array.prototype.slice.call(document.getElementsByTagName("editor"));

    Object.keys(elements).forEach((key) => {
        const id = (elements[key].id || Date.now());

        editors.add(id, new Editor(elements[key], id, elements[key].innerText));
        fields[key].innerText = "";
    });
});
