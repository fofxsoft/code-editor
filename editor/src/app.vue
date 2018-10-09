<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "app"
    };
</script>

<style>
    html,
    body {
        height: 100%;
        margin: 0;
        overflow: hidden;
    }

    #app {
        height: 100%;
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
        color: #2c3e50;
    }
</style>
