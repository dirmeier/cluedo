const
  gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  pipeline = require("readable-stream").pipeline,
  src = "app/",
  build = "dist/";

gulp.task("uglify", function () {
  return pipeline(
    gulp.src(src + "*.js"),
    uglify(),
    gulp.dest(build)
  );
});
