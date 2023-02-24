const BookmarkletPlugin = require("bookmarklet-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new BookmarkletPlugin({
            input: "main.js",
            linkName: "SlidesLive PiP",
            pageTitle: "SlidesLive Picture-in-Picture Bookmarklet",
            repo: "https://github.com/gmatt/slideslive-picture-in-picture",
        }),
    ],
};
