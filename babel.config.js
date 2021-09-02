module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs"
        // targets: {
        //   esmodules: true
        // }
      }
    ]
  ]
  // plugins: [
  //   [
  //     "@babel/plugin-transform-runtime",
  //     {
  //       regenerator: true,
  //       corejs: 3
  //     }
  //   ]
  // ]
};
