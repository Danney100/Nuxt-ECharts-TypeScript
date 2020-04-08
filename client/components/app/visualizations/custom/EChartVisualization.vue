<template>
  <div class="visualization">
    <div v-if="widget" class="widget-wrapper">
      <slot name="widget-header">
      </slot>
      <slot name="main-content-view">
        <v-chart
          v-if="echartsOptions"
          ref="chart"
          autoresize
          theme="light"
          :style="{height: height, width: width}"
          :options="echartsOptions"
          @finished="finished"
          @click="handleClick"
          @datazoom="handleZoom"
          @timelinechanged="handleTimelineChanged"
          @legendselectchanged="handleLegendSelected"
          />
      </slot>
    </div>
    <div v-else>
      <v-chart
        v-if="echartsOptions"
        ref="chart"
        autoresize
        theme="light"
        :style="{height: height, width: width}"
        :options="echartsOptions"
        @finished="finished"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'nuxt-property-decorator'
import ECharts from 'echarts'

import { VisualizationLayoutOption, EChartVisualizationConfig } from '@/../types/visualization-framework'

const defaultToolbox: any = {
  show: true,
  feature: {
    mark: {
      show: true
    },
    dataZoom: {
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
}

const baseDefaultConfig: EChartVisualizationConfig = {
  layout: VisualizationLayoutOption.Manual, // TODO = prop with default as manual
}

// Higher-level wrapper type for all echarts, holds common state, event emitters, etc.
// Extend this
// TODO rows and columns
@Component({
  components: {
  },
})
export default class EChartVisualization extends Vue {
  config: EChartVisualizationConfig = baseDefaultConfig
  echartsOptions: any = null

  $refs!: {
    chart: ECharts
  }

  @Prop() id!: string
  @Prop() layout!: VisualizationLayoutOption

  @Prop({ default: '100%'}) height!: string
  @Prop({ default: '100%'}) width!: string

  // Any other echart options that are mixed in
  @Prop({ default: () => { return {} } }) options!: any
  @Watch('options')
  onOptionsChanged() {
    this.loadConfig()
    this.load()
  }
  @Prop(Boolean) widget!: boolean
  @Prop(Boolean) toolbox!: boolean

  loadConfig() {
    const { layout, title, description } = this
    this.config = { ...baseDefaultConfig, layout, title, description }
  }

  finished() {
  }

  @Emit('clicked')
  handleClick(params) {
    // console.log(params.componentType)
    return params
  }

  @Emit('zoomed')
  handleZoom(params) {
    return { params, options: this.$refs.chart.computedOptions }
  }

  @Emit('timelinechanged')
  handleTimelineChanged(params) {
    return { params, options: this.$refs.chart.computedOptions }
  }

  @Emit('legendselectchanged')
  handleLegendSelected(params: any) {
    // console.log('legend selected: ', params)
    return { params, options: this.$refs.chart.computedOptions }
  }

  load() {
    const options: any = { ...this.options }

    // console.log('Configuring Visualization with options: ', options)

    options.textStyle = {
      fontFamily: 'Poppins'
    }


    if (this.config.timeline) {
      // options.
    }

    if (this.config.toolbox) {
      options.toolbox = defaultToolbox
    }

    this.echartsOptions = options
  }

  mounted() {
    this.loadConfig()
    this.load()
  }
}
</script>

<style lang="scss" scoped>
.visualization {
  flex: 18 18 18em;
}
</style>
