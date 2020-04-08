<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <!-- TODO: make axes flippable, data can be horizontal or vertical -->
    <legend>
      Indicators
      <b-button @click="addIndicator" class="legend-btn" variant="success" size="sm"><i class="dripicons-plus"></i></b-button>
    </legend>

    <div class="row">
      <div class="col-md-4" v-for="(indicator, index) in form.config.indicators">
        <b-form-group
          id="input-indicators-name"
          label="Indicator name"
          label-for="indicator-item-name"
          >
          <b-form-input
            id="indicator-item-name"
            v-model="form.config.indicators[index].name"
            required
            placeholder="Name of indicator, e.g. Scalability"
            >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="input-indicators-field-name"
          label="Indicator field name"
          label-for="indicator-field-name"
          >
          <b-form-input
            id="indicator-item-field-name"
            v-model="form.config.indicators[index].dataValueField"
            required
            placeholder="Field with indicator value e.g. scale"
            >
          </b-form-input>
        </b-form-group>
      </div>
    </div>

    <legend>
      Series
      <b-button @click="addSeries" class="legend-btn" variant="success" size="sm"><i class="dripicons-plus"></i></b-button>
    </legend>
    <div class="row">
      <div class="col-md-4" v-for="(graph, index) in form.config.series">
        <b-form-group
          id="input-series-name"
          label="Radar graph name"
          label-for="series-item-name"
          >
          <b-form-input
            id="series-item-name"
            v-model="form.config.series[index].name"
            required
            placeholder="Title of graph within radar plot"
            >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-series-field-name"
          label="Radar graph id field"
          label-for="series-item-filter-field-name"
          >
          <b-form-input
            id="series-item-filter-field-name"
            v-model="form.config.series[index].dataFilterFieldName"
            required
            placeholder="Field with graph id e.g. name, category"
            >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-series-field-value"
          label="Radar graph id"
          label-for="series-item-filter-field-value"
          >
          <b-form-input
            id="series-item-filter-field-value"
            v-model="form.config.series[index].dataFilterFieldValue"
            required
            placeholder="Id value e.g. January, February, March"
            >
          </b-form-input>
        </b-form-group>
      </div>
    </div>

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

import VisualizationFramework from '@/../types/visualization-framework'

import { frameworkStore } from '@/store'

interface RadarChartEditInput {
  config: RadarChartConfig
}

@Component({})
export default class RadarChartEditForm extends Vue {
  @Prop() visualization!: VisualizationEntity

  show: boolean = false
  form: RadarChartEditInput = {
    config: {
      series: [
      ],
      indicators: [
      ]
    }
  }

  @Watch('form', { deep: true })
  onFormChanged(newVal: RadarChartEditInput) {
    this.updateForm(newVal)
  }

  updateForm(newVal: RadarChartEditInput) {
    this.$emit('update', newVal)
  }

  addSeries() {
    this.form.config.series.push({
      name: '',
      dataFilterFieldName: '',
      dataFilterFieldValue: ''
    })
  }

  addIndicator() {
    this.form.config.indicators.push({
      name: '',
      dataValueField: ''
    })
  }

  setForm() {
    this.form.config.series = this.visualization.config.series
    this.form.config.indicators = this.visualization.config.indicators
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
.legend-btn {
  margin-left: 10px;
}
</style>
