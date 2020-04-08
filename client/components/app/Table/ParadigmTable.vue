<template>
  <div>
    <!--<div v-if="search"></div>-->
    <vue-good-table
      :mode="tableMode"
      :columns="columns"
      :rows="rows"
      :totalRows="rowCount"
      :max-height="height"
      @on-page-change="onPageChange"
      @on-per-page-change="onPerPageChange"
      :pagination-options="paginationOptions"
      />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import { DataSourceType, DataSourceEntity } from '@/../types/framework'

import { frameworkStore } from '@/store'

interface ServerParams {
  page: number
  perPage: number
}

@Component({})
export default class ParadigmTable extends Vue {
  @Prop() table!: TableEntity
  @Watch('table', { deep: true })
  onTableChanged() {
    this.loadConfig()
  }

  // TODO : fix height so that column titles not part of y scroll
  @Prop() height!: string

  serverParams: any = {
    page: 0,
    perPage: 10
  }
  paginationOptions: any = {
    enabled: true,
    position: 'top',
    mode: 'pages',
    perPageDropdown: [10, 20, 30, 40, 50, 100],
    dropdownAllowAll: false
  }

  rows: Array<any> = []
  rowCount: number = 0
  get columns() {
    return this.table.columns.map(c => {
      if (c.type === 'date') {
        return {
          ...c,
          dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
          dateOutputFormat: 'hh:mmaaa MMM Do yyyy' // outputs Mar 16th 2018
        }
      }
      return c
    })
  }

  get tableMode() {
    // Server-side pagination etc. for elasticsearch datasets
    return this.table.dataSource.type === DataSourceType.Elasticsearch ? 'remote' : 'local'
  }

  updateParams(newProps) {
    this.serverParams = Object.assign({}, this.serverParams, newProps)
  }

  async onPageChange(params) {
    // console.log('onPageChange')
    this.updateParams({ page: params.currentPage })
    await this.loadItems()
  }

  async onPerPageChange(params) {
    this.updateParams({ perPage: params.currentPerPage })
    await this.loadItems()
  }

  async loadItems() {
    this.rowCount = await frameworkStore.dashboardComponent.table.getTotalPages({ table: this.table, perPage: this.serverParams.perPage })
    this.rows = await frameworkStore.dashboardComponent.table.getResults({
      table: this.table,
      page: this.serverParams.page,
      perPage: this.serverParams.perPage
    })
  }

  async loadConfig() {
    if (this.table.dataSource.type === DataSourceType.Elasticsearch) {
      await this.loadItems()
    }
    else {
      this.rows = [
        { id:1, name:"John", age: 20, createdAt: '', score: 0.03343 },
        { id:2, name:"Jane", age: 24, createdAt: '2011-10-31', score: 0.03343 },
        { id:3, name:"Susan", age: 16, createdAt: '2011-10-30', score: 0.03343 },
        { id:4, name:"Chris", age: 55, createdAt: '2011-10-11', score: 0.03343 },
        { id:5, name:"Dan", age: 40, createdAt: '2011-10-21', score: 0.03343 },
        { id:6, name:"John", age: 20, createdAt: '2011-10-31', score: 0.03343 },
      ]
    }
  }

  async mounted() {
    await this.loadConfig()
  }
}
</script>

<style lang="scss">
  .vgt-table tbody {
    overflow-y: scroll;
  }
</style>
