<template>
  <div>
    <h3 v-if="!isLoading">{{ title }}</h3>

    <div v-if="!isLoading">
      <paradigm-table
        :table="editedTable"
        />
    </div>

    <b-tabs v-if="!isLoading" content-class="mt-3" justified>
      <b-tab title="General info" active>
        <table-general-edit-form
          :table="editedTable"
          @submit="onSubmit"
          @update="onUpdate"
          />
      </b-tab>
      <b-tab title="Table configuration">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <legend>
            Columns
            <b-button @click="addColumn" class="legend-btn" variant="success" size="sm"><i class="dripicons-plus"></i></b-button>
          </legend>
          <div class="row">
            <div class="col-md-4" v-for="(column, index) in form.columns">
              <b-form-group
                id="input-columns-label"
                label="Column label"
                label-for="column-item-label"
                >
                <b-form-input
                  id="column-item-label"
                  v-model="column.label"
                  required
                  placeholder="Label of column, e.g. Scalability"
                  >
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="input-columns-field-name"
                label="Column field name"
                label-for="column-field-name"
                >
                <b-form-input
                  id="column-item-field-name"
                  v-model="column.field"
                  required
                  placeholder="Field with column value e.g. scale"
                  >
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="input-group-table-chart-col-type"
                label="Type"
                label-for="table-chart-col-type"
                >
                <v-select
                  id="table-chart-col-type"
                  v-model="column.type"
                  :options="tableTypeOptions">
                  <template #search="{attributes, events}">
                    <input
                      class="vs__search"
                      v-bind="attributes"
                      v-on="events"
                      />
                  </template>
                </v-select>
              </b-form-group>
            </div>
          </div>
        </b-form>
      </b-tab>
    </b-tabs>

    <b-button @click="onSubmit" type="submit" variant="primary">Save</b-button>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash'
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import { DataSourceType, DataSourceEntity, TableEntity } from '@/../types/framework'
import ParadigmTable from '@/components/app/Table/ParadigmTable'
import TableGeneralEditForm from '@/components/app/Table/crud/TableGeneralEditForm'

import { frameworkStore } from '@/store'


interface TableGeneralEditInput {
  id: string
  title: string
  description: string
  dataSource: any
}

interface TableInput {
  columns: Array<TableColumn>
}

@Component({
  components: {
    ParadigmTable,
    TableGeneralEditForm
  }
})
export default class TableEditor extends Vue {
  mode: 'create' | 'edit' = 'edit'

  get title() {
    // if (this.mode === 'create') {
    //   return 'Creating Table'
    // }
    if (this.mode === 'edit') {
      return 'Editing Table'
    }
  }

  @Prop() table!: TableEntity
  editedTable?: TableEntity = null

  form: TableInput = {
    columns: []
  }
  isLoading: boolean = true
  show: boolean = true

  tableTypeOptions: Array<string> = ['text', 'decimal', 'percentage', 'boolean', 'date']

  addColumn() {
    this.form.columns.push({
      label: '',
      field: '',
      type: 'text'
    })
  }

  onUpdate(newVal: TableGeneralEditInput) {
    this.editedTable = cloneDeep({ ...this.table, ...this.form, ...newVal })
  }

  onSubmit() {
    frameworkStore.dashboardComponent.table.update({ table: this.editedTable })
  }

  @Watch('form', { deep: true })
  onFormChanged(newVal: TableCreateInput) {
    this.editedTable = cloneDeep({ ...this.table, ...newVal })
  }

  onReset() {
  }

  setForm() {
    this.form.columns = this.editedTable.columns
  }

  async mounted() {
    // if (!this.table.id.length) {
    //   this.mode = 'create'
    // }
    // else {
    this.mode = 'edit'
    // }
    await frameworkStore.dataSource.fetchAll()
    this.editedTable = cloneDeep({ ...this.form, ...this.table })
    this.setForm()
    this.isLoading = false
  }
}


</script>
