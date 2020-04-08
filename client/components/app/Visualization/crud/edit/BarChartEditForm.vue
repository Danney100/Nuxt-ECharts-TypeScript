<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <!-- TODO: make axes flippable, data can be horizontal or vertical -->
    <legend>X-axis</legend>
    <b-form-group
      id="input-x-group-name"
      label="Name:"
      label-for="bar-chart-x-edit-name"
      >
      <b-form-input
        id="bar-chart-x-edit-name"
        v-model="form.config.xAxis.name"
        required
        placeholder="Enter X-axis name"
        >
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="input-x-group-data-label-field"
      label="Data point label:"
      label-for="bar-chart-x-edit-data-label-field"
      >
      <b-form-input
        id="bar-chart-x-edit-data-label-field"
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
      label-for="bar-chart-y-edit-name"
      >
      <b-form-input
        id="bar-chart-y-edit-name"
        v-model="form.config.yAxis.name"
        required
        placeholder="Enter Y-axis name"
        >
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="input-y-group-data-value-field"
      label="Data field:"
      label-for="bar-chart-y-edit-data-value-field"
      >
      <b-form-input
        id="bar-chart-y-edit-data-value-field"
        v-model="form.config.yAxis.dataValueField"
        required
        placeholder="Enter name of field to plot"
        >
      </b-form-input>
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

import { VisualizationEntity, BarChartConfig } from '@/../types/visualization-framework'

import { frameworkStore } from '@/store'

interface BarChartEditInput {
  config: BarChartConfig
}

@Component({})
export default class BarChartEditForm extends Vue {
  @Prop() visualization!: VisualizationEntity

  show: boolean = false
  form: BarChartEditInput = {
    config: {
      xAxis: {
        name: '',
        dataLabelField: ''
      },
      yAxis: {
        name: '',
        dataValueField: ''
      }
    }
  }

  @Watch('form', { deep: true })
  onFormChanged(newVal: BarChartEditInput) {
    this.updateForm(newVal)
  }

  updateForm(newVal: BarChartEditInput) {
    this.$emit('update', newVal)
  }

  setForm() {
    this.form.config.xAxis = this.visualization.config.xAxis
    this.form.config.yAxis = this.visualization.config.yAxis
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
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.code-card {
  margin-bottom: 20px;
}
</style>
