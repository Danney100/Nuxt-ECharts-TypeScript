<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import { mixins } from 'vue-class-component'
//import VisualizationEntity from '@/../types/visualization-framework'
//import EChartVisualization from '@/components/app/visualizations/custom/EChartVisualization'
import TimelineVisualizationMixin from '@/components/app/visualizations/custom/Timeline'
import { frameworkStore } from '@/store'


@Component({
  components: {
    EChartVisualization
  }
})
export default class ScatterplotTimeline extends mixins(TimelineVisualizationMixin) {
}
</script>

<style lang="scss" scoped>
</style>
