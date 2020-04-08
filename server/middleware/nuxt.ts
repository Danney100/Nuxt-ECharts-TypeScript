// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
import nuxtConfig from '../../nuxt.config'

const nuxt = new Nuxt(nuxtConfig)

if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

export default nuxt
