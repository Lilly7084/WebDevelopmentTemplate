const fs = require("fs");
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

const isDev = true;

console.log("[*] Using", isDev ? "development" : "production", "profile");

var entry = {};

// Get a list of all modules
fs.readdirSync("./src/", { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => dirent.name)
    .forEach(name =>
{
    const p1 = path.resolve(__dirname, "src", name);
    const extensions = [ '.js', '.ts', '.tsx' ];
    for (const ext of extensions) {
        const p2 = path.resolve(p1, "index" + ext);
        if (fs.existsSync(p2)) {
            console.log("[*] Found module:", name, "--", p2);
            entry[name] = p2;
        }
    }
});

console.log("");

module.exports =
{
    mode: isDev ? "development" : "production",
    devtool: isDev ? "inline-source-map" : false,

    entry: entry,

    output: {
        filename: isDev ? "[name].bundle.js" : "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: "[name].[hash][ext]",
        clean: true
    },

    optimization: {
        minimize: !isDev,
        minimizer: [ new TerserPlugin() ],
        removeAvailableModules: !isDev,
        removeEmptyChunks: !isDev,
        splitChunks: isDev ? false : {}
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev ? "[name].min.css" : "[name].[contenthash].css"
        }),
        new WebpackManifestPlugin({
            fileName: "manifest.json",
            publicPath: "/dist/"
        })
    ],

    resolve: {
        extensions: [ ".ts", ".tsx", ".js" ]
    },

    module: {
        rules: [
            {
                // TypeScript
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader", options: { transpileOnly: isDev } }
                ],
                exclude: /node_modules/
            },
            {
                // Stylesheets
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                // Images
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                // Fonts
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            }
        ]
    }
};
