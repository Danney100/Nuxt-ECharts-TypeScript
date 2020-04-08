// Framework
import express from 'express'
// import socketio from 'socket.io'

// Plugins
import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import logger from './logger'

// App
import applyMiddleware from './middleware/index'

const app = express()

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(logger)

//Configure App middleware
applyMiddleware(app)

// others
app.use(express.json())



export default app
