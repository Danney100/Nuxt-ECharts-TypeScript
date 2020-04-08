<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <legend>
      Series
      <b-button @click="addSeries" class="legend-btn" variant="success" size="sm"><i class="dripicons-plus"></i></b-button>
    </legend>
    <div class="row">
      <div
        v-for="(graph, index) in form.config.series"
        :key="index"
        class="col-md-4"
      >
        <b-form-group
          id="input-series-name"
          label="Line graph name"
          label-for="series-item-name"
          >
          <b-form-input
            id="series-item-name"
            v-model="form.config.series[index].name"
            required
            placeholder="Title of graph within line plot"
            >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-series-field-name"
          label="Line graph id field"
          label-for="series-item-filter-field-name"
          >
          <b-form-input
            id="series-item-filter-field-name"
            v-model="form.config.series[index].dataFieldName"
            required
            placeholder="Field with graph id e.g. name, category"
            >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-series-field-value"
          label="Line graph id"
          label-for="series-item-filter-field-value"
          >
          <b-form-input
            id="series-item-filter-field-value"
            v-model="form.config.series[index].dataFieldValue"
            required
            placeholder="Id value e.g. January, February, March"
            >
          </b-form-input>
        </b-form-group>
      </div>
    </div>

    <legend>X-axis</legend>
    <b-form-group
      id="input-x-group-name"
      label="Name:"
      label-for="line-chart-x-edit-name"
      >
      <b-form-input
        id="line-chart-x-edit-name"
        v-model="form.config.xAxis.name"
        required
        placeholder="Enter X-axis name"
        >
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="input-x-group-data-label-field"
      label="Data point label:"
      label-for="line-chart-x-edit-data-label-field"
      >
      <b-form-input
        id="line-chart-x-edit-data-label-field"
        v-model="form.config.xAxis.dataLabelField"
        required
        placeholder="Enter name of field for data point label"
        >
      </b-form-input>
    </b-form-group>

    <legend>Y-axis</legend>
    <b-form-group
      id="input-y-group-name"
      label="Name:"
      label-for="line-chart-y-edit-name"
      >
      <b-form-input
        id="line-chart-y-edit-name"
        v-model="form.config.yAxis.name"
        required
        placeholder="Enter Y-axis name"
        >
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="input-y-group-data-value-field"
      label="Data field:"
      label-for="line-chart-y-edit-data-value-field"
      >
      <b-form-input
        id="line-chart-y-edit-data-value-field"
        v-model="form.config.yAxis.dataValueField"
        required
        placeholder="Enter name of field to plot"
        >
      </b-form-input>
    </b-form-group>

    <code-card
      title="Result"
      :text="form">
    </code-card>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import debounce from 'debounce'

import { LineChartConfig, VisualizationEntity } from '@/../types/visualization-framework'
import CodeCard from '@/components/framework/CodeCard.vue'

// import { frameworkStore } from '@/store'

interface LineChartEditInput {
  config: LineChartConfig
}

@Component({
  components: {
    CodeCard
  }
})
export default class LineChartEditForm extends Vue {
  @Prop() visualization!: VisualizationEntity

  show: boolean = false
  form: LineChartEditInput = {
    config: {
      xAxis: {
        name: '',
        dataLabelField: ''
      },
      yAxis: {
        name: '',
        dataValueField: ''
      },
      series: [
      ]
    }
  }

  @Watch('form', { deep: true })
  onFormChanged(newVal: LineChartEditInput) {
    this.updateForm(newVal)
  }

  updateForm(newVal: LineChartEditInput) {
    this.$emit('update', newVal)
  }

  addSeries() {
    this.form.config.series.push({
      name: '',
      dataFieldName: '',
      dataFieldValue: ''
    })
  }

  setForm() {
    this.form.config.xAxis = this.visualization.config.xAxis
    this.form.config.yAxis = this.visualization.config.yAxis
    this.form.config.series = this.visualization.config.series
    this.show = true
  }

  onSubmit() {
  }

  onReset() {
  }

  created() {
    this.updateForm = debounce(this.updateForm, 1000)
  }

  mounted() {
    this.setForm()
  }
}
</script>
<style lang="scss" scoped>
.legend-btn {
  margin-left: 10px;
}
</style>
