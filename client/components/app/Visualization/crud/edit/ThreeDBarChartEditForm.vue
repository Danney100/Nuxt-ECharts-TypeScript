<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <!-- TODO: make axes flippable, data can be horizontal or vertical -->
    <legend>
      Dimensions
      <b-button @click="addDimension" class="legend-btn" variant="success" size="sm"><i class="dripicons-plus"></i></b-button>
    </legend>
    <div class="row">
      <div
        class="col-md-4"
        v-for="(dim, index) in form.config.dimensions"
        :key="index"  
      >
        <b-form-group
          id="input-three-d-bar-chart-dimension-name"
          label="Name:"
          label-for="three-d-bar-chart-dimension-name"
          >
          <b-form-input
            id="three-d-bar-chart-dimension-name"
            v-model="form.config.dimensions[index].displayName"
            required
            placeholder="Enter display name"
            >
          </b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-three-d-bar-chart-dimension-type"
          label="Type"
          label-for="three-d-bar-chart-dimension-type"
          >
          <v-select
            id="three-d-bar-chart-dimension-type"
            v-model="form.config.dimensions[index].type"
            placeholder="Optional, specify for ordered data"
            :options="dimensionTypeOptions">
            <template #search="{attributes, events}">
              <input
                class="vs__search"
                v-bind="attributes"
                v-on="events"
                />
            </template>
          </v-select>
        </b-form-group>

        <b-form-group
          id="input-group-three-d-bar-chart-dimension-data-value-field"
          label="Data field:"
          label-for="three-d-bar-chart-dimension-data-value-field"
          >
          <b-form-input
            id="three-d-bar-chart-dimension-data-value-field"
            v-model="form.config.dimensions[index].name"
            required
            placeholder="Enter name of field in dataset"
            >
          </b-form-input>
        </b-form-group>
      </div>
    </div>

    <legend>Visual map</legend>
    <b-form-group
      id="input-group-visual-map-dimension"
      label="Dimension"
      label-for="general-visual-map-dimension"
      >
      <v-select
        id="general-visual-map-dimension"
        @input="setVisualMapDimension"
        v-model="selectedVisualMapDimension"
        placeholder="Optional"
        :options="dimensionSelectInputs">
        <template #search="{attributes, events}">
          <input
            class="vs__search"
            v-bind="attributes"
            v-on="events"
            />
        </template>
      </v-select>
    </b-form-group>

    <b-form-checkbox v-model="form.config.visualMap.extendedColorRange" name="check-button" switch>
      Extended visual map color range
    </b-form-checkbox>

    <legend>X-axis</legend>
    <b-form-checkbox v-model="form.config.xAxis3D.multidimensional" name="check-button" switch>
      Use X axis to determine dimension of Z-axis
    </b-form-checkbox>
    <b-form-group
      id="input-x-group-name"
      label="Name:"
      label-for="three-d-bar-chart-x-edit-name"
      >
      <b-form-input
        id="three-d-bar-chart-x-edit-name"
        v-model="form.config.xAxis3D.name"
        required
        placeholder="Enter X-axis name"
        >
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="input-group-x-axis-dimension"
      label="Dimension(s)"
      label-for="general-x-axis-dimension"
      >
      <v-select
        id="general-x-axis-dimension"
        @input="setXAxisDimension"
        :multiple="true"
        v-model="selectedXAxisDimension"
        :options="dimensionSelectInputs">
        <template #search="{attributes, events}">
          <input
            class="vs__search"
            v-bind="attributes"
            :required="!selectedXAxisDimension.length"
            v-on="events"
            />
        </template>
      </v-select>
    </b-form-group>

    <legend>Y-axis</legend>
    <b-form-group
      id="input-y-group-name"
      label="Name:"
      label-for="three-d-bar-chart-y-edit-name"
      >
      <b-form-input
        id="three-d-bar-chart-y-edit-name"
        v-model="form.config.yAxis3D.name"
        required
        placeholder="Enter Y-axis name"
        >
      </b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-y-axis-dimension"
      label="Dimension(s)"
      label-for="general-y-axis-dimension"
      >
      <v-select
        id="general-y-axis-dimension"
        @input="setYAxisDimension"
        :multiple="true"
        v-model="selectedYAxisDimension"
        :options="dimensionSelectInputs">
        <template #search="{attributes, events}">
          <input
            class="vs__search"
            v-bind="attributes"
            :required="!selectedYAxisDimension.length"
            v-on="events"
            />
        </template>
      </v-select>
    </b-form-group>

    <legend>Z-axis</legend>
    <b-form-group
      id="input-z-group-name"
      label="Name:"
      label-for="three-d-bar-chart-z-edit-name"
      >
      <b-form-input
        id="three-d-bar-chart-z-edit-name"
        v-model="form.config.zAxis3D.name"
        required
        placeholder="Enter Z-axis name"
        >
      </b-form-input>
    </b-form-group>
    <b-form-group
      v-if="!form.config.xAxis3D.multidimensional"
      id="input-group-z-axis-dimension"
      label="Dimension"
      label-for="general-z-axis-dimension"
      >
      <v-select
        id="general-z-axis-dimension"
        @input="setZAxisDimension"
        v-model="selectedZAxisDimension"
        :options="dimensionSelectInputs">
        <template #search="{attributes, events}">
          <input
            class="vs__search"
            v-bind="attributes"
            :required="!selectedZAxisDimension || !selectedZAxisDimension.value"
            v-on="events"
            />
        </template>
      </v-select>
    </b-form-group>

    <code-card
      title="Result"
      :text="form"
      >
    </code-card>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import debounce from 'debounce'

