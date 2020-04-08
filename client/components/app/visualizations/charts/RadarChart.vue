<template>
  <div>
    <e-chart-visualization
      v-if="appliedOptions.series[0].data.length"
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
import EChartVisualization from '@/components/app/visualizations/custom/EChartVisualization'

import { VisualizationType, VisualizationEntity, AxisConfig } from '@/../types/visualization-framework'
import { getLabels } from '@/utils/helpers'

const baseConfig = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    x: 'center',
    width: 420,
    itemHeight: 12
  },
  toolbox: {
    show: false,
    feature: {
      mark: {
        show: true
      },
      dataView: {
        show: true,
        readOnly: false
      },
      restore: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  calculable: true,
  polar: [{
    indicator: [],
    radius: 130
  }],
  series: [
    {
      name: 'Data',
      type: 'radar',
      itemStyle: {
        normal: {
          areaStyle: {
            type: 'default'
          }
        }
      },
      data: []
    }
  ]
}

@Component({
  components: {
    EChartVisualization
  }
})
export default class RadarChart extends Vue {
  @Prop() visualization!: VisualizationEntity
  @Watch('visualization', { deep: true })
  onVisualizationChanged() {
    this.loadConfig()
  }

  @Prop({ default: () => { return {} } }) options: any
  @Prop({ default: '420px'}) height!: string
  @Prop({ default: '100%'}) width!: string

  appliedOptions: any = { series: [{ data: [] }] }

  form: any = {}

  validateVisualization(config: any) {
    let validated = true
    if (this.visualization.type !== VisualizationType.Radar) {
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
    return validated
  }

  loadConfig() {
    // console.log(`Configuring visualization of type "${this.visualization.type}": `)
    // console.log('Visualization: ')
    // console.log(this.visualization)

    const { config, dataSource } = this.visualization
    const title = this.visualization.title
    // Should subtitle be different than the description?
    const subtext = this.visualization.description || ''

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

    options.legend.data = this.visualization.config.series.map(s => s.name)

    // Populate chart data
    const seriesData = this.visualization.config.series.map(s => {
      // TODO - aggregations from API
      const data = this.visualization.dataSource.data.find(f => {
        return f[s.dataFilterFieldName] === s.dataFilterFieldValue
      })
      const value = data ? this.visualization.config.indicators.map(i => data[i.dataValueField]) : []

      return { name: s.name, value }
    }) // dataSource.data.map(record => record[config.yAxis.dataValueField])
    options.series[0].data = seriesData
    options.polar[0].indicator = this.visualization.config.indicators.map(i => {
      return { text: i.name, max: 10 }
    })

    /* let dataShadow = []
    const yMax = seriesData.reduce((a, b) => Math.max(a, b))
    console.log(yMax)
    for (var i = 0; i < data.length; i++) {
      dataShadow.push(yMax)
    }
    options.series[1].data = seriesData*/

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
