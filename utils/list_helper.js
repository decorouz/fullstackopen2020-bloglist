const dummy = (blogs) => {
  if (toString.call(blogs) === '[object Array]') return 1
}

module.exports = {
  dummy,
}
