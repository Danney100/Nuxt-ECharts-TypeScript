import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
// import { ModuleTree } from 'vuex'

import { AuthUser } from '@/../types/framework'

import DashboardComponentModule from '../DashboardComponent'
import DataSourceModule from '../DataSource'

@Module({
  name: 'framework',
  namespaced: true,
  stateFactory: true
})
export default class FrameworkModule extends VuexModule {
  // Needs nested modules
  // public static modules?: ModuleTree<any> = {
  //   dashboard: DashboardModule
  // }
  dashboardComponent?: DashboardComponentModule
  dataSource?: DataSourceModule

  user?: AuthUser
  changedMode: boolean = false
  oldMode: string = ""
  mode: string = "admin"

  @Mutation
  changeMode(mode?: string) {
    // console.log('changedMode', mode)
    // console.log(this.mode, this.oldMode, this.changedMode)

    if (!mode) {
      this.changedMode = false
    }
    else {
      this.oldMode = this.mode
      this.mode = (mode as string)
      this.changedMode = true
    }
  }

  error: boolean = false
}
