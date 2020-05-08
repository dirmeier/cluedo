const path = require("path")
// const Uglify = require("uglifyjs-webpack-plugin")

module.exports = {
  entry: "./src/main.ts",
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre"
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
   }
    // ,
  // plugins: [
  //   new Uglify()
  // ]
}
