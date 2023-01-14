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
        }),
    ],
};
