<template>
  <div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

enum TimelinePlayState {
  Started,
  Playing,
  Paused,
  Stopped
}

const baseConfig = {
  baseOption: {
    timeline: {
      axisType: 'category',
      data: [],
      padding: [10, 0, 10, 0]
    }
  }
}

@Component({
  components: {
  },
})
export default class TimelineVisualizationMixin extends Vue {
  options: any = baseConfig

  mounted() {
  }
}


</script>
