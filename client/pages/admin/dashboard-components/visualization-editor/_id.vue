<template>
  <div>
    <visualization-editor
      v-if="visualization"
      :visualization="visualization"

      />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import DefaultPageMixin from '@/components/framework/DefaultPageMixin.vue'

import { VisualizationEntity } from '@/../types/visualization-framework'

import { frameworkStore } from '@/store'
import VisualizationEditor from '@/components/app/Visualization/VisualizationEditor.vue'

@Component({
  components: {
    VisualizationEditor
  },
  layout: 'framework/admin'
})
export default class VisualizationEditorPage extends mixins(DefaultPageMixin) {
  visualization?: VisualizationEntity = null

  async mounted() {
    const visualization = await frameworkStore.dashboardComponent.visualization.retrieve(this.$route.params.id)
    visualization.dataSource = await frameworkStore.dataSource.retrieve({ id: visualization.dataSource.id, needsData: true })
    // console.log(visualization.dataSource)
    this.visualization = visualization
  }
}
</script>

<style lang="scss">
</style>
