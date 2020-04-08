<template>
  <div>
    <table-editor
      v-if="table"
      :table="table"
      />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import DefaultPageMixin from '@/components/framework/DefaultPageMixin'


import { TableEntity, DataSourceType } from '@/../types/framework'
import { frameworkStore } from '@/store'
import TableEditor from '@/components/app/Table/TableEditor'

@Component({
  components: {
    TableEditor
  },
  layout: 'framework/admin'
})
export default class TablesPage extends mixins(DefaultPageMixin) {
  table?: TableEntity = null

  async mounted() {
    if (this.$route.query.id) {
      //
      this.table = await frameworkStore.dashboardComponent.table.retrieve(this.$route.query.id)
    }
    else {
      this.table = {
        id: '',
        dataSource: {
          type: DataSourceType.Json
        },
        columns: [
          {
            label: 'Name',
            field: 'name',
            type: 'text'
          },
          {
            label: 'Age',
            field: 'age',
            type: 'number',
          },
          {
            label: 'Created On',
            field: 'createdAt',
            type: 'date',
            dateInputFormat: 'yyyy-MM-dd',
            dateOutputFormat: 'MMM do yyyy',
          },
          {
            label: 'Percent',
            field: 'score',
            type: 'percentage',
          }
        ]
      } as TableEntity
    }
  }
}
</script>

<style lang="scss">
</style>
