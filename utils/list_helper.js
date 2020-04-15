const dummy = (blogs) => {
  if (toString.call(blogs) === '[object Array]') return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, curr) => sum + curr

  return blogs.length === 0
    ? 0
    : blogs.map((blog) => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((max, curr) => {
    return max.likes < curr.likes ? curr : max
  })

  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
