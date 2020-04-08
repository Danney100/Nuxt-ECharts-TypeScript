import axios from 'axios'
import { pick } from 'lodash'

import { Module, VuexModule, Action, MutationAction } from 'vuex-module-decorators'

import { getHits } from '@/utils/elastic'
import { DataSourceEntity } from '@/../types/framework'
import { ValueDimension } from '@/../types/visualization-framework'

// const getUTCDate = (date = new Date()) => {
//   return new Date(date.getTime() + date.getTimezoneOffset()*60*1000)
// }

@Module({
  name: 'DataSource',
  namespaced: true,
  stateFactory: true
})
export default class DataSourceModule extends VuexModule {
  dataSources: Array<DataSourceEntity> = []

  @MutationAction({ mutate: ['dataSources'] })
  async fetchAll() {
    const search: any = {
      _source: { include: ['*'], exclude: ['data'] },
      query: {
        "bool": {
          filter: [
            { term: { 'owner.keyword': 'kennethmalac@paradigminteractive.io' } }
          ]
        }
      }
    }

    // TODO don't fake this
    // const dataSource: DataSourceEntity = { type: DataSourceType.Csv, name: 'Auction Sales 2019/09/03', id: 'auction-2019-09-03', publishId: 'a7382-ck8v7083-92ajy9' }

    const result = await axios.post('data-sources/_search', search)

    return {
      dataSources: getHits(result).map((h: any) => {
        return { ...h, data: [] } as DataSourceEntity
      })
    }
  }

  @Action
  async retrieve(config: {id: string, needsData: boolean}) {
    const needsData = config.needsData || false
    const { id } : {id: string} = config
    const search: any = {
      query: {
        "bool": {
          filter: [
            { term: { 'owner.keyword': 'kennethmalac@paradigminteractive.io' } },
            { term: { 'id.keyword': id } },
          ]
        }
      }
    }
    if (!needsData) {
      // Don't return dataset
      search._source = { exclude: ['data'] }
    }

    const result = await axios.post('data-sources/_search', search)
    const hits = getHits(result)
    const hit = hits.length ? hits[0] : {}
    if (!needsData) {
      hit.data = []
    }

    return hit as DataSourceEntity
  }

  @Action
  async searchDimension({ dataSource, seriesIds, params, start, end, max }: { dataSource: DataSourceEntity, seriesIds: Array<string>, params: Array<Array<ValueDimension>>, start: Date, end: Date, max: number }) {
    const date = '01-2020'
    const indexName = `${dataSource.id}_events_${date}`

    const interval = ((end.getTime()/1000) - (start.getTime()/1000)) / max
    // console.log('interval: ', interval)

    const search: any = {
      "aggs" : {
        "buckets" : {
          "filter" : {
            "range": { "datetime": { "gte": start, "lte": end } }
          },
          "aggs": {
          }
        }
      }
    }

    let s = 0
    for (const seriesId of seriesIds) {
      const terms = !params[s] || params[s].length === 0 ? [{ "term": { "seriesId.keyword": seriesId } }] : params[s].map(p => { return { "term": { [`${p.dataFieldName}.keyword`]: p.dataFieldValue } } })

      // Add aggregration for each series Id
      search.aggs.buckets.aggs[seriesId] = {
        "filter": {
          "bool": {
            "must": [
              ...terms
            ]
          }
        },
        "aggs": {
          "histogram": {
            "date_histogram" : {
              "field" : "datetime",
              "interval" : `${Math.floor(interval)}s`
            }
          }
        }
      }
      s++
    }

    const result = await axios.post(`${indexName}/_search?size=0`, search)

    //console.log(result.data.aggregations, seriesIds)

    const histograms: any = {}
    histograms.doc_count = result.data.aggregations.buckets.doc_count
    for (const [seriesId, series] of Object.entries(pick(result.data.aggregations.buckets, seriesIds))) {
      //console.log(seriesId)
      histograms[seriesId] = series.histogram.buckets.map((bucket: any) => {
        return { count: bucket.doc_count, start: bucket.key }
      })
      histograms[`${seriesId}_doc_count`] = series.doc_count
    }
    return histograms
  }
  
  @Action
  async histogram({ dataSource, seriesIds, max, start, end }: { dataSource: DataSourceEntity, seriesIds: Array<string>, max: number, start: Date, end: Date }) {

    // const date = '01-2020'
    // const indexName = `${dataSource.id}_events_${date}`
    // console.log(dataSource.id)

    const interval = ((end.getTime()/1000) - (start.getTime()/1000)) / max
    //console.log('interval: ', interval)

    const search: any = {
      "searchName": "metaballsNestedHistogramAggregation",
      "searchType": "nestedAggregation",
      "documentType": "cluster-events",
      "start": start,
      "end": end,
      "aggList": seriesIds,
      "interval": `${Math.floor(interval)}s`
    }
    
    axios.defaults.baseURL = "http://ec2-52-53-223-106.us-west-1.compute.amazonaws.com/"
    const result = await axios.post(`query`, search)
    axios.defaults.baseURL = "https://search-paradigminteractive-prod-43bfa62x5fgxtq76omnfim45ze.us-west-1.es.amazonaws.com/"

    //console.log(result.data.aggregations, seriesIds)

    const histograms: any = {}
    histograms.doc_count = result.data.aggregations.metaballs.doc_count
    for (const [seriesId, series] of Object.entries(pick(result.data.aggregations.metaballs, seriesIds))) {
      //console.log(seriesId)
      histograms[seriesId] = series.histogram.buckets.map((bucket: any) => {
        return { count: bucket.doc_count, start: bucket.key }
      })
      histograms[`${seriesId}_doc_count`] = series.doc_count
    }
    return histograms
  }
}
