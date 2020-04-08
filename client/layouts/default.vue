<template>
  <div class="container-body">
    <!-- Side Menu -->
    <nav class="nav-sidebar">
      <client-only>
        <sidebar-menu
          id="main-menu"
          theme="white-theme"
          :menu="menu"
          :collapsed="menuCollapsed"
          @toggle-collapse="onToggleCollapse"
          widthCollapsed="92px"
          >
          <span slot="header">
            <div style="width: 100%; height: 100%">
              <img v-if="menuCollapsed" src="/img/Logo-no-text.png" width="100%" style="max-height: 92px" />
              <img v-else src="/img/Logo.png" width="80%" />
            </div>
          </span>
          <span slot="toggle-icon"><i class="dripicons-scale"></i></span>
          <span slot="dropdown-icon"><i style="font-size: 12px" class="lnr lnr-chevron-right"></i></span>
        </sidebar-menu>
      </client-only>
    </nav>

    <!-- Content-->
    <main id="main-content">
      <nav-bar :changedMode="changedMode">
        <slot name="navbar">
          <b-navbar-nav>
            <b-nav-item>Dashboard</b-nav-item>
          </b-navbar-nav>
        </slot>
      </nav-bar>

      <b-container class="container-content h-100">
        <slot name="breadcrumb">
          <breadcrumb />
        </slot>
        <dashboard-page>
          <nuxt v-if="!$slots.default" />
          <slot />
        </dashboard-page>
      </b-container>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

//if (process.browser) {
import { SidebarMenu } from 'vue-sidebar-menu'
//}

import DashboardPage from '@/components/framework/DashboardPage'
import NavBar from '@/components/framework/NavBar'
import Breadcrumb from '@/components/framework/Breadcrumb'

import { frameworkStore } from '@/store'

@Component({
  components: {
    SidebarMenu,
    DashboardPage,
    NavBar,
    Breadcrumb
  }
})
export default class DefaultLayout extends Vue {
  @Prop() menu!: any
  menuCollapsed: boolean = true
  //changedMode: boolean = true

  get layoutTransition() {
    return {
      name: 'layout',
      mode: 'out-in'
    }
  }

  onToggleCollapse(collapsed: boolean) {
    this.menuCollapsed = collapsed
  }

  get changedMode() {
    // console.log('computed: ', frameworkStore.changedMode)
    return frameworkStore.changedMode
  }

  @Watch('$route')
  onRouteChanged(newRoute: Route, oldRoute: Route) {
    if (!oldRoute.name) {
      return
    }
    if (frameworkStore.newMode !== 'editor' && newRoute.name.indexOf('editor') === 0 && oldRoute.name.indexOf('admin') === 0) {
      // next mode's navbar will get animated into frame
      frameworkStore.changeMode('editor')
    }
    else if(frameworkStore.newMode !== 'admin' && newRoute.name.indexOf('admin') === 0 && oldRoute.name.indexOf('editor') === 0) {
      // next mode's navbar will get animated into frame
      frameworkStore.changeMode('admin')
    }
  }

  mounted() {
    // TODO - determine mode?
    // Admin/organization mode - creation, and deletion of dashboards, organization/company overview etc.
    // User mode - a particular dashboard in view/read-only
    // Edit mode - a particular dashboard in read/update
    if (frameworkStore.changedMode) {
      // console.log('this.changedMode: ', this.changedMode)
      //      this.changedMode = true
      this.$nextTick(() => frameworkStore.changeMode())
    }
  }
}
</script>

<style lang="scss">
@import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
@import "~@@/client/styles/framework/styles.scss";
</style>
