<template>
  <div>
    <b-card
      v-if="hasNoDashboardComponents"
      class="intro-card"
      border-variant="dark"
      header="Get started using Components"
      header-bg-variant="dark"
      header-text-variant="white"
      align="center"
      >
      <b-card-text>Browse the <router-link to="visualization-library">Visualization Library</router-link> to begin</b-card-text>
    </b-card>
    <div v-else>
      <h3>Visualizations</h3>
      <dashboard-component-list
        :dashboardComponents="visualizations" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import DefaultPageMixin from '@/components/framework/DefaultPageMixin'


import { DashboardComponentType } from '@/../types/framework'
import { frameworkStore } from '@/store'
import DashboardComponentList from '@/components/app/DashboardComponent/crud/DashboardComponentList'

@Component({
  layout: 'framework/admin',
  components: {
    DashboardComponentList
  }
})
export default class DashboardComponentsIndex extends mixins(DefaultPageMixin) {
  get visualizations(): Array<VisualizationEntity> {
    return this.dashboardComponents.filter(c => c.componentType === DashboardComponentType.Visualization)
  }

  get dashboardComponents() {
    // console.log(frameworkStore.dashboardComponent.dashboardComponents)
    return frameworkStore.dashboardComponent.dashboardComponents
  }

  get hasNoDashboardComponents() {
    return !this.dashboardComponents.length
  }

  async fetch() {
    await frameworkStore.dashboardComponent.fetchAll()
  }
}

</script>
<style lang="scss">
</style>
