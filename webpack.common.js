const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    library: {
      name: "@oneclickdapp/etheruem-auth",
      type: "umd"
    },
    publicPath: "",
    globalObject: "this", // https://v4.webpack.js.org/configuration/output/#outputglobalobject
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  ],
  resolve: {
    alias: { process: "process/browser" },
    fallback: {
      os: require.resolve(`os-browserify/browser`),
      https: require.resolve(`https-browserify`),
      http: require.resolve(`stream-http`),
      stream: require.resolve(`stream-browserify`),
      util: require.resolve(`util/`),
      url: require.resolve(`url/`),
      assert: require.resolve(`assert/`),
      crypto: require.resolve(`crypto-browserify`)
    }
  },
  optimization: {
    // splitChunks: {
    //   chunks: "all"
    // },
    moduleIds: "deterministic"
    // runtimeChunk: {
    //   name: "manifest"
    // }
  }
};
