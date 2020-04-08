<template>
  <div>
    <!--<label>Start date: -->
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
import { addDays, format } from 'date-fns'

import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
//import { mixins } from 'vue-class-component'
// import echarts from 'echarts'
import EChartVisualization from '@/components/app/visualizations/custom/EChartVisualization.vue'

import { DataSourceType, DataSourceEntity } from '@/../types/framework'
import { VisualizationType, VisualizationEntity, AxisConfig, LineChartConfig } from '@/../types/visualization-framework'
import { getLabels } from '@/utils/helpers'

import { frameworkStore } from '@/store'

const getUTCDate = (date = new Date()) => {
  return new Date(date.getTime() + date.getTimezoneOffset()*60*1000)
}


let seriesCollectionName = 'data'

const baseConfig = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    // TODO configurable
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  // toolbox: {
  //   feature: {
  //     saveAsImage: {}
  //   }
  // },
  xAxis: {
//    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
//    type: 'value'
  },
  series: [
    {
      name: 'test',
      type: 'line',
      stack: seriesCollectionName,
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'test',
      type: 'line',
      stack: seriesCollectionName,
      data: [110, 282, 91, 34, 90, 99, 70]
    },
  ]
}

@Component({
  components: {
    EChartVisualization
  }
})
export default class LineChart extends Vue {
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
    if (this.visualization.type !== VisualizationType.Line) {
      // console.log('ERROR: Visualization type mismatch!')
      validated = false
    }
    // TODO - dataSource data can have type dynamic and query etc.
    // if (!this.visualization.dataSource.data || !this.visualization.dataSource.data.length) {
    //   // console.log('ERROR: Visualization has no data!')
    //   validated = false
    // }
    if (!this.visualization.config) {
      // console.log('ERROR: Visualization has no config!')
      validated = false
    }
    return validated
  }

  async populateChartData(options: LineChartConfig) {
    // Populate chart data
    let seriesData = []

    // TODO configureable dates !! '2020-01-07'
    const start = getUTCDate(new Date('2020-01-07'))
    const end = addDays(start, 1)


    // TODO - aggregations from API
    if (this.visualization.dataSource.type === DataSourceType.Elasticsearch) {
      const valueBuckets = await frameworkStore.dataSource.searchDimension({
        dataSource: this.visualization.dataSource,
        seriesIds: this.visualization.config.series.map(s => s.name),
        params: [
          ...this.visualization.config.series.map(series => [{
            'dataFieldName': series.dataFieldName,
            'dataFieldValue': series.dataFieldValue
          }])
        ],
        start,
        end,
        max: 200
      })
      // console.log('value buckets')
      // console.log(valueBuckets)

      for (let i = 0; i < this.visualization.config.series.length; i++) {
        const name = this.visualization.config.series[i].name
        options.series[i].data = valueBuckets[name].map((bucket: any) => {
          return bucket.count
        })
        options.series[i].name = name
        options.xAxis.data = valueBuckets[name].map((bucket: any) => {
          return format(new Date(bucket.start), "HH:mm")
        })
      }


      return this.visualization.dataSource.data.find(f => {
        return f[s.dataFilterFieldName] === s.dataFilterFieldValue
      })
    }
    else {
      seriesData = this.visualization.config.series.map(s => {
        return this.visualization.dataSource.data.find(f => {
          return f[s.dataFilterFieldName] === s.dataFilterFieldValue
        })
      })
    }
  } // dataSource.data.map(record => record[config.yAxis.dataValueField])
      // options.series[0].data = seriesData

  async loadConfig() {
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

    const options: any = {
      ...baseConfig,
      ...this.options
    }
    if (title.length) {
      options.title = { ...options.title, text: title }
    }
    if (subtext.length) {
      options.title = { ...options.title, subtext }
    }

    options.xAxis.name = this.visualization.config.xAxis.name
    options.yAxis.name = this.visualization.config.yAxis.name

    options.legend.data = this.visualization.config.series.map(s => s.name)
    await this.populateChartData(options)

    /* let dataShadow = []
    const yMax = seriesData.reduce((a, b) => Math.max(a, b))
    // console.log(yMax)
    for (var i = 0; i < data.length; i++) {
      dataShadow.push(yMax)
    }
    options.series[1].data = seriesData*/

    this.appliedOptions = options
  }

  async mounted() {
    if (this.visualization) {
     await this.loadConfig()
    }
  }
}
</script>
