<template>
  <div>
    <h3>Editing <code>{{ visualizationTypeLabels[visualization.type] }}</code></h3>

    <div>
      <bar-chart v-if="editedVisualization && visualizationFramework.isVisualization(editedVisualization, VisualizationType.Bar) && editedVisualization.dataSource.data && editedVisualization.dataSource.data.length" :visualization="editedVisualization" width="100%" :height="320" />
      <line-chart v-if="editedVisualization && visualizationFramework.isVisualization(editedVisualization, VisualizationType.Line)" :visualization="editedVisualization" width="100%" :height="640" />
      <radar-chart v-if="editedVisualization && visualizationFramework.isVisualization(editedVisualization, VisualizationType.Radar)" :visualization="editedVisualization" width="100%" :height="320" />
      <!-- <pie-chart
        v-if="editedVisualization && visualizationFramework.isVisualization(editedVisualization, VisualizationType.Pie)"
        :visualization="editedVisualization"
        width="100%"
        :height="640"
        /> -->
      <three-d-bar-chart v-if="editedVisualization && visualizationFramework.isVisualization(editedVisualization, VisualizationType.ThreeDBar)" :visualization="editedVisualization" width="100%" :height="640" />
    </div>

    <b-tabs content-class="mt-3" justified>
        <b-tab title="General info" active>
          <visualization-general-edit-form
            :visualization="visualization"
            @submit="onSubmit"
            @update="onUpdate"
            />
        </b-tab>
        <b-tab title="Visualization settings">
          <bar-chart-edit-form
            v-if="visualization.type === VisualizationType.Bar"
            :visualization="visualization"
            @submit="onSubmit"
            @update="onUpdate"
            />
          <line-chart-edit-form
            v-if="visualization.type === VisualizationType.Line"
            :visualization="visualization"
            @submit="onSubmit"
            @update="onUpdate"
            />
          <radar-chart-edit-form
            v-if="visualization.type === VisualizationType.Radar"
            :visualization="visualization"
            @submit="onSubmit"
            @update="onUpdate"
            />
          <!-- <pie-chart-edit-form
            v-if="visualization.type === VisualizationType.Pie"
            :visualization="visualization"
            @submit="onSubmit"
            @update="onUpdate"
            /> -->

          <!-- 3D -->
          <three-d-bar-chart-edit-form
            v-if="visualization.type === VisualizationType.ThreeDBar"
            :visualization="visualization"
            @submit="onSubmit"
            @update="onUpdate"
            />
        </b-tab>
      </b-tabs>

      <b-button @click="onSubmit" type="submit" variant="primary">Update</b-button>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash'
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator' // , Watch

import { DataSourceType, DataSourceEntity } from '@/../types/framework'
import * as VisualizationFramework from '@/../types/visualization-framework'

import { frameworkStore } from '@/store'

// interface VisualizationCreateInput {
//   type: string
//   dataSource: any
// }

// Edit forms
import VisualizationGeneralEditForm from '@/components/app/Visualization/crud/VisualizationGeneralEditForm.vue'
// Visualization-specific
import BarChartEditForm from '@/components/app/Visualization/crud/edit/BarChartEditForm.vue'
import RadarChartEditForm from '@/components/app/Visualization/crud/edit/RadarChartEditForm.vue'
import LineChartEditForm from '@/components/app/Visualization/crud/edit/LineChartEditForm.vue'
// import PieChartEditForm from '@/components/app/Visualization/crud/edit/PieChartEditForm.vue'
import ThreeDBarChartEditForm from '@/components/app/Visualization/crud/edit/ThreeDBarChartEditForm.vue'
// Components for preview
import LineChart from '@/components/app/visualizations/charts/LineChart.vue'
import BarChart from '@/components/app/visualizations/charts/BarChart.vue'
import RadarChart from '@/components/app/visualizations/charts/RadarChart.vue'
// import PieChart from '@/components/app/visualizations/charts/PieChart.vue'
import ThreeDBarChart from '@/components/app/visualizations/custom/3D/ThreeDBarChart.vue'

@Component({
  components: {
    VisualizationGeneralEditForm,
    //
    // Visualizations
    //
    BarChart,
    LineChart,
    RadarChart,
    // PieChart,
    // 3D
    ThreeDBarChart,
    //
    // Forms
    //
    BarChartEditForm,
    RadarChartEditForm,
    LineChartEditForm,
    // PieChartEditForm,
    // 3D
    ThreeDBarChartEditForm,
  }
})
export default class VisualizationEditor extends Vue {
  @Prop() visualization!: VisualizationFramework.VisualizationEntity
  editedVisualization?: VisualizationFramework.VisualizationEntity = null

  // form: VisualizationCreateInput = {
  //   type: "",
  //   dataSource: {}
  // }
  VisualizationType = VisualizationFramework.VisualizationType
  visualizationTypeLabels = VisualizationFramework.visualizationTypeLabels
  visualizationFramework = VisualizationFramework

  onSubmit() {
    frameworkStore.dashboardComponent.visualization.update({ visualization: this.editedVisualization })
  }

  onUpdate(form: any) {
    // console.log('onUpdate', form)
    this.editedVisualization = cloneDeep({ ...this.visualization, ...form })
  }

  onReset() {
  }

  mounted() {
    // this.editedVisualization = this.visualization
  }
}


</script>
