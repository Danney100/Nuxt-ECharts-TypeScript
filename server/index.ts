/* eslint-disable no-console */
import app from './app'

const server = app.listen(3031)

server.on('listening', () => {
  // console.log('listening!')
})
