const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const fs = require("fs");
const path = require("path");

const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  module: {
    rules: [
      { test: /\.css$/, type: "asset/resource", sideEffects: true },
      { test: /\.html$/i, type: "asset/resource" },
      { test: /\.(jpe?g|png|gif|svg)$/i, type: "asset" },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "index.html"),
        },
        {
          from: path.resolve(__dirname, "src", "non_critical.css"),
          to: "main.css",
        },
        {
          from: path.resolve(__dirname, "src", "critical.css"),
        },
        {
          from: path.resolve(__dirname, "src", "assets"),
          to: "assets",
        },
        {
          from: path.resolve(__dirname, "src", "*.png"),
          to: "[name][ext]",
        },
        {
          from: path.resolve(__dirname, "src", "robots.txt"),
        },
        {
          from: path.resolve(__dirname, "src", "favicon.ico"),
        },
        {
          from: path.resolve(__dirname, "src", "site.webmanifest"),
        },
      ],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap("NoOpPlugin", () => {
          fs.writeFileSync("./src/index.js", "");
        });
      },
    },
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin({
        minimizerOptions: {
          collapseInlineTagWhitespace: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          noNewlinesBeforeTagClose: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeEmptyElements: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          html5: true,
          keepClosingSlash: false,
          useShortDoctype: true,
        },
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: "cssnano-preset-advanced",
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
};
