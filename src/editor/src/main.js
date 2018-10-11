import Vue from "vue";
import Resource from "vue-resource";
import Router from "vue-router";

import language from "./language.js";

import app from "./app.vue";
import editor from "./editor.vue";

Vue.use(Resource);
Vue.use(Router);

Vue.config.productionTip = false;

const router = new Router({
    mode: "history",
    routes: [{
        path: "*",
        component: editor,
        props: route => ({
            url: route.query.url,
            lang: language.parse(route.query.lang, route.query.url),
            dark: route.query.theme === "dark",
        }),
    }],
});

(() => new Vue({
    router,
    el: "#app",
    render: h => h(app),
}))();
