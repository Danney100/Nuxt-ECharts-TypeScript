<template>
  <div class="row">
    <div class="col-md-4"
         v-for="dashComponent in dashboardComponents"
         :key="dashComponent.id">
      <b-card
        no-body>
        <b-card-header>
         <i :class="getIcon(dashComponent)"></i> {{ dashComponent.title }}
        </b-card-header>
        <b-card-body>
          Id: <code>{{ dashComponent.id }}<br></code>
        </b-card-body>
        <b-card-footer>
          <b-button :to="getConfigureRoute(dashComponent.componentType, dashComponent.id)" size="sm"><i class="dripicons-gear"></i> Configure</b-button>
        </b-card-footer>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator' // , Watch

import { DashboardComponentType, DashboardComponentEntity } from '@/../types/framework'
import { VisualizationType, VisualizationEntity } from '@/../types/visualization-framework'

const visualizationTypeIcons: any = {
  [VisualizationType.Bar]: 'dripicons-graph-bar'
}

@Component({})
export default class DashboardComponentList extends Vue {
  @Prop() dashboardComponents!: Array<DashboardComponentEntity>

  getIcon(component: DashboardComponentEntity) {
    if (component.componentType === DashboardComponentType.Visualization) {
      return visualizationTypeIcons[(component as VisualizationEntity).type]
    }
    if (component.componentType === DashboardComponentType.Table) {
      return 'fa fa-table'
    }
    return ''
  }

  getConfigureRoute(componentType: DashboardComponentType, id: string) {
    if (componentType === DashboardComponentType.Visualization) {
      return { name: 'admin-dashboard-components-visualization-editor-id', params: { id } }
    }
    else if (componentType === DashboardComponentType.Table) {
      return { name: 'admin-dashboard-components-table-editor-id', params: { id } }
    }
  }

  mounted() {
    // console.log(this.dashboardComponents)
    // console.log(this.componentTypeLabels)
  }
}
</script>

<style lang="scss" scoped>
.card {
  height: 160px;
  box-shadow: rgba(120, 131, 132, 0.3) 2px 2px 8px -5px;
  border: 1px solid #edecec;
  border-top: 1px solid rgba(182, 186, 208, 0.32);
  font-size: .75rem;
  .card-header {
    background: linear-gradient(#fdfdfd,#f0f4f7);
    text-shadow: 0 0 1px rgba(177, 169, 215, 0.45);
    border-bottom: 1px solid #edecec;
  }
}
</style>
