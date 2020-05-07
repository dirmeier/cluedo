// const gulp = require("gulp"),
//   uglify = require("gulp-uglify"),
//   babel = require("gulp-babel"),
//   src = "app/",
//   build = "dist/"
//
// gulp.task("default", () =>
//   gulp.src(["app.js", src + "view.js"])
//   .pipe(babel())
//   .pipe(uglify())
//   .pipe(concat())
//   .pipe(gulp.dest("dist"))

const path = require("path")
const Uglify = require("uglifyjs-webpack-plugin")

module.exports = {
  entry: "./src/main.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  }, plugins: [
    new Uglify()
  ]
}

