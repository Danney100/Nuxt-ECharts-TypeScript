<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-data-source"
        label="Data source"
        label-for="table-create-data-source"
        >
        <v-select
          id="table-create-data-source"
          @input="setDataSource"
          v-model="selectedDataSource"
          :options="dataSourceSelectInputs">
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!selectedDataSource || !selectedDataSource.value"
              v-bind="attributes"
              v-on="events"
              />
          </template>
        </v-select>
      </b-form-group>

      <b-form-group
        id="input-group-id"
        label="Id:"
        label-for="table-create-id"
        >
        <b-form-input
          id="table-create-id"
          v-model="form.id"
          type="text"
          required
          :disabled="mode === 'edit'"
          placeholder="Enter id e.g. metrics-table"
          ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-title"
        label="Title:"
        label-for="table-create-title"
        >
        <b-form-input
          id="table-create-title"
          v-model="form.title"
          required
          placeholder="Enter table title"
          ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-description"
        label="Description:"
        label-for="table-create-description">
        <b-form-input
          id="table-create-description"
          v-model="form.description"
          placeholder="Enter description"
          ></b-form-input>
      </b-form-group>
    </b-form>

    <code-card
      title="Result"
      :text="form"
      >
    </code-card>
  </div>
</template>

<script lang="ts">
import { pick } from 'lodash'
import { Component, Vue, Watch, Emit } from 'nuxt-property-decorator' // , Watch

import { DashboardComponentType, DataSourceType, DataSourceEntity, TableEntity } from '@/../types/framework'

import CodeCard from '@/components/framework/CodeCard'

import { frameworkStore } from '@/store'

interface TableCreateInput {
  componentType: DashboardComponentType
  dataSource: any
  columns: Array<TableColumn>
}

type DataSourceSelectInput = {
  label: string
  value: DataSourceEntity
}

@Component({
  components: {
    CodeCard
  }
})
export default class TableCreateForm extends Vue {
  show: boolean = true
  form: TableCreateInput = {
    componentType: DashboardComponentType.Table,
    type: "",
    dataSource: {}
  }

  dataSourceSelectInputs: Array<DataSourceSelectInput> = []

  selectedDataSource!: TableDataSourceSelectInput = { label: '', value: null }

  setDataSource(fieldInput?: TableDataSourceSelectInput) {
    if (fieldInput) {
      this.form.dataSource = fieldInput.value
    }
  }

  @Emit('submit')
  onSubmit(e) {
    e.preventDefault()
    return (this.form as TableEntity)
  }

  onReset() {
  }

  async mounted() {
    await frameworkStore.dataSource.fetchAll()
    // TODO don't fake this
    // const dataSource: DataSourceEntity = { type: DataSourceType.Csv, name: 'Auction Sales 2019/09/03', id: 'auction-2019-09-03', publishId: 'a7382-ck8v7083-92ajy9' }
    this.dataSourceSelectInputs = frameworkStore.dataSource.dataSources.map(source => {
      return {
        label: source.name,
        value: pick(source, ['id', 'type'])
      }
    })
  }
}


</script>
