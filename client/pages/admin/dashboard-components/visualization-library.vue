<template>
  <div>
    <!-- Navigation -->
    <h3>Charts</h3>
    <div class="row">
      <visualization-library-grid-item
        v-for="item in charts"
        :key="item.title"
        :item="item" />
    </div>

    <h3>3D</h3>
    <div class="row">
      <visualization-library-grid-item
        v-for="item in threeDCharts"
        :key="item.title"
        :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import { VisualizationLibraryItem } from '@/../types/visualization-framework'
import VisualizationLibraryGridItem from '@/components/app/Visualization/crud/VisualizationLibraryGridItem'
import DefaultPageMixin from '@/components/framework/DefaultPageMixin'

const visualizationRoutes: any = {
  bar: { path: "create-visualization", query: { type: 'bar' } },
  radar: { path: "create-visualization", query: { type: 'radar' } },
  line: { path: "create-visualization", query: { type: 'line' } },
  scatter: { path: "create-visualization", query: { type: 'scatter' } },
  tree: { path: "create-visualization", query: { type: 'tree' } },
  scatterplotTimeline: { path: "create-visualization", query: { type: 'scatterplot-timeline' } },
  threeDBar: { path: "create-visualization", query: { type: '3d-bar' } },
  threeDScatter: { path: "create-visualization", query: { type: '3d-scatter' } },
  //  punchCard: { path: "create-visualization", query: { type: '3d-punch-card' } },
}

@Component({
  layout: 'framework/admin',
  components: {
    VisualizationLibraryGridItem
  }
})
export default class VisualizationLibrary extends mixins(DefaultPageMixin) {
  charts: Array<VisualizationLibraryItem> = [
    {
      title: "Bar",
      previewImg: "https://www.echartsjs.com/examples/data/thumb-light/mix-zoom-on-value.jpg",
      previewImgAlt: "Bar chart",
      route: visualizationRoutes.bar
    },
    {
      title: "Radar",
      previewImg: "/img/radarchart.png",
      previewImgAlt: "Radar chart",
      route: visualizationRoutes.radar
    },
    {
      title: "Line",
      previewImg: "https://www.echartsjs.com/examples/data/thumb-light/line-simple.jpg",
      previewImgAlt: "Line chart",
      route: visualizationRoutes.line
    },
    {
      title: "Scatter",
      previewImg: "https://www.echartsjs.com/examples/data/thumb-light/scatter-stream-visual.jpg",
      previewImgAlt: "Scatter plot",
      route: visualizationRoutes.scatter
    },
    {
      title: "Tree",
      previewImg: "https://www.echartsjs.com/examples/data/thumb-light/tree-basic.jpg",
      previewImgAlt: "Tree diagram",
      route: visualizationRoutes.tree
    },
    {
      title: "Scatter Plot Timeline",
      previewImg: "/img/scatterplot-timeline.png",
      previewImgAlt: "Scatter Plot Timeline",
      route: visualizationRoutes.scatterplotTimeline
    }
  ]

  threeDCharts: VisualizationLibraryItem = [
    {
      title: "Scatter 3D",
      previewImg: "https://echarts.apache.org/examples/data-gl/thumb/scatter3d.jpg",
      previewImgAlt: "Scatter 3D",
      route: visualizationRoutes.threeDScatter
    },
    {
      title: "Bar 3D",
      previewImg: "https://echarts.apache.org/examples/data-gl/thumb/bar3d-dataset.jpg",
      previewImgAlt: "Bar 3D",
      route: visualizationRoutes.threeDBar
    }
  ]
}

</script>


<style lang="scss" scoped>
h3 {
  color: rgb(21, 21, 103);
}

.row {
  margin-bottom: 10px;
}
</style>
