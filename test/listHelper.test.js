const { dummy } = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = [9, 'u', 4]

  const result = dummy(blogs)
  expect(result).toBe(1)
})
