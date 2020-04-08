import { logger } from 'express-winston'
import { format, transports } from 'winston'

export default logger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple(),
  ),
  transports: [
    new transports.Console()
  ]
})
