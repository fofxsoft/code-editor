const editors = {
    items: {},
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

        if (ele.getAttribute("language") && ele.getAttribute("language") !== "") {
            if (url !== "") {
                url += "&";
            } else {
                url += "?";
            }

            url += `lang=${ele.getAttribute("language")}`;
        }

        if (ele.getAttribute("url") && ele.getAttribute("url") !== "") {
            if (url !== "") {
                url += "&";
            } else {
                url += "?";
            }

            url += `url=${ele.getAttribute("url")}`;
        }

        let lib = ele.getAttribute("lib");

        if (!lib.endsWith("/")) {
            lib += "/";
        }

        this.frame = document.createElement("div");
        this.frame.innerHTML = `<iframe id="${id}" name="${(ele.getAttribute("name") || "")}" class="editor-frame ${(ele.getAttribute("class") || "")}" style="${(ele.getAttribute("style") || "")}" src="${lib}editor.html${url}"></iframe>`;
        this.frame = this.frame.firstChild;

        this.editor = null;
        this.ready = new Event("ready");

        this.frame.addEventListener("load", () => {
            this.editor = this.frame.contentWindow.editor;

            if (value && value !== "") {
                this.editor.code = value;
            }

            ele.dispatchEvent(this.ready);
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
    }

    focus() {
        this.frame.contentWindow.focus();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const fields = Array.prototype.slice.call(document.getElementsByTagName("input"));

    Object.keys(fields).forEach((key) => {
        if (fields[key].getAttribute("type") === "editor") {
            const id = (fields[key].id || Date.now());

            editors.add(id, new Editor(fields[key], id, fields[key].value));
        }
    });

    const elements = Array.prototype.slice.call(document.getElementsByTagName("editor"));

    Object.keys(elements).forEach((key) => {
        const id = (elements[key].id || Date.now());

        editors.add(id, new Editor(elements[key], id, elements[key].innerText));
    });
});
