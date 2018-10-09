const editor = {};

function Editor(ele, id, value) {
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

    this.frame = document.createElement("div");
    this.frame.innerHTML = `<iframe id="${id}" name="${(ele.getAttribute("name") || "")}" class="editor-frame ${(ele.getAttribute("class") || "")}" style="${(ele.getAttribute("style") || "")}" src="editor/${url}"></iframe>`;
    this.frame = this.frame.firstChild;

    if (value && value !== "") {
        this.frame.addEventListener("load", () => {
            setTimeout(() => {
                this.setCode(value);
            }, 500);
        });
    }

    ele.parentNode.replaceChild(this.frame, ele);
}

Editor.prototype.getCode = function getCode() {
    return (this.frame.contentDocument || this.frame.contentWindow.document).getElementById("code").value;
};

Editor.prototype.setCode = function setCode(value) {
    const code = (this.frame.contentDocument || this.frame.contentWindow.document).getElementById("code");

    code.value = value;
    code.dispatchEvent(new Event("input"));
};

Editor.prototype.getErrors = function getErrors() {
    let errors = (this.frame.contentDocument || this.frame.contentWindow.document).getElementById("errors").innerText;

    if (!errors || errors === "") {
        errors = [];
    } else {
        errors = JSON.parse(errors);
    }

    return errors;
};

document.addEventListener("DOMContentLoaded", () => {
    const fields = Array.prototype.slice.call(document.getElementsByTagName("input"));

    Object.keys(fields).forEach((key) => {
        if (fields[key].getAttribute("type") === "editor") {
            const id = (fields[key].id || Date.now());

            editor[id] = new Editor(fields[key], id, fields[key].value);
        }
    });

    const elements = Array.prototype.slice.call(document.getElementsByTagName("editor"));

    Object.keys(elements).forEach((key) => {
        const id = (elements[key].id || Date.now());

        editor[id] = new Editor(elements[key], id, elements[key].innerText);
    });
});
