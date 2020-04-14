const dummy = (blogs) => {
  if (toString.call(blogs) === '[object Array]') return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, curr) => sum + curr

  return blogs.length === 0
    ? 0
    : blogs.map((blog) => blog.likes).reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes,
}
