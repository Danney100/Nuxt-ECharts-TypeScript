<template>
  <default-layout :menu="menu">
    <template v-slot:navbar>
      <b-navbar-nav>
        <b-nav-item>{{ title }}</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-if="hasMainToolbar">
        <transition name="fade">
          <!-- <profiler-toolbar-main v-if="mainToolbar === 'profiler'"></profiler-toolbar-main> -->
        </transition>
      </b-navbar-nav>
      <b-navbar-nav v-if="hasControlsToolbar" class="ml-auto">
        <transition name="fade">
          <!-- <profiler-toolbar-controls v-if="controlsToolbar === 'profiler'"></profiler-toolbar-controls> -->
        </transition>
      </b-navbar-nav>
    </template>
    <nuxt class="dashboard-content-view" :pageTransition="pageBlockTransition" />
  </default-layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

import DefaultLayout from '../default'
import adminMenuItems from '@/config/admin/menu-items'

// import ProfilerToolbarMain from '@/components/app/visualizations/custom/Profiler/ProfilerToolbarMain'
// import ProfilerToolbarControls from '@/components/app/visualizations/custom/Profiler/ProfilerToolbarControls'
import { frameworkStore } from '@/store'

@Component({
  components: {
    DefaultLayout,
//    ProfilerToolbarMain,
//    ProfilerToolbarControls
  }
})
export default class AdminLayout extends Vue {
  menu: any = adminMenuItems

  title: string = "Admin" // TODO configurable title

  mainToolbar: string = ''
  controlsToolbar: string = ''

  get hasMainToolbar() {
    return !!this.mainToolbar.length
  }

  get hasControlsToolbar() {
    return !!this.controlsToolbar.length
  }

  get pageBlockTransition() {
    return {
      name: 'page-block',
      mode: 'out-in'
    }
  }

  update(route: Route) {
    // TODO toolbar block? editable in some kind of toolbar editor?
    if (route.name === 'admin-dashboard-components-profiler-ui') {
      this.mainToolbar = 'profiler'
      this.controlsToolbar = 'profiler'
      this.title = 'Profiler'
    }
    else {
      this.mainToolbar = ''
      this.controlsToolbar = ''
      this.title = 'Admin'
    }
  }

  @Watch('$route')
  onRouteChanged(newVal: Route) {
    this.update(newVal)
  }

  mounted() {
    this.update(this.$route)
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .75s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
