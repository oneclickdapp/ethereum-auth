const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval" // Fastest for development
  // devtool: "eval-source-map" // NOTE: Useful for debugging
});
