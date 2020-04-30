library(magick)
library(purrr)

fls <- c(
  "agora.jpeg",
  "bouleuterion.jpeg",
  "barrell.jpeg",
  "hill.jpeg",
  "library.jpeg",
  "parthenon.jpeg",
  "socrates.jpeg",
  "temple.jpeg",
  "theater.jpeg",
  "tree.jpeg"
)

img <- purrr::map(
  fls,
  function(fl) image_read(fl)
)
a <- image_append
s <- image_scale
e <- image_extent

row1 <- a(
  c(
    s(img[[3]], "100x100"),
    s(img[[10]], "100x100"),
    s(img[[5]], "100x100"),
    s(img[[2]], "100x100")
  ),
)
plot(row1)

row2 <- a(
  c(
    s(img[[1]], "100x100"),
    s(img[[7]], "100x100"),
    s(img[[9]], "100x100")
  ),
)
plot(row2)

row3 <- a(image =
  c(
    s(img[[8]], "100x100"),
    s(img[[6]], "100x100"),
    s(img[[4]], "100x100")
  ),
)
plot(row3)


a(c(row1, row2, row3), TRUE)
