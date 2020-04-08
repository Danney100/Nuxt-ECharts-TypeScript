<template>
  <div>
    <h3>Create a Visualization</h3>

    <visualization-create-form
      :submit="create"
      :visualizationType="visualizationType"
    >
    </visualization-create-form>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import VisualizationCreateForm from '@/components/app/Visualization/crud/VisualizationCreateForm.vue'
import DefaultPageMixin from '@/components/framework/DefaultPageMixin.vue'

import { frameworkStore } from '@/store'
import { VisualizationType, VisualizationEntity } from '@/../types/visualization-framework'

@Component({
  layout: 'framework/admin',
  components: {
    VisualizationCreateForm
  }
})
export default class VisualizationsCreate extends mixins(DefaultPageMixin) {
  visualizationType: string = ""

  create(vis: VisualizationEntity) {
    // console.log(vis)
    const { id } = vis
    frameworkStore.dashboardComponent.visualization.create(vis)
    setTimeout(() => {
      this.$router.push({ name: 'admin-dashboard-components-visualization-editor-id', params: { id } })
    }, 1000)

    // if (frameworkStore.dashboardComponent && frameworkStore.dashboardComponent.visualization) {
    //   if (await frameworkStore.dashboardComponent.visualization.create(vis)) {
    //     this.$router.push({ name: 'admin-dashboard-components-visualization-editor-id', params: { id } })
    //   }
    // }
  }

  mounted() {
    this.visualizationType = (this.$route.query.type as VisualizationType)
  }
}

</script>
<style lang="scss">
</style>
