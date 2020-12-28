const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "ethereumAuthProvider",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
};
