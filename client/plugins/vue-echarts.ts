import Vue from 'vue'

import 'echarts'
import 'echarts-gl'
// @ts-ignore
import ECharts from 'vue-echarts'

export default function() {
  // Register globally
  Vue.component('v-chart', ECharts)
}

