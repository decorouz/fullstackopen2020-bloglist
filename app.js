const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./util/config')

const app = express()
const blogRouter = require('./controllers/blogs')
const logger = require('./util/logger')

logger.info('Connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to MongoDB')
  })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app
