const { dummy, totalLikes } = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = [9, 'u', 4]

  const result = dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url:
        'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      title: 'I will love you forever lover letter Quotes and messages',
      author: 'Jenna Brandon',
      url: 'medium.com',
      likes: 39,
      id: '5e936384328349b3022f9d69',
    },
  ]

  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })
  test('when list has only one blog equals the of that', () => {
    expect(totalLikes(listWithOneBlog)).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    expect(totalLikes(listWithOneBlog)).toBe(44)
  })
})
