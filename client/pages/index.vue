<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

enum DashboardMode {
  Admin,
  User,
  Edit // WYSIWYG
}

@Component({
  layout: 'framework/base',
  components: {
  },
})
export default class Index extends Vue {
  // TODO make this vuex so that any component can change mode via action
  mode: DashboardMode = DashboardMode.Admin

  mounted() {
    // TODO auth wall
    // TODO parse URL param for first launch setup and show "Preparing..."

    // TODO - determine mode?
    // Admin/organization mode - creation, and deletion of dashboards, organization/company overview etc.
    // User mode - a particular dashboard in view/read-only
    // Edit mode - a particular dashboard in read/update
    this.$router.push({ path: '/admin/' })
  }
}

</script>


<style lang="scss">

</style>
