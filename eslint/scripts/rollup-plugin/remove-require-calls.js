import path from "path";

export default () => ({
    name: "remove-require",

    transform(source, id) {
        if (path.extname(id) !== ".js") {
            return null;
        }

        return source.replace(/\brequire\(".+?"\)/g, "undefined");
    }
});
