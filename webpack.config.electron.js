/**
 * Build config for electron 'Main Process' file
 */
import webpack from "webpack";
import validate from "webpack-validator";
import merge from "webpack-merge";
import baseConfig from "./webpack.config.base";

export default validate(merge(baseConfig, {
    devtool: 'source-map',

    entry: ['babel-polyfill', './app/main/index'],

    // 'main.js' in root
    output: {
        path: __dirname,
        filename: './app/main.js'
    },

    plugins: [
        // Minify the output
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        // Add source map support for stack traces in node
        // https://github.com/evanw/node-source-map-support
        // new webpack.BannerPlugin(
        //   'require("source-map-support").install();',
        //   { raw: true, entryOnly: false }
        // ),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],

    /**
     * Set targed to Electron speciffic node.js env.
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: 'electron-main',

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    },

    externals: [
        "@exponent/electron-cookies",
        "back-forward-history",
        "bootstrap",
        "classnames",
        "electron-cookies",
        "electron-debug",
        "escape-html",
        "font-awesome",
        "is-online",
        "linkifyjs",
        "lodash",
        "material-design-icons",
        "moment",
        "normalizr",
        "offline-js",
        "react",
        "react-addons-css-transition-group",
        "react-addons-pure-render-mixin",
        "react-addons-transition-group",
        "react-dom",
        "react-ga",
        "react-lazy",
        "react-list",
        "react-redux",
        "react-router",
        "react-router-redux",
        "reactstrap",
        "redux",
        "redux-logger",
        "redux-thunk",
        "sass-resources-loader",
        "source-map-support",
        "electron-auto-updater",
        "react-notification-system",
        "react-notification-system-redux"
    ]
}));
