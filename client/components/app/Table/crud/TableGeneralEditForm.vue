<template>
  <div>
    <b-form @reset="onReset" v-if="show">
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
          :disabled="true"
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
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import debounce from 'debounce'

import { DashboardComponentType, DataSourceType, DataSourceEntity } from '@/../types/framework'
import CodeCard from '@/components/framework/CodeCard'

import { frameworkStore } from '@/store'

interface TableGeneralEditInput {
  componentType: DashboardComponentType
  id: string
  title: string
  description: string
  dataSource: any
}

type TableDataSourceSelectInput = {
  label: string
  value: DataSourceEntity
}

@Component({
  components: {
    CodeCard
  }
})
export default class TableGeneralEditForm extends Vue {
  @Prop() table!: TableEntity

  show: boolean = true
  form: TableGeneralEditInput = {
    componentType: DashboardComponentType.Table,
    id: '',
    title: '',
    description: '',
    dataSource: {}
  }

  dataSourceSelectInputs: Array<TableDataSourceSelectInput> = []

  selectedDataSource!: TableDataSourceSelectInput = { label: '', value: null }

  @Watch('form', { deep: true })
  onFormChanged(newVal: TableGeneralEditInput) {
    this.updateForm(newVal)
  }

  updateForm(newVal: TableGeneralEditInput) {
    this.$emit('update', newVal)
  }

  setForm() {
    // General
    this.form.id = this.table.id
    this.form.title = this.table.title
    this.form.description = this.table.title
    // console.log('this.dataSourceSelectInputs', this.dataSourceSelectInputs)
    this.form.dataSource = this.table.dataSource
    this.selectedDataSource = this.dataSourceSelectInputs.find(input => input.value.id === this.table.dataSource.id)
  }

  setDataSource(fieldInput?: TableDataSourceSelectInput) {
    if (fieldInput) {
      this.form.dataSource = fieldInput.value
    }
  }

  onReset() {
  }

  async mounted() {
    this.updateForm = debounce(this.updateForm, 1000)

    await frameworkStore.dataSource.fetchAll()
    this.dataSourceSelectInputs = frameworkStore.dataSource.dataSources.map(source => {
      return {
        label: source.name,
        value: pick(source, ['id', 'type'])
      }
    })

    this.setForm()
  }
}
</script>
