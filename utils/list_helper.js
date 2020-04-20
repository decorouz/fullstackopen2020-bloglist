const dummy = (blogs) => {
  if (toString.call(blogs) === '[object Array]') return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, curr) => sum + curr

  return blogs.length >= 1
    ? blogs.map((blog) => blog.likes).reduce(reducer, 0)
    : 0
}

const favoriteBlog = (blogs) => {
  const { title, author, likes } = blogs.reduce((max, curr) =>
    max.likes > curr.likes ? max : curr
  )
  return {
    title,
    author,
    likes,
  }
}

const mostBlogs = (blogs) => {
  const blogCount = blogs.reduce((acc, curr) => {
    if (curr.author in acc) {
      acc[curr.author]++
    } else {
      acc[curr.author] = 1
    }
    return acc
  }, {})

  const author = Object.keys(blogCount).reduce((a, b) =>
    blogCount[a] > blogCount[b] ? a : b
  )

  return { author, blogs: blogCount[author] }
}

// const mostLikes = (blogs) => {
//   likeCount = blogs.reduce((acc, curr) => {})
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
