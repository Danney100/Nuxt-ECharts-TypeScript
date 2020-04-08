<template>
  <div>
    <e-chart-visualization
      v-if="appliedOptions.series"
      widget="false"
      :height="height"
      @clicked="handleClick"
      :options="appliedOptions"
      >
    </e-chart-visualization>
    <p v-else>Chart is not configured, misconfigured, or data is not available</p>
  </div>
</template>

<script lang="ts">
import { format, addDays } from 'date-fns'
import { omit, cloneDeep } from 'lodash'

import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import echarts from 'echarts'
import EChartVisualization from '@/components/app/visualizations/custom/EChartVisualization.vue'

import { DataSourceType } from '@/../types/framework'
import { VisualizationType, VisualizationEntity, AxisConfig, BarChartConfig } from '@/../types/visualization-framework'
import { getLabels } from '@/utils/helpers'

import { frameworkStore } from '@/store'

const getUTCDate = (date = new Date()) => {
  return new Date(date.getTime() + date.getTimezoneOffset()*60*1000)
}

const baseConfig = {
  tooltip: {},
  dataset: {
  },
  xAxis3D: {
    type: 'category',
    nameGap: 70,
    // axisLabel: {
    //   interval: 0
    // },
    splitNumber: 24
  },
  yAxis3D: {
    type: 'category',
    nameGap: 70,
    //
  },
  zAxis3D: {},
  visualMap: {
  },
  grid3D: {
    axisLabel: {
      interval: 0
    },
    viewControl: {
    },
    //    boxWidth: 200,
    //    boxDepth: 160,
    boxWidth: 200,
    // boxDepth: 160,
    boxDepth: 100,
    light: {
      main: {
        intensity: 1.3,
        shadow: false, // TODO: configurable,
        quality: 'high'
      },
      ambient: {
        intensity: 0.3

      }
    }
  },
  series: [{
    name: 'Data',
    type: 'bar3D',
    // shading: 'color',
    shading: 'lambert', // TODO : configurable
    label: {
      show: false,
      textStyle: {
        fontSize: 16,
        borderWidth: 1
      }
    },
    itemStyle: {
      opacity: 1.0 // TODO configurable
    },
    emphasis: {
      label: {
        textStyle: {
          fontSize: 20,
          color: '#900'
        }
      },
      itemStyle: {
        color: '#900'
      }
    }
  }]
}

@Component({
  components: {
    EChartVisualization
  }
})
export default class ThreeDBarChart extends Vue {
  @Prop() visualization!: VisualizationEntity
  @Watch('visualization', { deep: true })
  onVisualizationChanged() {
    this.loadConfig()
  }

  @Prop({ default: () => { return {} } }) options: any
  @Prop({ default: '640px'}) height!: string
  @Prop({ default: '100%'}) width!: string

  appliedOptions: any = { }

  handleClick() {

  }

  validateVisualization(config: any) {
    let validated = true
    if (this.visualization.type !== VisualizationType.ThreeDBar) {
      // console.log('ERROR: Visualization type mismatch!')
      validated = false
    }
    // if (!this.visualization.dataSource.data || !this.visualization.dataSource.data.length) {
    //   // console.log('ERROR: Visualization has no data!')
    //   validated = false
    // }

    if (!this.visualization.config.xAxis3D.dimensionIndices) {
      // console.log('ERROR: Need X dimension indices!')
      validated = false
    }

    // if (!this.visualization.config) {
    //   // console.log('ERROR: Visualization has no config!')
    //   validated = false
    // }
    // if (!config.xAxis) {
    //   // console.log('ERROR: Visualization has no xAxis defined!')
    //   validated = false
    // }
    // if (!config.yAxis) {
    //   // console.log('ERROR: Visualization has no yAxis defined!')
    //   validated = false
    // }
    // else if (!config.yAxis.dataValueField) {
    //   // console.log('ERROR: Visualization has no data value field defined!')
    //   validated = false
    // }
    return validated
  }

