import { omit } from 'lodash'
import axios from 'axios'

import { Module, VuexModule, Action } from 'vuex-module-decorators'
// import { ModuleTree } from 'vuex'

import { DashboardComponentEntity } from '@/../types/framework'
import { VisualizationEntity } from '@/../types/visualization-framework'
import VisualizationFactory from './factory'

import { getHits } from '@/utils/elastic'

@Module({
  name: 'visualization',
  namespaced: true,
  stateFactory: true
})
export default class VisualizationModule extends VuexModule {
  // Needs nested modules
  // public static modules?: ModuleTree<any> = {
  //   dashboard: DashboardModule
  // }
  visualizationFactory: VisualizationFactory = new VisualizationFactory()

  @Action
  async create(dashboardComponent: DashboardComponentEntity) {
    try {
      const vis = this.visualizationFactory.create(dashboardComponent)

      const resp = await axios.post('visualizations/_doc/', {
        ...vis,
        owner: "kennethmalac@paradigminteractive.io"
      })

      return resp
    }
    catch (exception) {
      let error = "ERROR: a Visualization creation was attempted. Details:"
      if (exception instanceof TypeError) {
        error = `${error} DashboardComponent type mismatch`
      }
      // console.log(error)
      // console.log(exception.message)

      return null
    }
  }

  @Action
  async retrieve(id: string) {
    const result = await axios.post('visualizations/_search', {
      query: {
        "bool": {
          filter: [
            { term: { 'id.keyword': id } },
            { term: { 'owner.keyword': 'kennethmalac@paradigminteractive.io' } }
          ]
        }
      }
    })

    const hits = getHits(result)
    return hits.length ? hits[0] as VisualizationEntity : null
    // return getHits(await axios.post(`visualizations/_doc/${_id}`))
  }

  @Action
  async update({ visualization } : { visualization: VisualizationEntity }) {
    return axios.post(`visualizations/_doc/${visualization._id}`, {
      ...omit(visualization, ['_id'])
    })
  }
}
