<template>
  <b-breadcrumb v-if="usedBreadcrumb" :items="usedBreadcrumb"></b-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator'
import { Route } from 'vue-router/types'

import adminMenuItems from '@/config/admin/menu-items'

@Component({})
export default class Breadcrumb extends Vue {
  // Dynamic breadcrumb not based route
  @Prop() breadcrumb!: any
  usedBreadcrumb: any = []

  mounted() {
    if (this.breadcrumb) {
      this.usedBreadcrumb = this.breadcrumb.slice()
    }
    else {
      // Based on route if in route meta
      this.usedBreadcrumb = this.$route.meta && this.$route.meta.breadcrumb ? this.$route.meta.breadcrumb : null;
    }
  }

  @Watch('breadcrumb')
  onRouteChanged(val: any) {
    this.usedBreadcrumb = this.breadcrumb.slice()
  }

  @Watch('$route')
  onRouteChanged(val: Route) {
    if (!this.breadcrumb) {
      this.usedBreadcrumb = val.meta && val.meta.breadcrumb ? val.meta.breadcrumb : null;
    }
  }
}
</script>

<style lang="scss">
.breadcrumb {
  background: linear-gradient(#eceded, #f8fbfd 5%, #f8fbfd 98%, #ececed 80%);
  border: 1px solid rgba(182, 186, 208, 0.32);
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-top: none;
}
</style>
