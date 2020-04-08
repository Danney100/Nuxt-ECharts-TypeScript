const webpack = require("webpack");
const { resolve } = require("path");
const packageInfo = require("./package.json");

// TODO dynamic server-side render for enterprise dedicated UI servers
// See: https://css-tricks.com/creating-dynamic-routes-in-a-nuxt-application/
// Adding a new page would have to restart the dashboard UI server to re-generate pages
// import axios from 'axios'
// let dynamicPageRoutes 


import adminRouteMeta from "./client/config/admin/route-meta"

export default {
  dev: process.env.NODE_ENV !== "production",
  build: {
    cssSourceMap: true,
    parallel: false, // weird bug that makes CSS loader stop working, experimental
    cache: true,
    hardSource: false,
    optimizeCss: true,
    extractCSS: false,
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ],
    extend (config: any, { isClient } : { isClient: boolean }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = '#source-map'
      }
    }
  },
  buildModules: ['@nuxt/typescript-build'],
  mode: "spa",
  srcDir: resolve(__dirname, "./client"),
  env: {
    apiURL: process.env.API_URL || "http://localhost:3031"
  },
  head: {
    title: `${packageInfo.name} — ${packageInfo.description}`,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    link: [
      {
        rel: "stylesheet",
        href: "/font/typicons/typicons.min.css"
      },
      {
        rel: "stylesheet",
        href: "/font/fontawesome/css/all.css"
      },
      {
        rel: "stylesheet",
        href: "/font/weather-icons/css/weather-icons.min.css"
      },
      {
        rel: "stylesheet",
        href: "/font/line-awesome/css/line-awesome.min.css"
      },
      {
        rel: "stylesheet",
        href: "/font/linearicons/style.css"
      },
      {
        rel: "stylesheet",
        href: "/font/dripicons/webfont.css"
      }
    ]
  },
  css: ["normalize.css/normalize.css"],
  modules: ["bootstrap-vue/nuxt"],
  bootstrapVue: {
    bootstrapCSS: false, // or `css`
    bootstrapVueCSS: false // or `bvCSS`
  },
  plugins: [
    { src: "~/plugins/aos.ts", mode: 'client' },
    { src: "~/plugins/vue2-scrollspy.js", mode: 'client' },
    { src: "~/plugins/vue-truncate-filter.ts" },
    { src: "~/plugins/vue-echarts.ts", mode: 'client' },
    { src: "~/plugins/vue-filter-date-format.js" },
    { src: "~/plugins/vue-morris.js", mode: 'client' },
    { src: "~/plugins/vue-numeral-filter.js", mode: 'client' },
    { src: "~/plugins/vue-upload-multiple-image.js", mode: 'client' },
    { src: "~/plugins/vue-select.js", mode: 'client' },
    { src: "~/plugins/vue-tables.js", mode: 'client' },
    // { src: "~/plugins/vue-history-save/index.ts", mode: 'client' }
  ],
  vendor: [
    "jquery",
    "vue-upload-multiple-image",
    "vue-echarts"
  ],
  serverMiddleware: [resolve(__dirname, "./server")],
  router: {
    extendRoutes (routes: any) {
      for (const route of routes) {
      	// TODO if route contains admin/ or user/ select different route meta
        const meta = (adminRouteMeta as any)[route.path] ? (adminRouteMeta as any)[route.path] : {}
      	route.meta = meta
      }
      // console.log(adminRouteMeta)
      // console.log(routes)
    }
  }
}
