const path = require("path")
const glob = require("glob")

module.exports = {
    entry: glob.sync("./app/src/**/*.js")
                .reduce((prev, next) => {
                    length = next.split("/").length
                    if (next.split("/")[3] != "views" ) return prev
                    prev[next.split("/").slice(-1).join("/")] = next;
                    return prev;
                }, {}),
    mode: "development",
    watch: true,
    devtool: "inline-source-maps",
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'app/static/js/')
    },
    module: {
        rules: [
            {
                test: /\.(jsx)|(js)$/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}