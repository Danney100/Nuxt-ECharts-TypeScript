// dependency of Morris
import Raphael from 'raphael/raphael'
import Vue from 'vue'

import { DonutChart } from 'vue-morris'

global.Raphael = Raphael
Vue.component('morris-donut-chart', DonutChart)
