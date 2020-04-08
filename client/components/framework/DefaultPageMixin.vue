<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
  },
})
export default class DefaultPageMixin extends Vue {
  get pageTransition() {
    return {
      name: 'page',
      mode: 'out-in'
    }
  }

}
</script>
