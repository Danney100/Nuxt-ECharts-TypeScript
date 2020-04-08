import { ActionTree, Store } from 'vuex'
import { initialiseStores, frameworkStore } from '~/utils/store-accessor'

import { RootState } from './types'

import axios from 'axios';
export const baseURL = "https://search-paradigminteractive-prod-43bfa62x5fgxtq76omnfim45ze.us-west-1.es.amazonaws.com/"// "https://search-paradigminteractive-unsecure-u7cpy2akuu5of3ffvgibmfhhlu.us-east-2.es.amazonaws.com/"
axios.defaults.baseURL = baseURL

export const actions: ActionTree<RootState, RootState> = {
  // TODO make universal app
  async nuxtServerInit(_context: any, server: { req: any; app: any }) {
    // console.log('calling nuxtServerInit')
    // console.log(_context)
    // console.log(server.req)
    // console.log(frameworkStore)
    //await frameworkStore.(server)
  }
}
const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]
export * from '~/utils/store-accessor'
