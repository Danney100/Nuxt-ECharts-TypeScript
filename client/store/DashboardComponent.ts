import axios from 'axios'

import { Module, VuexModule, Action, MutationAction } from 'vuex-module-decorators'

import VisualizationModule from './visualization'
import TableModule from './Table'

import { getHits } from '@/utils/elastic'
import { DashboardComponentEntity } from '@/../types/framework' // DashboardComponentType
// import { VisualizationType } from '@/../types/visualization-framework'

@Module({
  name: 'DashboardComponent',
  namespaced: true,
  stateFactory: true
})
export default class DashboardComponentModule extends VuexModule {
  visualization?: VisualizationModule
  table?: TableModule

  dashboardComponents: Array<DashboardComponentEntity> = []

  @MutationAction({ mutate: ['dashboardComponents'] })
  async fetchAll() {
    const result = await axios.post('_all/_search?size=1000', {
      query: {
        'bool': {
          filter: [
            {
              terms: {
                _index: [
                  'visualizations',
                  'tables',
                  // ... other component type indices here
                ]
              },
            },
            { term: { 'owner.keyword': 'kennethmalac@paradigminteractive.io' } }
          ]
        }
      }
    })

    return { dashboardComponents: getHits(result) }
  }

  // No Create, Retrieve, Update because each Component type has their own create() and Store

  @Action
  async retrieve(_id: string) {
    // console.log(_id)
    //return getHits(await axios.get(`components/_doc/${_id}`))
  }
}
