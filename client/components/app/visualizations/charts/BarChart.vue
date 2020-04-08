<template>
  <div>
    <e-chart-visualization
      v-if="appliedOptions.xAxis.data.length"
      widget="false"
      :width="width"
      :height="height"
      :options="appliedOptions">
    </e-chart-visualization>
    <p v-else>Chart is not configured, misconfigured, or data is not available</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
//import { mixins } from 'vue-class-component'
import echarts from 'echarts'
import EChartVisualization from '@/components/app/visualizations/custom/EChartVisualization.vue'

import { VisualizationType, VisualizationEntity, AxisConfig, BarChartConfig } from '@/../types/visualization-framework'
import { getLabels } from '@/utils/helpers'

const baseConfig = {
  xAxis: {
    data: [],
    axisLabel: {
      inside: true,
      textStyle: {
        color: '#fff'
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#999'
      }
    }
  },
  series: [
    { // For shadow
      type: 'bar',
      itemStyle: {
        normal: {color: 'rgba(0,0,0,0.05)'}
      },
      barGap:'-100%',
      barCategoryGap:'40%',
      data: [],
      animation: false
    },
    {
      type: 'bar',
      data: []
    }
  ]
}

@Component({
  components: {
    EChartVisualization
  }
})
export default class BarChart extends Vue {
  @Prop() visualization: VisualizationEntity
  @Watch('visualization', { deep: true })
  onVisualizationChanged() {
    this.loadConfig()
  }

  @Prop({ default: () => { return {} } }) options: any
  @Prop({ default: '420px'}) height: string
  @Prop({ default: '100%'}) width: string

  appliedOptions: any = { xAxis: { data: [] } }

  form: any = {}

  validateVisualization(config: any) {
    let validated = true
    if (this.visualization.type !== VisualizationType.Bar) {
      // console.log('ERROR: Visualization type mismatch!')
      validated = false
    }
    if (!this.visualization.dataSource.data || !this.visualization.dataSource.data.length) {
      // console.log('ERROR: Visualization has no data!')
      validated = false
    }
    if (!this.visualization.config) {
      // console.log('ERROR: Visualization has no config!')
      validated = false
    }
    if (!config.xAxis) {
      // console.log('ERROR: Visualization has no xAxis defined!')
      validated = false
    }
    if (!config.yAxis) {
      // console.log('ERROR: Visualization has no yAxis defined!')
      validated = false
    }
    else if (!config.yAxis.dataValueField) {
      // console.log('ERROR: Visualization has no data value field defined!')
      validated = false
    }
    return validated
  }

  loadConfig() {
    // console.log(`Configuring visualization of type "${this.visualization.type}": `)
    // console.log('Visualization: ')
    // console.log(this.visualization)

    const { config, dataSource } = this.visualization
    const title = this.visualization.title
    // Should subtitle be different than the description?
    const subtext = this.visualization.description

    if (!this.validateVisualization(config)) {
      return
    }

    const options = {
      ...baseConfig,
      ...this.options
    }
    if (title.length) {
      options.title = { ...options.title, text: title }
    }
    if (subtext.length) {
      options.title = { ...options.title, subtext }
    }

    // Populate chart data
    // TODO data streaming with subsampling from API on huge datasets
    const seriesData = dataSource.data.map(record => record[config.yAxis.dataValueField])
    options.series[0].data = seriesData

    let dataShadow = []
    const yMax = seriesData.reduce((a: number, b: number) => Math.max(a, b))
    // console.log(yMax)
    for (var i = 0; i < seriesData.length; i++) {
      dataShadow.push(yMax)
    }
    options.series[1].data = seriesData

    // Assign axes
    const { xAxis, yAxis} = config
    options.xAxis.data = getLabels(xAxis, dataSource)
    options.xAxis.name = xAxis.name
    options.yAxis.name = yAxis.name

    this.appliedOptions = options
  }

  mounted() {
    if (this.visualization) {
      this.loadConfig()
    }
  }
}
</script>

<style lang="scss">
</style>
