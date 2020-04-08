import { omit } from 'lodash'
import axios from 'axios'

import { Module, VuexModule, Action } from 'vuex-module-decorators'
// import { ModuleTree } from 'vuex'

import { DashboardComponentEntity, TableEntity, DataSourceEntity } from '@/../types/framework'

import { getHits } from '@/utils/elastic'

@Module({
  name: 'Table',
  namespaced: true,
  stateFactory: true
})
export default class TableModule extends VuexModule {
  // Needs nested modules
  // public static modules?: ModuleTree<any> = {
  // }

  @Action
  async create(dashboardComponent: DashboardComponentEntity) {
    try {
      const resp = await axios.post('tables/_doc/', {
        ...dashboardComponent,
        owner: "kennethmalac@paradigminteractive.io"
      })

      return resp
    }
    catch (exception) {
      let error = "ERROR: a Table creation was attempted. Details:"
      // console.log(error)
      // console.log(exception.message)

      return null
    }
  }

  @Action
  async retrieve(id: string) {
    const result = await axios.post('tables/_search', {
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
    return hits.length ? hits[0] as TableEntity : null
    // return getHits(await axios.post(`tables/_doc/${_id}`))
  }

  @Action
  async update({ table } : { table: TableEntity }) {
    return axios.post(`tables/_doc/${table._id}`, {
      ...omit(table, ['_id'])
    })
  }

  @Action
  async getTotalPages({ table, perPage }: { table: TableEntity, perPage: number }) {
    const date = '01-2020'
    const indexName = `${(table.dataSource as DataSourceEntity).id}_events_${date}`

    const result = await axios.get(`${indexName}/_count`)
    return Math.floor(result.data.count / perPage)
  }

  @Action
  async getResults({ table, page, perPage }: { table: TableEntity, page: number, perPage: number }) {
    const date = '01-2020'
    const indexName = `${(table.dataSource as DataSourceEntity).id}_events_${date}`

    const search = {
      "from" : perPage * page, "size" : perPage,
      "query" : {
        "match_all": {
        }
      }
    }
    const result = await axios.post(`${indexName}/_search`, search)
    return getHits(result)
  }
}
