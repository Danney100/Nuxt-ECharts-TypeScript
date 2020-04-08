<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-type"
        label="Visualization type"
        label-for="visualization-create-type"
        >
        <v-select
          id="visualization-create-type"
          @input="setVisualizationType"
          v-model="selectedVisualizationType"
          :options="visualizationTypeSelectInputs">
          <template #search="{attributes, events}">
            <input
              class="vs__search"
              :required="!selectedVisualizationType || !selectedVisualizationType.value"
              v-bind="attributes"
              v-on="events"
              />
          </template>
        </v-select>
      </b-form-group>

      <b-form-group
        id="input-group-data-source"
        label="Data source"
        label-for="visualization-create-data-source"
        >
        <v-select
          id="visualization-create-data-source"
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
        id="input-group-id"
        label="Id:"
        label-for="visualization-create-id"
        >
        <b-form-input
          id="visualization-create-id"
          v-model="form.id"
          type="text"
          required
          placeholder="Enter id e.g. metric-scatter-plot"
          ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-title"
        label="Title:"
        label-for="visualization-create-title"
        >
        <b-form-input
          id="visualization-create-title"
          v-model="form.title"
          required
          placeholder="Enter visualization title"
          ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-description"
        label="Description:"
        label-for="visualization-create-description">
        <b-form-input
          id="visualization-create-description"
          v-model="form.description"
          placeholder="Enter description"
          ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Create</b-button>
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

import { DashboardComponentType, DataSourceEntity } from '@/../types/framework'
import { VisualizationType, visualizationTypeLabels, VisualizationEntity } from '@/../types/visualization-framework'

import CodeCard from '@/components/framework/CodeCard.vue'

import { frameworkStore } from '@/store'

interface VisualizationCreateInput {
  componentType: DashboardComponentType,
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

@Component({
  components: {
    CodeCard
  }
})
export default class VisualizationCreateForm extends Vue {
  show: boolean = true
  form: VisualizationCreateInput = {
    componentType: DashboardComponentType.Visualization,
    type: "",
    dataSource: {}
  }
  @Prop() submit!: Function

  @Prop() visualizationType!: VisualizationType
  @Watch('visualizationType')
  onVisualizationTypeChanged(newVal: VisualizationType) {
    this.updateVisualizationType(newVal)
  }

  visualizationTypeSelectInputs: Array<VisualizationTypeSelectInput> = Object.values(VisualizationType).map((value: VisualizationType) => {
    return {
      label: visualizationTypeLabels[value],
      value
    }
  })
  visualizationDataSourceSelectInputs: Array<VisualizationDataSourceSelectInput> = []

  selectedVisualizationType: VisualizationTypeSelectInput = { label: '', value: '' }
  selectedDataSource: VisualizationDataSourceSelectInput = { label: '', value: null }

  setVisualizationType(fieldInput?: VisualizationTypeSelectInput) {
    if (fieldInput) {
      this.form.type = fieldInput.value
      this.$router.replace({ query: { type: fieldInput.value } })
    }
  }

  updateVisualizationType(newVal: VisualizationType) {
    this.selectedVisualizationType = this.visualizationTypeSelectInputs.find(t => t.value === newVal)
    this.setVisualizationType(this.selectedVisualizationType)
  }

  setDataSource(fieldInput?: VisualizationDataSourceSelectInput) {
    if (fieldInput) {
      this.form.dataSource = fieldInput.value
    }
  }

  onSubmit(e) {
    e.preventDefault()
    this.submit(this.form as VisualizationEntity)
  }

  onReset() {
  }

  async mounted() {
    await frameworkStore.dataSource.fetchAll()
    // TODO don't fake this
    // const dataSource: DataSourceEntity = { type: DataSourceType.Csv, name: 'Auction Sales 2019/09/03', id: 'auction-2019-09-03', publishId: 'a7382-ck8v7083-92ajy9' }
    this.visualizationDataSourceSelectInputs = frameworkStore.dataSource.dataSources.map(source => {
      return {
        label: source.name,
        value: pick(source, ['id', 'type'])
      }
    })

    if (this.visualizationType) {
      this.updateVisualizationType(this.visualizationType)
    }
  }
}


</script>
