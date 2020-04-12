const http = require('http')
const app = require('./app')
const { PORT } = require('./util/config')
const logger = require('./util/logger')

const server = http.createServer(app)

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
