import Vue from 'vue'

Vue.filter('truncate', function (text: string, length: number, suffix: string) {
  if (text.length > length) {
    return text.substring(0, length) + suffix
  }
  else {
    return text
  }
})
