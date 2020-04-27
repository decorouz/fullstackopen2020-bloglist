const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const useForToken = {
    username: user.username,
    id: user._id,
  }

  try {
    const token = jwt.sign(useForToken, process.env.SECRET)

    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch (exception) {
    next(exception)
  }
})

module.exports = loginRouter
