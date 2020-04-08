import { Express } from 'express'
import nuxt from './nuxt'
const { render } = nuxt
const isTestEnv = process.env.NODE_ENV === 'test';

export default function(app: Express) {
  app.use((req, res, next) => {
    const accepts = req.accepts('html', 'json')

    if (accepts === 'json') {
      return next()
    }
    if (!isTestEnv) {
      render(req, res)
    }
  })
}
