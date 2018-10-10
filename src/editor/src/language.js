export default {
    parse(lang, url) {
        if (!lang) {
            return this.extention(url);
        }

        switch (lang.toLowerCase()) {
            case "css":
            case "less":
            case "sass":
            case "scss":
            case "stylesheet":
                return "css";

            case "htm":
            case "html":
                return "html";

            case "js":
            case "javascript":
                return "javascript";

            case "ts":
            case "typescript":
                return "typescript";

            case "mysql":
                return "mysql";

            case "sql":
                return "sql";

            case "xml":
                return "xml";

            case "json":
                return "json";

            case "txt":
            case "text":
                return "text";

            default:
                return this.extention(url);
        }
    },

    extention(url) {
        if (!url) {
            return "text";
        }

        const ext = (/(?:\.([^.]+))?$/).exec(url)[1];

        if (!ext) {
            return "text";
        }

        switch (ext.split("?")[0].toLowerCase()) {
            case "css":
            case "less":
            case "sass":
            case "scss":
                return "css";

            case "htm":
            case "html":
                return "html";

            case "js":
                return "javascript";

            case "ts":
                return "typescript";

            case "sql":
                return "sql";

            case "xml":
                return "xml";

            case "json":
                return "json";

            case "txt":
            default:
                return "text";
        }
    },
};
