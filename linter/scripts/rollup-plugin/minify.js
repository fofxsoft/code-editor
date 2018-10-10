import uglify from "uglify-es";

export default () => ({
    name: "minify",

    transformBundle(source) {
        return uglify.minify(source).code;
    }
});
