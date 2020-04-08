<template>
  <div>
    <scatterplot-timeline-visualization v-if="vis" :visualization="vis">
    </scatterplot-timeline-visualization>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import DefaultPageMixin from '@/components/framework/DefaultPageMixin'


import ScatterplotTimelineVisualization from '@/components/app/visualizations/custom/ScatterplotTimeline/ScatterplotTimeline'

import { frameworkStore } from '@/store'

@Component({
  layout: 'framework/admin',
  components: {
    ScatterplotTimelineVisualization
  }
})
export default class ScatterplotTimeline extends mixins(DefaultPageMixin) {
  vis: VisualizationEntity? = null

  async created() {
    this.vis = await frameworkStore.dashboardComponent.visualization.retrieve('testing-scatter')
  }
}

</script>
<style lang="scss">
</style>
