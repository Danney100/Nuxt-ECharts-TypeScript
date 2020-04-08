import Vue from 'vue'

import AOS from 'aos'
import 'aos/dist/aos.css'

export default function () {
  Vue.prototype.$aos = AOS
}
