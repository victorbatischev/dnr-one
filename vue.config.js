const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`,
            },
        },
    },
    transpileDependencies: true,
    publicPath: process.env.NODE_ENV === "test" ? "/dnr.one/" : "/",
    productionSourceMap: false,
    filenameHashing: false,
    devServer: {
        proxy: {
            "^/api": {
                target: "https://front.dnr.one",
                ws: false,
                changeOrigin: true,
            },
        },
    },
});
