<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <b-form-group
      id="input-group-id"
      label="Id:"
      label-for="general-id"
      >
      <b-form-input
        id="general-id"
        v-model="form.id"
        type="text"
        disabled
        ></b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-data-source"
      label="Data source"
      label-for="general-data-source"
      >
      <v-select
        id="general-data-source"
        @input="setDataSource"
        v-model="selectedDataSource"
        :options="visualizationDataSourceSelectInputs">
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
      id="input-group-title"
      label="Title:"
      label-for="general-title"
      >
      <b-form-input
        id="general-title"
        v-model="form.title"
        required
        placeholder="Enter visualization title"
        >
      </b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-description"
      label="Description:"
      label-for="general-description">
      <b-form-input
        id="general-description"
        v-model="form.description"
        placeholder="Enter description"
        ></b-form-input>
    </b-form-group>
    <b-card class="mt-3 code-card" no-body>
      <b-card-header header-tag="div" role="tab" v-b-toggle.code-accordion>
        <span class="dripicons-plus when-closed" style="color: grey;"></span>
        <span class="dripicons-minus when-opened" style="color: grey;"></span>
        Result
      </b-card-header>

      <b-collapse id="code-accordion" accordion="my-accordion" role="tabpanel">
        <code class="pretty-code m-0">{{ form }}</code>
      </b-collapse>
    </b-card>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import debounce from 'debounce'

import { DataSourceType, DataSourceEntity } from '@/../types/framework'
import { visualizationTypeLabels } from '@/../types/visualization-framework'

import { frameworkStore } from '@/store'

interface VisualizationGeneralEditInput {
  type: string
  dataSource: any
}

type VisualizationTypeSelectInput = {
  label: string
  value: string
}

type VisualizationDataSourceSelectInput = {
  label: string
  value: DataSourceEntity
}

@Component({})
export default class VisualizationGeneralEditForm extends Vue {
  @Prop() visualization!: VisualizationEntity

  show: boolean = true
  form: VisualizationGeneralEditInput = {
    id: '',
    type: '',
    title: '',
    description: '',
    dataSource: {}
  }
  visualizationTypeLabels = visualizationTypeLabels

  visualizationDataSourceSelectInputs: Array<VisualizationDataSourceSelectInput> = []

  selectedDataSource!: VisualizationDataSourceSelectInput = { label: '', value: null }

  @Watch('form', { deep: true })
  onFormChanged(newVal: VisualizationGeneralEditInput) {
    this.updateForm(newVal)
  }

  updateForm(newVal: VisualizationGeneralEditInput) {
    this.$emit('update', newVal)
  }

  setForm() {
    // General
    this.form.id = this.visualization.id
    this.form.type = this.visualization.type
    this.selectedDataSource = this.visualizationDataSourceSelectInputs.find(input => input.value.id === this.visualization.dataSource.id)
    this.form.dataSource = this.visualization.dataSource
    this.form.title = this.visualization.title
    this.form.description = this.visualization.description
  }

  setDataSource(fieldInput?: VisualizationDataSourceSelectInput) {
    if (fieldInput) {
      this.form.dataSource = fieldInput.value
    }
  }

  onSubmit() {
  }

  onReset() {
  }

  async mounted() {
    this.updateForm = debounce(this.updateForm, 1000)

    await frameworkStore.dataSource.fetchAll()
    this.visualizationDataSourceSelectInputs = frameworkStore.dataSource.dataSources.map(source => {
      return {
        label: source.name,
        value: source
      }
    })

    this.setForm()
  }
}
</script>

<style lang="scss" scoped>
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.code-card {
  margin-bottom: 20px;
}
</style>