import { VisualizationEntity, ThreeDBarChartConfig } from '@/../types/visualization-framework'
import CodeCard from '@/components/framework/CodeCard.vue'

// import { frameworkStore } from '@/store'

interface ThreeDBarChartEditInput {
  config: ThreeDBarChartConfig
}

type DimensionSelectInput = {
  label: string
  value: string
}

@Component({
  components: {
    CodeCard
  }
})
export default class ThreeDBarChartEditForm extends Vue {
  @Prop() visualization!: VisualizationEntity

  show: boolean = false
  form: ThreeDBarChartEditInput = {
    config: {
      dimensions: [],
      visualMap: {
        extendedColorRange: false,
        dimension: ''
      },
      xAxis3D: {
        name: '',
        dimensionIndices: [],
        multidimensional: false
      },
      yAxis3D: {
        name: '',
        dimensionIndices: []
      },
      zAxis3D: {
        name: '',
        dimensionIndices: []
      }
    }
  }

  addDimension() {
    this.form.config.dimensions.push({
      name: '',
      type: undefined,
      displayName: ''
    })
  }

  dimensionTypeOptions: Array<string> = ['number', 'float', 'int', 'ordinal', 'time']

  get dimensionSelectInputs(): Array<DimensionSelectInput> {
    return this.form.config.dimensions.map(d => {
      const dimInput: DimensionSelectInput = {
        label: d.displayName ? d.displayName : '',
        value: d.name
      }
      return dimInput
    }).filter(d => d.value.length)
  }
  selectedVisualMapDimension: DimensionSelectInput? = null
  selectedXAxisDimension: Array<DimensionSelectInput> = []
  selectedYAxisDimension: Array<DimensionSelectInput> = []
  selectedZAxisDimension: DimensionSelectInput? = null

  setVisualMapDimension(fieldInput?: DimensionSelectInput) {
    if (fieldInput) {
      this.form.config.visualMap.dimension = fieldInput.value
    }
  }

  setAxisDimension(axis: 'xAxis3D' | 'yAxis3D' | 'zAxis3D', fieldInputs?: Array<DimensionSelectInput>) {
    if (fieldInputs) {
      this.form.config[axis].dimensionIndices = fieldInputs.map(fieldInput => this.form.config.dimensions.findIndex(dim => dim.name === fieldInput.value))
      // console.log(this.form.config[axis].dimensionIndices, this.form.config.dimensions)
    }
  }
  setAxisDimensionInput(axisInput: 'xAxis3D' | 'yAxis3D' | 'zAxis3D') {
    if (this.visualization.config[axisInput].dimensionIndices) {
      const axisInputValue = this.visualization.config[axisInput].dimensionIndices.map(i => {
        const { name, displayName } = this.visualization.config.dimensions[i]
        return {
          label: displayName,
          value: name
        }
      })
      // Z-axis is a single value dimension
      const dims: any = { 'xAxis3D' : 'XAxis', 'yAxis3D': 'YAxis', 'zAxis3D': 'ZAxis' }
      this[`selected${dims[axisInput]}Dimension`] = axisInput !== 'zAxis3D' ? axisInputValue : axisInputValue[0]
    }
  }

  setXAxisDimension(fieldInputs?: Array<DimensionSelectInput>) {
    // console.log(fieldInputs)
    this.setAxisDimension('xAxis3D', fieldInputs)
  }
  setYAxisDimension(fieldInputs?: Array<DimensionSelectInput>) {
    this.setAxisDimension('yAxis3D', fieldInputs)
  }
  setZAxisDimension(fieldInput?: DimensionSelectInput) {
    if (fieldInput) {
      this.setAxisDimension('zAxis3D', [fieldInput])
    }
  }

  @Watch('form', { deep: true })
  onFormChanged(newVal: ThreeDBarChartEditInput) {
    this.updateForm(newVal)
  }

  updateForm(newVal: ThreeDBarChartEditInput) {
    this.$emit('update', newVal)
  }

  setForm() {
    if (this.visualization.config.dimensions) {
      this.form.config.dimensions = this.visualization.config.dimensions
    }
    if (this.visualization.config.visualMap) {
      this.form.config.visualMap = this.visualization.config.visualMap
    }
    this.form.config.xAxis3D = this.visualization.config.xAxis3D
    this.setAxisDimensionInput('xAxis3D')
    this.form.config.yAxis3D = this.visualization.config.yAxis3D
    this.setAxisDimensionInput('yAxis3D')
    this.form.config.yAxis3D.data = ['2020-01-07', '2020-01-08', '2020-01-09', '2020-01-10']
    this.form.config.zAxis3D = this.visualization.config.zAxis3D
    this.setAxisDimensionInput('zAxis3D')

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
    this.$emit('update', this.form)
  }
}
</script>

<style lang="scss" scoped>
</style>
