<template>
  <div>
    Tested component goes here
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'framework/admin',
  components: {
  },
})
export default class AdminIndex extends Vue {
  mounted() {
  }
}

</script>


<style lang="scss">
@import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
</style>