  async populateChartData(dataSource: DataSourceEntity, options: any) {
    // options.dataset.source = this.visualization.config.xAxis3D.dimensionIndices.map(i => options.dataset.dimensions[i+1].name).filter(some => some).map(dataSetName => {
    //   return dataSource.data.map( datum => [dataSetName, ...options.dataset.dimensions.map(dim => datum[dim.name])] )
    // })
    let chartData = []

    const valueDimensions = this.visualization.config.xAxis3D.dimensionIndices.map(i => options.dataset.dimensions[i+2]).filter(some => some.name)
    // console.log('value dims', valueDimensions)

    let toBePopulated = []
    if (!dataSource.data || !dataSource.data.length) {
      if (dataSource.type === DataSourceType.Elasticsearch) {
        // query data based on configured dimensions
        // Currently only time series supported
        if (valueDimensions[0].type === 'time') {
          for (const yAxisItem of this.visualization.config.yAxis3D.data) {
            const start = getUTCDate(new Date(yAxisItem))
            const end = addDays(start, 1)
            // const interval = ((end.getTime()/1000) - (start.getTime()/1000)) / 24

            const histogram = await frameworkStore.dataSource.histogram({
              dataSource,
              seriesIds: ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6'],
              max: 24,
              start,
              end
            })
            // console.log('populate histogram: ', histogram)

            // const datum = { doc_count: histogram.doc_count }
            // TODO configurable stacking? NVM it doesn't look too good
            // Copy the configured series for stacking
            //const baseDataset = cloneDeep(options.dataset)
            //const baseSeries = cloneDeep(options.series[0])
            //options.series = []
            //options.dataset = []

            // console.log(options.series[0].encode.tooltip)
            // console.log(options.dataset.dimensions)
            const tooltipDims = options.series[0].encode.tooltip.map(idx => options.dataset.dimensions[idx]).filter(some => some.name)
            // console.log(tooltipDims)

            let i = 0
            // We need to use this as a reset
            let previousLength = Math.max(0, chartData.length)

            // Determine accessors for "doc_count" dimensions
            const dim_accessors = []
            for (const dim of tooltipDims.slice(1)) {
              let accessor = (datum) => datum.start
              if (dim.name.indexOf('doc_count') !== -1) {
                const fields = dim.name.split('.')
                accessor = (datum) => {
                  const d = histogram[fields[0]].find((f) => f.start === datum.start)
                  return d ? d.count : 0
                }
              }
              dim_accessors.push(accessor)
            }

            // TODO configurable!!
            for (const series of ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6']) {
              // Append Series dataset
              // chartData.push(cloneDeep(baseDataset))
              // chartData[i].source = []
              // options.series.push(cloneDeep(baseSeries))
              // options.series[i].datasetIndex = i
              // options.series[i].stack = series

              let datumIdx = previousLength
              for (const datum of histogram[series]) {
                // Consider not using this series aggregation ; we care about doc_count for each date
                // or just add each element of each agg.
                //chartData[i].source.push([datum.start, datum.count, datum.start, yAxisItem])
                if (i === 0 || !chartData[datumIdx]) {
                  //tooltipDims

                  // haaaa ex. 12p.m., 3a.m., etc.
                  chartData.push([format(datum.start, 'haaaa'), datum.count, ...dim_accessors.map(f => f(datum)), yAxisItem])
                }
                else {
                  // Add to existing count
                  chartData[datumIdx][1] += datum.count
                }
                datumIdx++
              }
              i++
            }
          }
          // console.log(chartData)

          //options.dataset = chartData
          options.dataset.source = chartData
          return
        }
        else {
          return
        }
      }
    }

    for (const dataSetDim of valueDimensions) {
      for (const datum of dataSource.data) {
        chartData.push([dataSetDim.displayName, datum[dataSetDim.name], ...this.visualization.config.dimensions.map(dim => datum[dim.name])]) //  || 'Paradigm Interactive'
      }
    }
    options.dataset.source = chartData
  }

  async loadConfig() {
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
    options.dataset.dimensions = [{ name: 'metric' }, { name: 'value' }, ...this.visualization.config.dimensions.map(dim => {
      if (dim.type) {
        return dim
      }
      return omit(dim, ['type'])
    })]

    options.xAxis3D.name = this.visualization.config.xAxis3D.name
    // options.xAxis3D.data = this.visualization.config.xAxis3D.dimensionIndices.map(di => this.visualization.config.dimensions[di].name)
    options.yAxis3D.name = this.visualization.config.yAxis3D.name
    //
    options.zAxis3D.name = this.visualization.config.zAxis3D.name

    let i = 2
    options.series[0].encode = {
      x: 'metric',
      z: 'value',
      tooltip: [1, ...this.visualization.config.dimensions.map(d => i++)] // [0, 1, 2, ...]
    }
    if ((!this.visualization.config.yAxis3D.dimensionIndices || this.visualization.config.yAxis3D.dimensionIndices.length) && this.visualization.config.yAxis3D.data.length) {
      // Use data over configured dimensions
      options.dataset.dimensions.push('day_of_week')
      options.series[0].encode.y = 'day_of_week'
    }
    else {
      options.series[0].encode.y = this.visualization.config.yAxis3D.dimensionIndices.map(di => this.visualization.config.dimensions[di].name)[0]
    }

    options.series[0].label.formatter = (params, name, value) => {
      // console.log(params, name, value)
      return params.value[params.encode.z]
    }

    // options.xAxis3D.data = this.visualization.config.xAxis3D.dimensionIndices.map(i => options.dataset.dimensions[i].displayName)

    await this.populateChartData(dataSource, options)

    const visualMap = this.visualization.config.visualMap
    if (visualMap) {
      if (visualMap.extendedColorRange) {
        options.visualMap.inRange = {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      }
      else {
        options.visualMap.inRange = undefined
      }

      options.visualMap.dimension = visualMap.dimension ? visualMap.dimension : 'value'
      // console.log(options.visualMap.dimension, options.dataset.dimensions)
      try {
        const visMapDimIndex = options.dataset.dimensions.findIndex(dim => dim.name === options.visualMap.dimension)
        options.visualMap.max = options.dataset.source.map(datum => datum[visMapDimIndex]).reduce((i1, i2) => Math.max(i1, i2))
      } catch (e) {
        // console.log("failed to set visualMap max value!")
      }
    }

    // Assign axes
    // const { xAxis, yAxis, zAxis } = config
    // options.xAxis.data = getLabels(xAxis, dataSource)
    // options.xAxis.name = xAxis.name
    // options.yAxis.name = yAxis.name
    // options.yAxis.name = yAxis.name

    this.appliedOptions = options
  }

  async mounted() {
    if (this.visualization) {
      await this.loadConfig()
    }
  }
}
</script>
